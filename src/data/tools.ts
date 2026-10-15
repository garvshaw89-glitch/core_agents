export type ToolCategory =
  | 'research'
  | 'development'
  | 'learning'
  | 'operations'
  | 'communication'
  | 'data';

export type ToolAccessScope = 'read_only' | 'sandboxed_execution' | 'external_state_change';
export type ToolRiskLevel = 'low' | 'moderate' | 'consequential';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  description: string;
  accessScope: ToolAccessScope;
  riskLevel: ToolRiskLevel;
  requiredIntegrationId?: string;
  requiredIntegrationName?: string;
  requiresHumanApproval: boolean;
  defaultEnabled?: boolean;
  capabilities: string[];
}

export const CORE_TOOL_REGISTRY: ToolDefinition[] = [
  // --- Research ---
  {
    id: 'tool-web-fetcher',
    name: 'Public Web Fetcher',
    category: 'research',
    categoryLabel: 'Research & Web',
    description: 'Retrieves public HTTP/HTTPS content, release notes, and documentation pages with rate limiting and robots.txt compliance.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    defaultEnabled: true,
    capabilities: ['HTML extraction', 'Markdown conversion', 'Rate-limited outbound fetch'],
  },
  {
    id: 'tool-citation-verifier',
    name: 'Citation Verifier',
    category: 'research',
    categoryLabel: 'Research & Web',
    description: 'Cross-checks extracted factual claims, statistics, and statements against raw scraped source text to prevent hallucinations.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    defaultEnabled: true,
    capabilities: ['Exact string verification', 'Levenshtein similarity check', 'Source URL anchoring'],
  },
  {
    id: 'tool-markdown-synthesizer',
    name: 'Markdown Synthesizer',
    category: 'research',
    categoryLabel: 'Research & Web',
    description: 'Synthesizes multi-source findings into structured executive digests, comparisons, and technical briefs with TOC and footnotes.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    defaultEnabled: true,
    capabilities: ['Table generation', 'Footnote synthesis', 'Executive summary clustering'],
  },

  // --- Development & Code ---
  {
    id: 'tool-git-client',
    name: 'Git Read-Only Client',
    category: 'development',
    categoryLabel: 'Code & Repositories',
    description: 'Clones and inspects repository commits, branches, and diffs without write access.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiredIntegrationId: 'int-github',
    requiredIntegrationName: 'GitHub',
    requiresHumanApproval: false,
    capabilities: ['Commit log inspection', 'Diff extraction', 'Branch comparison'],
  },
  {
    id: 'tool-ast-parser',
    name: 'AST Code Parser',
    category: 'development',
    categoryLabel: 'Code & Repositories',
    description: 'Performs syntax-tree parsing and dependency mapping across TypeScript, JavaScript, Python, and Go codebases.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['Import/export mapping', 'Function signature extraction', 'Cyclomatic complexity audit'],
  },
  {
    id: 'tool-test-runner',
    name: 'Test Suite Runner',
    category: 'development',
    categoryLabel: 'Code & Repositories',
    description: 'Executes existing unit test suites in an isolated temporary container to verify regression coverage.',
    accessScope: 'sandboxed_execution',
    riskLevel: 'moderate',
    requiresHumanApproval: false,
    capabilities: ['Vitest/Jest execution', 'Coverage calculation', 'Failure stack isolation'],
  },
  {
    id: 'tool-pr-comment-stager',
    name: 'Pull Request Comment Stager',
    category: 'development',
    categoryLabel: 'Code & Repositories',
    description: 'Stages formatted review comments and automated coverage annotations on GitHub pull requests.',
    accessScope: 'external_state_change',
    riskLevel: 'consequential',
    requiredIntegrationId: 'int-github',
    requiredIntegrationName: 'GitHub',
    requiresHumanApproval: true,
    capabilities: ['Draft comment staging', 'Inline line annotation', 'Review approval gating'],
  },

  // --- Learning & Education ---
  {
    id: 'tool-concept-map',
    name: 'Concept Map Engine',
    category: 'learning',
    categoryLabel: 'Learning & Coaching',
    description: 'Builds hierarchical visual concept trees and prerequisite dependency graphs for curriculum topics.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['Prerequisite sequencing', 'Knowledge graph nodes', 'Bloom taxonomy ranking'],
  },
  {
    id: 'tool-exercise-generator',
    name: 'Exercise Generator',
    category: 'learning',
    categoryLabel: 'Learning & Coaching',
    description: 'Generates progressive code drills, multiple-choice questions, and comprehension exercises with verifiable answer keys.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['Difficulty scaling', 'Rubric creation', 'Hint generation'],
  },
  {
    id: 'tool-progress-tracker',
    name: 'Progress Tracker',
    category: 'learning',
    categoryLabel: 'Learning & Coaching',
    description: 'Tracks user mastery scores, concept retention intervals, and spaced-repetition schedules.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['Mastery score calculation', 'Spaced repetition queue', 'Syllabus status checkpoint'],
  },

  // --- Operations & Telemetry ---
  {
    id: 'tool-telemetry-query',
    name: 'Telemetry Query Tool',
    category: 'operations',
    categoryLabel: 'Operations & Monitoring',
    description: 'Queries compute utilization metrics, memory headroom, and cluster cost allocations from cloud providers.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['Metric aggregation', 'Cost allocation breakdown', 'Idle node detection'],
  },
  {
    id: 'tool-threshold-watcher',
    name: 'Threshold Watcher',
    category: 'operations',
    categoryLabel: 'Operations & Monitoring',
    description: 'Evaluates telemetry data against operator-defined budget ceilings and SLO limits.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['SLO evaluation', 'Budget threshold alert', 'Anomaly detection'],
  },
  {
    id: 'tool-http-prober',
    name: 'HTTP Health Prober',
    category: 'operations',
    categoryLabel: 'Operations & Monitoring',
    description: 'Pings whitelisted internal or external HTTP endpoints to verify response latency, status codes, and SSL expiry.',
    accessScope: 'read_only',
    riskLevel: 'low',
    requiresHumanApproval: false,
    capabilities: ['Latency measurement', 'Status code verification', 'TLS cert expiry check'],
  },
  {
    id: 'tool-incident-stager',
    name: 'Incident Alert Staging',
    category: 'operations',
    categoryLabel: 'Operations & Monitoring',
    description: 'Stages incident escalation notices and operational health summaries for human review before broadcast.',
    accessScope: 'external_state_change',
    riskLevel: 'consequential',
    requiredIntegrationId: 'int-webhook',
    requiredIntegrationName: 'Generic Inbound Webhook',
    requiresHumanApproval: true,
    capabilities: ['Incident payload formatting', 'Severity tagging', 'On-call escalation gate'],
  },

  // --- Communication & External ---
  {
    id: 'tool-slack-dispatcher',
    name: 'Slack Notification Dispatcher',
    category: 'communication',
    categoryLabel: 'Communication',
    description: 'Posts structured summary blocks, alerts, and proposal buttons to connected Slack channels.',
    accessScope: 'external_state_change',
    riskLevel: 'consequential',
    requiredIntegrationId: 'int-slack',
    requiredIntegrationName: 'Slack',
    requiresHumanApproval: true,
    capabilities: ['Block Kit payload assembly', 'Channel routing', 'Human approval release'],
  },
  {
    id: 'tool-email-dispatcher',
    name: 'Email Digest Dispatcher',
    category: 'communication',
    categoryLabel: 'Communication',
    description: 'Dispatches finalized markdown briefs and audit reports to verified subscriber mailing lists.',
    accessScope: 'external_state_change',
    riskLevel: 'consequential',
    requiredIntegrationId: 'int-email',
    requiredIntegrationName: 'Email Provider',
    requiresHumanApproval: true,
    capabilities: ['HTML email rendering', 'Subscriber whitelist check', 'Delivery receipt log'],
  },
];
