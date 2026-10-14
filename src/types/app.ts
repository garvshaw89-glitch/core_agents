export type AgentStatus = 'draft' | 'active' | 'paused' | 'needs_attention';
export type AgentCategory = 'research' | 'coding' | 'learning' | 'business' | 'operations' | 'monitoring' | 'custom';

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  status: AgentStatus;
  iconName: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  triggerType: 'scheduled' | 'webhook' | 'manual';
  schedule?: string;
  tools: string[];
  instructions: string;
  humanApprovalRequired: boolean;
  assignedWorkflowsCount?: number;
}

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'failed';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerType: 'schedule' | 'webhook' | 'manual';
  schedule?: string;
  agentId: string;
  agentName: string;
  lastExecutionAt?: string;
  nextScheduledAt?: string;
  stepsCount: number;
  approvalRequired: boolean;
  createdAt: string;
}

export type ActivityStatus = 'completed' | 'running' | 'failed' | 'awaiting_approval';

export interface ActivityStep {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'failed' | 'awaiting_approval' | 'pending';
  durationMs?: number;
  details?: string;
}

export interface ActivityRecord {
  id: string;
  runId: string;
  agentId: string;
  agentName: string;
  triggerType: string;
  startTime: string;
  durationMs?: number;
  status: ActivityStatus;
  outputSummary: string;
  errorDetails?: string;
  logs: string[];
  steps: ActivityStep[];
}

export type KnowledgeType = 'document' | 'note' | 'source';
export type KnowledgeStatus = 'indexing' | 'ready' | 'error';

export interface KnowledgeItem {
  id: string;
  name: string;
  type: KnowledgeType;
  sizeBytes: number;
  status: KnowledgeStatus;
  updatedAt: string;
  sourceUrl?: string;
  tokensCount?: number;
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'coming_soon';

export interface Integration {
  id: string;
  name: string;
  category: 'developer' | 'productivity' | 'communication' | 'automation';
  description: string;
  status: IntegrationStatus;
  scopes: string[];
  icon: string;
  connectedAt?: string;
  authEndpoint?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  workspaceName: string;
}
