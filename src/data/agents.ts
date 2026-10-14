import { AgentTemplate } from '../types';

export const SPECIALIST_AGENTS: AgentTemplate[] = [
  {
    id: 'research',
    title: 'Research Specialist',
    tagline: 'Competitive intelligence & market analysis',
    description: 'Research competitors, gather source-linked information, and prepare structured executive reports.',
    activeTask: 'Compiling weekly competitive analysis across 4 public changelogs',
    approvalStatus: 'Human sign-off required prior to Slack / email dispatch',
    tools: ['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer', 'Diff Analyzer'],
    sampleTrigger: 'Every Monday at 08:00 UTC',
    sampleOutput: 'Executive briefing with 12 cited public sources and prioritized feature delta matrix.',
    guardrail: 'Restricted to approved public URLs. Cannot publish externally without manual human approval.'
  },
  {
    id: 'coding',
    title: 'Coding Specialist',
    tagline: 'Repository inspection & PR proposals',
    description: 'Analyze repositories, investigate bugs, and propose structured code changes with regression test plans.',
    activeTask: 'Scanning open GitHub issues for reproduced race conditions in queue worker',
    approvalStatus: 'Drafts PR in staging branch; merge privileges strictly prohibited',
    tools: ['Git Read-Only Client', 'AST Code Parser', 'Test Suite Runner', 'PR Draft Generator'],
    sampleTrigger: 'On incoming issue with label "needs-triage"',
    sampleOutput: 'Isolated root cause diagnosis with a proposed 4-line patch and passing unit test case.',
    guardrail: 'Isolated sandbox environment. No direct write access to main branch or deployment credentials.'
  },
  {
    id: 'learning',
    title: 'Learning Specialist',
    tagline: 'Curriculum design & guided tutoring',
    description: 'Build personalized study plans, create interactive exercises, and track progressive skill mastery.',
    activeTask: 'Generating step-by-step distributed systems practice module',
    approvalStatus: 'Curriculum updates require student acceptance before scheduling',
    tools: ['Concept Map Engine', 'Exercise Generator', 'Progress Tracker', 'Reference Indexer'],
    sampleTrigger: 'On topic submission or completed quiz review',
    sampleOutput: '3-week progressive mastery roadmap with verified textbook citations and practical exercises.',
    guardrail: 'Only sources verified educational materials. Automatic detection prevents conceptual hallucinations.'
  },
  {
    id: 'operations',
    title: 'Operations Specialist',
    tagline: 'Source monitoring & repeatable tasks',
    description: 'Monitor approved data sources, prepare recurring operational digests, and execute repeatable business hygiene.',
    activeTask: 'Auditing cloud resource utilization against approved budget thresholds',
    approvalStatus: 'Resource reconfiguration alerts require DevOps lead authorization',
    tools: ['Telemetry Query Tool', 'Report Generator', 'Threshold Watcher', 'Audit Log Staging'],
    sampleTrigger: 'Daily at 00:00 UTC and on anomalous threshold delta',
    sampleOutput: 'Daily operations digest highlighting 3 orphaned test clusters and recommended savings.',
    guardrail: 'Read-only access across infrastructure metrics. Modifying live infrastructure is strictly blocked.'
  }
];
