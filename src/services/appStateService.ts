import { Agent, Workflow, ActivityRecord, KnowledgeItem, Integration, UserProfile } from '../types/app';
import { INITIAL_AGENTS, INITIAL_WORKFLOWS, INITIAL_ACTIVITIES, INITIAL_KNOWLEDGE, INITIAL_INTEGRATIONS } from './initialData';

const STORAGE_KEY_PREFIX = 'core_agents_';

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

  saveAgent(agent: Agent): void {
    const current = this.getAgents();
    const index = current.findIndex((a) => a.id === agent.id);
    let updated: Agent[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...agent, updatedAt: new Date().toISOString() };
    } else {
      updated = [agent, ...current];
    }
    this.setItem('agents', updated);
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
