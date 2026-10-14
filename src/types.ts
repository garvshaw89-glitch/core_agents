export type SpecialistType = 'research' | 'coding' | 'learning' | 'operations';

export interface AgentTemplate {
  id: SpecialistType;
  title: string;
  tagline: string;
  description: string;
  activeTask: string;
  approvalStatus: string;
  tools: string[];
  sampleTrigger: string;
  sampleOutput: string;
  guardrail: string;
}

export interface WorkflowStep {
  id: number;
  label: string;
  sublabel: string;
  status: 'completed' | 'active' | 'gate' | 'upcoming';
  detail: string;
  payloadTitle: string;
  payloadContent: string;
}
