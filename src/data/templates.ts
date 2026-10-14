import { AgentCategory } from '../types/app';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: AgentCategory;
  summary: string;
  purpose: string;
  requiredInputs: string[];
  requiredIntegrations: string[];
  expectedOutputs: string[];
  permissions: string[];
  defaultTools: string[];
  suggestedSchedule: string;
  iconName: string;
  isCustom?: boolean;
}

export const STARTER_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'tpl-competitor-researcher',
    name: 'Competitor Researcher',
    category: 'research',
    summary: 'Monitors public product blogs, release announcements, and changelogs to compile structured intelligence digests.',
    purpose: 'Designed for product strategy teams who need recurring, verifiable competitive intelligence without manual web scouring.',
    requiredInputs: ['List of competitor changelog / documentation URLs', 'Cadence (e.g. Weekly Mondays 08:00 UTC)', 'Priority capability tags'],
    requiredIntegrations: ['Public Web Fetcher', 'Slack or Email (for draft review delivery)'],
    expectedOutputs: ['Cited Markdown executive briefing', 'Chronological delta matrix', 'High-impact feature announcements'],
    permissions: ['HTTP GET access to approved public domains', 'Draft message creation in workspace channel'],
    defaultTools: ['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer'],
    suggestedSchedule: 'Weekly Mondays @ 08:00 UTC',
    iconName: 'Compass',
  },
  {
    id: 'tpl-codebase-analyst',
    name: 'Codebase Analyst',
    category: 'coding',
    summary: 'Inspects incoming pull requests and repository issues to detect missing regression tests and AST architectural deltas.',
    purpose: 'Assists engineering leads by triaging code modifications, validating test coverage, and proposing non-destructive patches in sandboxed branches.',
    requiredInputs: ['Target GitHub repository & branch filter', 'Test suite command (e.g. npm test)', 'Severity triage guidelines'],
    requiredIntegrations: ['GitHub App (read-only code access)', 'CI webhook listener'],
    expectedOutputs: ['Structured PR review comment', 'Unit test coverage delta', 'Draft staging patch proposal'],
    permissions: ['Repository contents: read', 'Pull requests: read', 'Comments: write (staging only, merge prohibited)'],
    defaultTools: ['Git Read-Only Client', 'AST Code Parser', 'Test Suite Runner'],
    suggestedSchedule: 'Webhook trigger on pull_request.opened',
    iconName: 'Code2',
  },
  {
    id: 'tpl-study-coach',
    name: 'Study Coach',
    category: 'learning',
    summary: 'Builds personalized progressive study roadmaps, generates concept quizzes, and tracks retention intervals.',
    purpose: 'Helps students and engineers master complex technical domains through structured curriculum scaffolding grounded in textbooks.',
    requiredInputs: ['Target syllabus or topic name', 'Target mastery timeline (e.g. 4 weeks)', 'Preferred exercise formats'],
    requiredIntegrations: ['Reference Knowledge Base (notes, PDFs)', 'Google Calendar (optional scheduling)'],
    expectedOutputs: ['Progressive multi-week curriculum', 'Interactive recall exercises', 'Concept mastery scorecard'],
    permissions: ['Access to uploaded educational reference documents', 'No external network access required'],
    defaultTools: ['Concept Map Engine', 'Exercise Generator', 'Progress Tracker'],
    suggestedSchedule: 'Manual trigger or daily study reminder',
    iconName: 'BookOpen',
  },
  {
    id: 'tpl-business-reporter',
    name: 'Business Report Assistant',
    category: 'business',
    summary: 'Aggregates structured metrics across internal sheets and analytics queries into consistent executive briefings.',
    purpose: 'Automates weekly business hygiene reports for operations managers, ensuring KPI numbers match authoritative sources.',
    requiredInputs: ['Approved metric query endpoints', 'Reporting template schema', 'Reviewer stakeholder list'],
    requiredIntegrations: ['Internal Data Warehouse / Sheets API', 'Slack / Email notification service'],
    expectedOutputs: ['Clean tabular KPI summaries', 'Anomaly alerts for values deviating >15%', 'Executive narrative synthesis'],
    permissions: ['Read-only access to approved analytics queries', 'Human approval required prior to email dispatch'],
    defaultTools: ['Telemetry Query Tool', 'Report Generator', 'Threshold Watcher'],
    suggestedSchedule: 'Every Friday @ 17:00 UTC',
    iconName: 'Server',
  },
  {
    id: 'tpl-health-monitor',
    name: 'Website Health Monitor',
    category: 'monitoring',
    summary: 'Periodically tests critical user journeys, API health probes, and SSL certificate expiration dates.',
    purpose: 'Continuous synthetic health auditing that surfaces subtle latency regressions before they impact users.',
    requiredInputs: ['Public endpoint URLs', 'Check frequency (e.g. hourly)', 'Expected HTTP response assertions'],
    requiredIntegrations: ['Inbound Webhook receiver', 'Incident alert channel'],
    expectedOutputs: ['Hourly latency waterfall logs', 'SSL certificate expiry countdown', 'Failure snapshot with trace headers'],
    permissions: ['HTTP GET and HEAD network access', 'Rate-limited to 1 request/min per target'],
    defaultTools: ['HTTP Health Prober', 'SSL Certificate Inspector', 'Incident Alert Staging'],
    suggestedSchedule: 'Hourly @ :00',
    iconName: 'Activity',
  },
  {
    id: 'tpl-blank-agent',
    name: 'Blank Agent',
    category: 'custom',
    summary: 'Start from scratch with clean slate instructions, custom tool allowances, and bespoke trigger boundaries.',
    purpose: 'For architects designing novel multi-step agent pipelines with proprietary tools and unique approval conditions.',
    requiredInputs: ['Custom prompt instructions', 'Tool whitelists', 'Trigger configuration'],
    requiredIntegrations: ['Custom connectors as needed'],
    expectedOutputs: ['User-defined structured outputs'],
    permissions: ['Bounded by user-configured tool matrix'],
    defaultTools: ['Markdown Synthesizer'],
    suggestedSchedule: 'Configurable',
    iconName: 'Sparkles',
    isCustom: true,
  },
];
