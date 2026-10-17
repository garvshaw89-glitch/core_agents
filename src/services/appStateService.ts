import { Agent, AgentVersion, Workflow, ActivityRecord, KnowledgeItem, Integration, UserProfile } from '../types/app';
import { INITIAL_AGENTS, INITIAL_WORKFLOWS, INITIAL_ACTIVITIES, INITIAL_KNOWLEDGE, INITIAL_INTEGRATIONS } from './initialData';

const STORAGE_KEY_PREFIX = 'core_agents_';

function computeAgentDiff(prev: Agent, next: Agent): string[] {
  const diffs: string[] = [];
  if (prev.name !== next.name) diffs.push(`Renamed from "${prev.name}" to "${next.name}"`);
  if (prev.description !== next.description) diffs.push('Updated description');
  if (prev.status !== next.status) diffs.push(`Status changed to ${next.status}`);
  if (prev.instructions !== next.instructions) {
    const prevLen = prev.instructions?.length || 0;
    const nextLen = next.instructions?.length || 0;
    diffs.push(`Instructions revised (${prevLen} → ${nextLen} chars)`);
  }
  if (prev.modelConfig?.modelId !== next.modelConfig?.modelId && next.modelConfig?.modelId) {
    diffs.push(`Model switched to ${next.modelConfig.modelId}`);
  }
  if (prev.modelConfig?.temperature !== next.modelConfig?.temperature && next.modelConfig?.temperature !== undefined) {
    diffs.push(`Temperature set to ${next.modelConfig.temperature}`);
  }
  const prevTools = new Set(prev.tools || []);
  const nextTools = new Set(next.tools || []);
  const addedTools = [...nextTools].filter((t) => !prevTools.has(t));
  const removedTools = [...prevTools].filter((t) => !nextTools.has(t));
  if (addedTools.length > 0) diffs.push(`Added ${addedTools.length} tool(s): ${addedTools.slice(0, 2).join(', ')}${addedTools.length > 2 ? '...' : ''}`);
  if (removedTools.length > 0) diffs.push(`Removed ${removedTools.length} tool(s)`);

  const prevK = prev.selectedKnowledgeIds || [];
  const nextK = next.selectedKnowledgeIds || [];
  if (prevK.length !== nextK.length || !prevK.every((k) => nextK.includes(k))) {
    diffs.push(`Knowledge attachments modified (${nextK.length} source(s))`);
  }

  if (prev.humanApprovalRequired !== next.humanApprovalRequired) {
    diffs.push(next.humanApprovalRequired ? 'Enabled human review gate' : 'Switched to autonomous execution');
  }

  return diffs.length > 0 ? diffs : ['Configuration saved'];
}

class AppStateService {
  private isZeroStateMode = false;

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      // Fallback
    }
  }

  // Zero-state toggle for testing and evaluating empty states
  isZeroState(): boolean {
    return this.isZeroStateMode;
  }

  setZeroStateMode(enabled: boolean) {
    this.isZeroStateMode = enabled;
  }

  // --- Agents ---
  getAgents(): Agent[] {
    if (this.isZeroStateMode) return [];
    return this.getItem<Agent[]>('agents', INITIAL_AGENTS);
  }

  getAgentById(id: string): Agent | undefined {
    return this.getAgents().find((a) => a.id === id);
  }

  saveAgent(agent: Agent, createVersionRecord = true, versionLabel?: string): void {
    const current = this.getAgents();
    const index = current.findIndex((a) => a.id === agent.id);
    const existingAgent = index >= 0 ? current[index] : null;
    let updated: Agent[];
    const now = new Date().toISOString();
    const updatedAgent: Agent = { ...agent, updatedAt: now };

    if (index >= 0) {
      updated = [...current];
      updated[index] = updatedAgent;
    } else {
      updated = [updatedAgent, ...current];
    }
    this.setItem('agents', updated);

    // Automatically manage version snapshot
    if (createVersionRecord) {
      this.recordAgentVersion(updatedAgent, existingAgent, versionLabel);
    }
  }

  // --- Agent Version History ---
  getAgentVersions(agentId: string): AgentVersion[] {
    const versions = this.getItem<AgentVersion[]>(`versions_${agentId}`, []);
    if (versions.length > 0) {
      return versions;
    }

    // Seed baseline version if none exists yet for an existing agent
    const agent = this.getAgentById(agentId);
    if (!agent) return [];

    const baselineVersion: AgentVersion = {
      id: `ver-${agentId}-1`,
      agentId: agent.id,
      versionNumber: 1,
      timestamp: agent.createdAt || new Date(Date.now() - 3600000 * 48).toISOString(),
      label: agent.sourceTemplateName ? `Imported from ${agent.sourceTemplateName}` : 'Initial Agent Creation',
      author: 'Alex Mercer (Lead)',
      changesSummary: [
        'Initial agent specification',
        `${agent.tools.length} default tools connected`,
        agent.humanApprovalRequired ? 'Human approval gate configured' : 'Autonomous execution configured',
      ],
      snapshot: { ...agent },
    };

    const initialList = [baselineVersion];
    this.setItem(`versions_${agentId}`, initialList);
    return initialList;
  }

  recordAgentVersion(agent: Agent, previousAgent?: Agent | null, label?: string): AgentVersion {
    const existingVersions = this.getAgentVersions(agent.id);
    const nextNumber = existingVersions.length > 0 
      ? Math.max(...existingVersions.map((v) => v.versionNumber)) + 1 
      : 1;

    const changes = previousAgent 
      ? computeAgentDiff(previousAgent, agent)
      : ['Initial agent creation'];

    const newVersion: AgentVersion = {
      id: `ver-${agent.id}-${Date.now()}`,
      agentId: agent.id,
      versionNumber: nextNumber,
      timestamp: new Date().toISOString(),
      label: label || `Version ${nextNumber} Save`,
      author: 'Alex Mercer (Lead)',
      changesSummary: changes,
      snapshot: JSON.parse(JSON.stringify(agent)),
    };

    // Keep most recent versions first
    const updatedVersions = [newVersion, ...existingVersions];
    this.setItem(`versions_${agent.id}`, updatedVersions);
    return newVersion;
  }

  revertAgentToVersion(agentId: string, versionId: string): Agent | null {
    const versions = this.getAgentVersions(agentId);
    const targetVersion = versions.find((v) => v.id === versionId);
    if (!targetVersion) return null;

    const currentAgent = this.getAgentById(agentId);
    const now = new Date().toISOString();

    // Create a new updated agent state restored from snapshot
    const restoredAgent: Agent = {
      ...JSON.parse(JSON.stringify(targetVersion.snapshot)),
      id: agentId,
      updatedAt: now,
    };

    // Save with a dedicated "Reverted to vX" version log
    const nextNumber = versions.length > 0 
      ? Math.max(...versions.map((v) => v.versionNumber)) + 1 
      : 1;

    const revertLogVersion: AgentVersion = {
      id: `ver-${agentId}-${Date.now()}`,
      agentId: agentId,
      versionNumber: nextNumber,
      timestamp: now,
      label: `Reverted to v${targetVersion.versionNumber}`,
      author: 'Alex Mercer (Lead)',
      changesSummary: [
        `Restored snapshot from v${targetVersion.versionNumber} (${targetVersion.label || 'Saved checkpoint'})`,
        ...(currentAgent ? computeAgentDiff(currentAgent, restoredAgent) : []),
      ],
      snapshot: JSON.parse(JSON.stringify(restoredAgent)),
    };

    // Update agent storage
    const currentAgents = this.getAgents();
    const index = currentAgents.findIndex((a) => a.id === agentId);
    if (index >= 0) {
      currentAgents[index] = restoredAgent;
      this.setItem('agents', currentAgents);
    }

    // Save versions with the new restore event
    this.setItem(`versions_${agentId}`, [revertLogVersion, ...versions]);

    return restoredAgent;
  }

  deleteAgent(id: string): void {
    const current = this.getAgents().filter((a) => a.id !== id);
    this.setItem('agents', current);
  }

  toggleAgentPause(id: string): Agent | null {
    const current = this.getAgents();
    const agent = current.find((a) => a.id === id);
    if (!agent) return null;

    const newStatus = agent.status === 'paused' ? 'active' : 'paused';
    const updated = current.map((a) =>
      a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
    );
    this.setItem('agents', updated);
    return { ...agent, status: newStatus };
  }

  duplicateAgent(id: string): Agent | null {
    const agent = this.getAgentById(id);
    if (!agent) return null;

    const newAgent: Agent = {
      ...agent,
      id: `agent-${Math.random().toString(36).substring(2, 9)}`,
      name: `${agent.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRunAt: undefined,
    };
    this.saveAgent(newAgent);
    return newAgent;
  }

  // --- Workflows ---
  getWorkflows(): Workflow[] {
    if (this.isZeroStateMode) return [];
    return this.getItem<Workflow[]>('workflows', INITIAL_WORKFLOWS);
  }

  saveWorkflow(workflow: Workflow): void {
    const current = this.getWorkflows();
    const index = current.findIndex((w) => w.id === workflow.id);
    let updated: Workflow[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = workflow;
    } else {
      updated = [workflow, ...current];
    }
    this.setItem('workflows', updated);
  }

  toggleWorkflow(id: string): Workflow | null {
    const current = this.getWorkflows();
    const wf = current.find((w) => w.id === id);
    if (!wf) return null;

    const newStatus = wf.status === 'active' ? 'paused' : 'active';
    const updated = current.map((w) => (w.id === id ? { ...w, status: newStatus } : w));
    this.setItem('workflows', updated);
    return { ...wf, status: newStatus };
  }

  deleteWorkflow(id: string): void {
    const current = this.getWorkflows().filter((w) => w.id !== id);
    this.setItem('workflows', current);
  }

  // --- Activities ---
  getActivities(): ActivityRecord[] {
    if (this.isZeroStateMode) return [];
    return this.getItem<ActivityRecord[]>('activities', INITIAL_ACTIVITIES);
  }

  approveActivity(id: string): ActivityRecord | null {
    const current = this.getActivities();
    const act = current.find((a) => a.id === id);
    if (!act) return null;

    const updatedSteps = act.steps.map((s) =>
      s.status === 'awaiting_approval' ? { ...s, status: 'completed' as const, details: 'Authorized by workspace operator' } : s
    );

    const updated = current.map((a) =>
      a.id === id
        ? {
            ...a,
            status: 'completed' as const,
            outputSummary: `${a.outputSummary} [Approved & Dispatched]`,
            logs: [...a.logs, `[${new Date().toISOString().substring(11, 19)}] Action approved by human operator. Output released.`],
            steps: updatedSteps,
          }
        : a
    );
    this.setItem('activities', updated);
    return updated.find((a) => a.id === id) || null;
  }

  // --- Knowledge ---
  getKnowledge(): KnowledgeItem[] {
    if (this.isZeroStateMode) return [];
    return this.getItem<KnowledgeItem[]>('knowledge', INITIAL_KNOWLEDGE);
  }

  addKnowledge(item: KnowledgeItem): void {
    const current = this.getKnowledge();
    this.setItem('knowledge', [item, ...current]);
  }

  deleteKnowledge(id: string): void {
    const current = this.getKnowledge().filter((k) => k.id !== id);
    this.setItem('knowledge', current);
  }

  // --- Integrations ---
  getIntegrations(): Integration[] {
    return this.getItem<Integration[]>('integrations', INITIAL_INTEGRATIONS);
  }

  toggleIntegration(id: string): Integration | null {
    const current = this.getIntegrations();
    const item = current.find((i) => i.id === id);
    if (!item) return null;

    const newStatus = item.status === 'connected' ? 'disconnected' : 'connected';
    const updated = current.map((i) =>
      i.id === id
        ? {
            ...i,
            status: newStatus,
            connectedAt: newStatus === 'connected' ? new Date().toISOString() : undefined,
          }
        : i
    );
    this.setItem('integrations', updated);
    return { ...item, status: newStatus };
  }

  // --- User Profile ---
  getUserProfile(): UserProfile {
    return this.getItem<UserProfile>('profile', {
      name: 'Engineering Lead',
      email: 'lead@coreagents.internal',
      role: 'Workspace Administrator',
      workspaceName: 'Acme Research Labs',
    });
  }

  saveUserProfile(profile: UserProfile): void {
    this.setItem('profile', profile);
  }

  // Reset to default
  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'agents');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'workflows');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'activities');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'knowledge');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'integrations');
      this.isZeroStateMode = false;
    } catch {
      // Fallback
    }
  }
}

export const appStateService = new AppStateService();
