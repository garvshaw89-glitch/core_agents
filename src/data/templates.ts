import { AgentCategory } from '../types/app';

export type SetupComplexity = 'Minimal' | 'Standard' | 'Advanced';
export type CapabilityReadiness = 'available' | 'requires_configuration' | 'requires_integration' | 'planned';

export interface TemplateCapability {
  name: string;
  description: string;
  readiness: CapabilityReadiness;
  requiredIntegrationId?: string;
}

export interface TemplateSampleIO {
  sampleInput: string;
  sampleInputDescription: string;
  sampleOutput: string;
  sampleOutputDescription: string;
}

export interface TemplatePermissions {
  readOnly: boolean;
  networkAccess: string;
  actionGating: string;
  fileAccess?: string;
}

export interface MarketplaceTemplate {
  id: string;
  name: string;
  category: AgentCategory;
  categoryLabel: string;
  summary: string;
  detailedDescription: string;
  purpose: string;
  iconName: string;
  tags: string[];
  capabilities: TemplateCapability[];
  sampleIO: TemplateSampleIO;
  relevantUseCases: string[];
  requiredInputs: string[];
  expectedOutputs: string[];
  requiredTools: string[];
  optionalTools: string[];
  defaultTools: string[]; // for backward compatibility with Step 02
  requiredIntegrations: string[];
  optionalIntegrations: string[];
  knowledgeRequirements: string;
  setupComplexity: SetupComplexity;
  defaultInstructions: string;
  suggestedOperatingMode: 'manual' | 'approval_required' | 'automated';
  suggestedSchedule: string;
  permissions: TemplatePermissions;
  limitations: string[];
  featured?: boolean;
  featuredReason?: string;
  curatedRank: number;
  version: string;
  createdAt: string;
  isCustom?: boolean;
}

// Backward-compatible alias
export type TemplateDefinition = MarketplaceTemplate;

export const STARTER_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'codebase-analyst',
    name: 'Codebase Analyst',
    category: 'development',
    categoryLabel: 'Development',
    summary: 'Understand an unfamiliar repository, map its architecture, and identify key files and technical risks.',
    detailedDescription:
      'The Codebase Analyst performs read-only AST parsing, dependency mapping, and pull-request triage across target repositories. It synthesizes architectural overviews and highlights modified test coverage without modifying code directly.',
    purpose:
      'Helps software engineers and tech leads onboard rapidly to complex codebases, triage regressions in opened pull requests, and audit module coupling before refactoring.',
    iconName: 'Code2',
    tags: ['Repository analysis', 'Architecture', 'Code review', 'AST parsing'],
    curatedRank: 1,
    featured: true,
    featuredReason: 'Essential starting specialist for engineering teams navigating unfamiliar or evolving repositories.',
    version: '1.2.0',
    createdAt: '2026-09-15T00:00:00Z',
    setupComplexity: 'Standard',
    suggestedOperatingMode: 'approval_required',
    suggestedSchedule: 'On incoming GitHub webhook (pull_request.opened)',
    requiredTools: ['Git Read-Only Client', 'AST Code Parser', 'Test Suite Runner'],
    optionalTools: ['Markdown Synthesizer'],
    defaultTools: ['Git Read-Only Client', 'AST Code Parser', 'Test Suite Runner'],
    requiredIntegrations: ['GitHub App (read-only repository access)'],
    optionalIntegrations: ['Slack (for review digest dispatch)'],
    knowledgeRequirements: 'Optional: project contributing guide or architecture RFCs.',
    permissions: {
      readOnly: true,
      networkAccess: 'Restricted to configured GitHub API endpoints',
      actionGating: 'Draft review comments staged for human approval; merge privileges strictly prohibited',
      fileAccess: 'Sandboxed clone of target branch; no write access to main branch',
    },
    capabilities: [
      {
        name: 'AST & Dependency Graph Mapping',
        description: 'Parses import graphs to identify high-fanout modules and circular dependencies.',
        readiness: 'available',
      },
      {
        name: 'Pull Request Diff Inspection',
        description: 'Examines changed files, detects omitted unit tests, and flags breaking API signatures.',
        readiness: 'available',
      },
      {
        name: 'Draft Patch Staging',
        description: 'Proposes non-destructive patch suggestions in an isolated test branch.',
        readiness: 'requires_configuration',
      },
      {
        name: 'Automated CI Status Polling',
        description: 'Tracks build matrices across GitHub Actions runners before staging review summary.',
        readiness: 'requires_integration',
        requiredIntegrationId: 'int-github',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied repository URL and pull request context:',
      sampleInput: `{\n  "repo": "acme/distributed-queue",\n  "pr_number": 142,\n  "changed_files": ["src/worker.ts", "src/mutex.ts"],\n  "query": "Does worker timeout safely release the mutex lock?"\n}`,
      sampleOutputDescription: 'Structured analysis report produced by the agent:',
      sampleOutput: `### Architecture & Concurrency Inspection\n\n1. **Root Cause Analysis**: \`worker.ts:88\` acquires \`distributedMutex\` without a \`finally\` guard.\n2. **Regression Risk**: If an unhandled promise rejection occurs during job dispatch, the lock is held indefinitely.\n3. **Recommended Patch**: Wrap task execution in \`try...finally\` and explicitly call \`mutex.release(key)\`.\n\n*Read-only inspection verified against AST syntax tree.*`,
    },
    relevantUseCases: [
      'Rapid code onboarding for new developers',
      'Automated pull request test-coverage audits',
      'Dependency deprecation checks during framework upgrades',
    ],
    requiredInputs: ['GitHub repository name or URL', 'Target branch or PR number', 'Severity triage threshold'],
    expectedOutputs: ['Markdown architectural brief', 'Test coverage delta summary', 'Staged review proposal'],
    defaultInstructions: `You are a Senior Systems Architect and Codebase Analyst.
Analyze code structures, inspect abstract syntax trees (ASTs), and diagnose regressions.
Always cite exact file paths and line numbers.
Operate strictly in read-only mode; propose code modifications as review proposals only.`,
    limitations: [
      'Does not merge pull requests or push commits to protected branches.',
      'Requires connected GitHub integration for private enterprise repositories.',
      'Cannot execute arbitrary terminal binaries outside sandboxed AST parser.',
    ],
  },
  {
    id: 'research-intelligence',
    name: 'Research Intelligence Agent',
    category: 'research',
    categoryLabel: 'Research',
    summary: 'Structure research questions, gather information from approved sources, and produce cited summaries.',
    detailedDescription:
      'The Research Intelligence Agent automates structured literature and market research. It queries approved public feeds, extracts quantitative metrics, flags contradictory statements, and structures briefings with verifiable citations.',
    purpose:
      'Designed for analysts and product strategists who need ongoing synthesis of public developments without manual copy-pasting or hallucinated claims.',
    iconName: 'Compass',
    tags: ['Competitive analysis', 'Literature search', 'Market research', 'Citations'],
    curatedRank: 2,
    featured: true,
    featuredReason: 'Comprehensive research synthesis with strict citation verification and zero hallucination gates.',
    version: '1.1.0',
    createdAt: '2026-09-18T00:00:00Z',
    setupComplexity: 'Minimal',
    suggestedOperatingMode: 'approval_required',
    suggestedSchedule: 'Weekly Mondays @ 08:00 UTC',
    requiredTools: ['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer'],
    optionalTools: ['Diff Analyzer'],
    defaultTools: ['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer'],
    requiredIntegrations: ['Public Web Fetcher'],
    optionalIntegrations: ['Slack (for brief delivery)', 'Email Provider'],
    knowledgeRequirements: 'Target competitor manifest or list of public changelog/disclosure URLs.',
    permissions: {
      readOnly: true,
      networkAccess: 'HTTP GET to whitelisted public domains only',
      actionGating: 'Human approval mandatory before sending summary email or Slack digest',
    },
    capabilities: [
      {
        name: 'Multi-Source Document Retrieval',
        description: 'Ingests public release notes, product blogs, and regulatory filings.',
        readiness: 'available',
      },
      {
        name: 'Citation Verification Engine',
        description: 'Cross-checks every synthesized bullet against source paragraph hashes.',
        readiness: 'available',
      },
      {
        name: 'Chronological Delta Matrix',
        description: 'Clusters changes across competitors over time into feature categories.',
        readiness: 'available',
      },
      {
        name: 'Private Document Grounding',
        description: 'Correlates public web findings against uploaded internal project notes.',
        readiness: 'requires_configuration',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied research parameters:',
      sampleInput: `{\n  "topic": "Enterprise SSO & SCIM Provisioning",\n  "targets": ["competitor-a.com/changelog", "competitor-b.io/releases"],\n  "timeframe": "Last 30 days"\n}`,
      sampleOutputDescription: 'Cited executive research summary:',
      sampleOutput: `### Executive Competitive Intelligence Summary\n\n- **Competitor A (Oct 08)**: Released SCIM 2.0 user de-provisioning API [Source: changelog#v4.2].\n- **Competitor B (Sep 29)**: Introduced custom Okta OIDC claims for multi-tenant organizations [Source: releases#2026-09].\n\n*All statements verified against public release documentation; zero synthetic assertions.*`,
    },
    relevantUseCases: [
      'Weekly competitor product movement tracking',
      'Regulatory compliance policy monitoring',
      'Technology stack benchmarking and feature delta analysis',
    ],
    requiredInputs: ['Research inquiry or competitor URLs', 'Recurrence frequency', 'Key capability tags'],
    expectedOutputs: ['Cited executive briefing', 'Chronological delta matrix', 'Uncertainty & follow-up list'],
    defaultInstructions: `You are an Objective Research Analyst.
Structure findings logically, compare data across sources, and cite primary URLs for every substantive claim.
Explicitly distinguish factual evidence from inferences. Never fabricate citations or numbers.`,
    limitations: [
      'Does not bypass paywalls or scrape non-public websites.',
      'Cannot verify claims behind authenticated login screens without approved credentials.',
    ],
  },
  {
    id: 'business-operations-assistant',
    name: 'Business Operations Assistant',
    category: 'business',
    categoryLabel: 'Business',
    summary: 'Organize recurring operational work, document standard procedures, and draft periodic business updates.',
    detailedDescription:
      'The Business Operations Assistant connects to approved metric queries and spreadsheets to synthesize operational hygiene reports, draft SOP documents, and verify recurring procedural checklists.',
    purpose:
      'Helps operations directors eliminate manual spreadsheet aggregation and maintain transparent SOP documentation across distributed teams.',
    iconName: 'Server',
    tags: ['Operations', 'SOP documentation', 'KPI reporting', 'Checklists'],
    curatedRank: 3,
    featured: true,
    featuredReason: 'Streamlines operational hygiene and KPI collation with strict least-privilege query boundaries.',
    version: '1.0.4',
    createdAt: '2026-09-22T00:00:00Z',
    setupComplexity: 'Standard',
    suggestedOperatingMode: 'approval_required',
    suggestedSchedule: 'Every Friday @ 17:00 UTC',
    requiredTools: ['Telemetry Query Tool', 'Report Generator', 'Threshold Watcher'],
    optionalTools: ['Audit Log Staging'],
    defaultTools: ['Telemetry Query Tool', 'Report Generator', 'Threshold Watcher'],
    requiredIntegrations: ['Generic Webhook or Query Adapter'],
    optionalIntegrations: ['Email Provider', 'Slack'],
    knowledgeRequirements: 'SOP template schemas or metric endpoint dictionary.',
    permissions: {
      readOnly: true,
      networkAccess: 'Read-only queries to authorized internal metric endpoints',
      actionGating: 'Report broadcast requires operational manager sign-off',
    },
    capabilities: [
      {
        name: 'Metric Collation & Tabular Synthesis',
        description: 'Pulls numbers from approved JSON/CSV endpoints and formats readable tables.',
        readiness: 'available',
      },
      {
        name: 'Threshold Anomaly Detection',
        description: 'Highlights KPI deltas exceeding ±15% compared to baseline period.',
        readiness: 'available',
      },
      {
        name: 'SOP Draft Generation',
        description: 'Converts unstructured meeting notes into standardized operational checklists.',
        readiness: 'available',
      },
      {
        name: 'Direct Warehouse SQL Execution',
        description: 'Executes parameterized queries against production data warehouse.',
        readiness: 'planned',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied operational metrics and target thresholds:',
      sampleInput: `{\n  "period": "Week 41",\n  "active_users": 18400,\n  "support_tickets_opened": 142,\n  "median_resolution_hours": 3.2,\n  "target_resolution_hours": 4.0\n}`,
      sampleOutputDescription: 'Structured operational briefing:',
      sampleOutput: `### Weekly Operations Briefing · Week 41\n\n| Metric | Actual | Target | Status |\n| :--- | :--- | :--- | :--- |\n| Active Users | 18,400 | 18,000 | Normal (+2.2%) |\n| Tickets Opened | 142 | <150 | Healthy |\n| Resolution Time | 3.2h | 4.0h | Exceeding Target |\n\n*All KPIs within approved operating parameters.*`,
    },
    relevantUseCases: [
      'Weekly cross-functional operational briefings',
      'Team standard operating procedure (SOP) documentation',
      'Customer support queue volume audits',
    ],
    requiredInputs: ['Authorized metric query endpoints', 'Reporting cadence', 'Stakeholder notification list'],
    expectedOutputs: ['Executive tabular summary', 'Anomaly alerts list', 'Action items checklist'],
    defaultInstructions: `You are a Senior Business Operations Lead.
Format reports cleanly with tabular metrics.
Never invent operational numbers. Flag any metric that is missing or unverified.
Require explicit review prior to external distribution.`,
    limitations: [
      'Cannot execute mutations or write queries against production databases.',
      'Email broadcasts will pause until authorized in the activity queue.',
    ],
  },
  {
    id: 'study-coach',
    name: 'Study Coach',
    category: 'education',
    categoryLabel: 'Education',
    summary: 'Help learners understand complex concepts, create revision plans, and generate practice questions.',
    detailedDescription:
      'The Study Coach builds personalized, spaced-repetition curricula and concept check questions grounded in textbooks and course syllabi. It guides learners through step-by-step reasoning.',
    purpose:
      'Assists self-directed learners and technical students in mastering difficult academic or technical subjects through guided practice without shortcut answers.',
    iconName: 'BookOpen',
    tags: ['Education', 'Curriculum', 'Tutoring', 'Spaced repetition'],
    curatedRank: 4,
    version: '1.1.2',
    createdAt: '2026-09-25T00:00:00Z',
    setupComplexity: 'Minimal',
    suggestedOperatingMode: 'manual',
    suggestedSchedule: 'On-demand study sessions',
    requiredTools: ['Concept Map Engine', 'Exercise Generator', 'Progress Tracker'],
    optionalTools: ['Reference Indexer'],
    defaultTools: ['Concept Map Engine', 'Exercise Generator', 'Progress Tracker'],
    requiredIntegrations: [],
    optionalIntegrations: ['Google Calendar (for study session block scheduling)'],
    knowledgeRequirements: 'Course syllabus, textbook chapters, or reference lecture notes.',
    permissions: {
      readOnly: true,
      networkAccess: 'Restricted; operates solely on uploaded notes and verified curriculum sources',
      actionGating: 'Student approval required before scheduling new review modules',
    },
    capabilities: [
      {
        name: 'Syllabus Decomposition',
        description: 'Breaks down a broad subject into progressive weekly mastery milestones.',
        readiness: 'available',
      },
      {
        name: 'Concept Check Drill Generator',
        description: 'Creates multiple-choice and open-ended questions targeting weak areas.',
        readiness: 'available',
      },
      {
        name: 'Socratic Hint Scaffolding',
        description: 'Provides conceptual hints rather than immediately giving the final answer.',
        readiness: 'available',
      },
      {
        name: 'Spaced Repetition Schedule Sync',
        description: 'Pushes review appointments to user calendar based on Ebbinghaus forgetting curve.',
        readiness: 'requires_integration',
        requiredIntegrationId: 'int-gcal',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Student subject goal and available study time:',
      sampleInput: `{\n  "subject": "Distributed Consensus (Raft)",\n  "level": "Intermediate",\n  "time_budget": "3 hours / week for 2 weeks"\n}`,
      sampleOutputDescription: 'Structured learning roadmap and initial drill:',
      sampleOutput: `### Raft Consensus Mastery Syllabus\n\n**Week 1: Leader Election & Log Replication**\n- Topic 1: Split votes, randomized election timeouts.\n- Topic 2: AppendEntries RPC protocol invariants.\n\n*Concept Question 1:* Why does Raft require a majority quorum (N/2 + 1) for both leader election and log commitment?`,
    },
    relevantUseCases: [
      'Self-directed engineering upskilling',
      'Technical interview preparation',
      'Certification exam revision planning',
    ],
    requiredInputs: ['Subject or topic name', 'Target mastery timeline', 'Preferred exercise format'],
    expectedOutputs: ['Progressive mastery roadmap', 'Targeted practice drills', 'Retention review checklist'],
    defaultInstructions: `You are an empathetic, academically rigorous Study Coach.
Encourage foundational reasoning and step-by-step problem-solving.
Never provide final answers immediately; scaffold understanding with guided questions.`,
    limitations: [
      'Does not guarantee academic or examination results.',
      'Relies on student engagement and accurate reference materials.',
    ],
  },
  {
    id: 'content-strategy-planner',
    name: 'Content Strategy Planner',
    category: 'marketing',
    categoryLabel: 'Marketing',
    summary: 'Turn a topic, product objective, or launch milestone into a structured multi-channel content plan.',
    detailedDescription:
      'The Content Strategy Planner organizes publishing calendars, categorizes audience personas, outlines educational blog series, and crafts consistent distribution briefs based on brand voice guidelines.',
    purpose:
      'Enables marketing leads and technical writers to maintain a steady cadence of high-signal editorial content without ad-hoc scramble.',
    iconName: 'Sparkles',
    tags: ['Content strategy', 'Editorial calendar', 'Marketing', 'Audience research'],
    curatedRank: 5,
    version: '1.0.1',
    createdAt: '2026-09-28T00:00:00Z',
    setupComplexity: 'Standard',
    suggestedOperatingMode: 'manual',
    suggestedSchedule: 'Bi-weekly editorial planning',
    requiredTools: ['Markdown Synthesizer', 'Citation Verifier'],
    optionalTools: ['Public Web Fetcher'],
    defaultTools: ['Markdown Synthesizer', 'Citation Verifier'],
    requiredIntegrations: [],
    optionalIntegrations: ['Slack (for editorial review approvals)'],
    knowledgeRequirements: 'Brand voice guide, product positioning brief, or target persona profiles.',
    permissions: {
      readOnly: true,
      networkAccess: 'Restricted to public research fetching',
      actionGating: 'Cannot auto-publish; all briefs staged for editor review',
    },
    capabilities: [
      {
        name: 'Editorial Calendar Generation',
        description: 'Organizes 4-week publishing schedules balanced across technical depth and news.',
        readiness: 'available',
      },
      {
        name: 'Multi-Channel Repurposing Briefs',
        description: 'Extracts core takeaways from long-form engineering blogs into social briefs.',
        readiness: 'available',
      },
      {
        name: 'SEO Semantic Outline Formulation',
        description: 'Structures headings and FAQs matching genuine search queries.',
        readiness: 'available',
      },
      {
        name: 'Automated CMS Publishing',
        description: 'Pushes draft markdown directly into headless CMS or Ghost blog.',
        readiness: 'planned',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied product milestone and audience:',
      sampleInput: `{\n  "milestone": "Launch of CORE Agents Marketplace",\n  "audience": "Senior Frontend Engineers & Product Leads",\n  "cadence": "2 technical posts / week"\n}`,
      sampleOutputDescription: 'Structured editorial plan:',
      sampleOutput: `### 2-Week Launch Content Blueprint\n\n1. **Post 1 (Deep Dive)**: *Architecture of Bounded AI Agents: Why Zero-Trust Tooling Matters*\n2. **Post 2 (Tutorial)**: *Step-by-Step: Writing Safe Consequential Approval Gates in TypeScript*\n3. **Post 3 (Case Study)**: *How Engineering Teams Reduce PR Triage Latency by 40%*`,
    },
    relevantUseCases: [
      'Technical product launch campaigns',
      'Engineering blog editorial calendar management',
      'Content repurposing across developer newsletters',
    ],
    requiredInputs: ['Product milestone or topic', 'Target persona guidelines', 'Publishing cadence'],
    expectedOutputs: ['Multi-week content calendar', 'Detailed post briefs', 'Distribution checklist'],
    defaultInstructions: `You are a Principal Technical Content Strategist.
Prioritize clarity, authentic developer value, and actionable technical takeaways over promotional hype.
Never claim content has been published externally.`,
    limitations: [
      'Does not directly publish to external social platforms or blogs without manual operator copying.',
    ],
  },
  {
    id: 'website-health-monitor',
    name: 'Website Health Monitor',
    category: 'operations',
    categoryLabel: 'Operations',
    summary: 'Inspect website health, review synthetic probe results, summarize issues, and recommend steps.',
    detailedDescription:
      'The Website Health Monitor reviews periodic synthetic probe outputs, audits SSL certificate validity, analyzes HTTP status code trends, and compiles prioritized incident investigation checklists.',
    purpose:
      'Provides DevOps and site reliability engineers with a calm, automated synthesizer of infrastructure health logs without alarm fatigue.',
    iconName: 'Activity',
    tags: ['Monitoring', 'SRE', 'Uptime', 'SSL audit', 'Incident response'],
    curatedRank: 6,
    version: '1.2.1',
    createdAt: '2026-09-30T00:00:00Z',
    setupComplexity: 'Standard',
    suggestedOperatingMode: 'automated',
    suggestedSchedule: 'Hourly @ :00',
    requiredTools: ['HTTP Health Prober', 'SSL Certificate Inspector', 'Incident Alert Staging'],
    optionalTools: ['Telemetry Query Tool'],
    defaultTools: ['HTTP Health Prober', 'SSL Certificate Inspector', 'Incident Alert Staging'],
    requiredIntegrations: ['Generic Inbound Webhook'],
    optionalIntegrations: ['Slack (for alerting on status degradation)'],
    knowledgeRequirements: 'Endpoint URL manifest and expected response codes.',
    permissions: {
      readOnly: true,
      networkAccess: 'HTTP GET/HEAD requests to whitelisted health check URLs',
      actionGating: 'Alert broadcast dispatched when consecutive probe failures exceed threshold',
    },
    capabilities: [
      {
        name: 'Synthetic HTTP Latency Waterfall',
        description: 'Records TTFB and response duration across configured endpoints.',
        readiness: 'available',
      },
      {
        name: 'SSL Expiration Verification',
        description: 'Audits certificate validity and alerts 30 days prior to expiry.',
        readiness: 'available',
      },
      {
        name: 'Failure Root-Cause Triage',
        description: 'Correlates HTTP 5xx errors against server response headers.',
        readiness: 'available',
      },
      {
        name: 'Multi-Region Global Probing',
        description: 'Executes distributed health checks across 12 geographic zones.',
        readiness: 'requires_integration',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied probe log excerpt:',
      sampleInput: `{\n  "endpoint": "https://api.coreagents.internal/v1/health",\n  "status": 502,\n  "ttfb_ms": 1420,\n  "ssl_valid_days": 82\n}`,
      sampleOutputDescription: 'Health diagnosis brief:',
      sampleOutput: `### Synthetic Probe Incident Brief\n\n- **Incident**: HTTP 502 Bad Gateway detected on \`/v1/health\`.\n- **Diagnosis**: Latency exceeded 1400ms before upstream proxy timeout.\n- **Recommended Action**: Check ingress controller pod health and queue backlog.`,
    },
    relevantUseCases: [
      'Critical API availability verification',
      'Pre-launch DNS and SSL configuration validation',
      'Automated site reliability daily digest',
    ],
    requiredInputs: ['Public endpoint URLs', 'Check frequency', 'Expected HTTP response assertions'],
    expectedOutputs: ['Latency trend summary', 'SSL expiry countdown', 'Prioritized remediation checklist'],
    defaultInstructions: `You are a Site Reliability Engineer.
Diagnose infrastructure anomalies with precision.
Distinguish transient network blips from systemic outages. Avoid alarm fatigue with clear actionable remediation steps.`,
    limitations: [
      'Requires connected probe runner or webhook to receive external synthetic ping telemetry.',
      'Cannot execute server restart commands on live production infrastructure.',
    ],
  },
  {
    id: 'competitor-researcher',
    name: 'Competitor Researcher',
    category: 'research',
    categoryLabel: 'Research',
    summary: 'Compare competitors using supplied documents or accessible research sources to extract feature gaps.',
    detailedDescription:
      'The Competitor Researcher processes product changelogs, pricing pages, and release announcements across competitor domains to produce side-by-side capability matrices and highlight differentiation gaps.',
    purpose:
      'Assists product managers in maintaining an objective feature delta matrix between their product and key industry competitors.',
    iconName: 'Compass',
    tags: ['Competitive analysis', 'Feature matrix', 'Pricing comparison', 'Product strategy'],
    curatedRank: 7,
    version: '1.0.3',
    createdAt: '2026-10-02T00:00:00Z',
    setupComplexity: 'Standard',
    suggestedOperatingMode: 'approval_required',
    suggestedSchedule: 'Bi-weekly Tuesdays @ 09:00 UTC',
    requiredTools: ['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer'],
    optionalTools: ['Diff Analyzer'],
    defaultTools: ['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer'],
    requiredIntegrations: ['Public Web Fetcher'],
    optionalIntegrations: ['Slack'],
    knowledgeRequirements: 'Competitor domain URLs and current internal product capability list.',
    permissions: {
      readOnly: true,
      networkAccess: 'HTTP GET to public competitor marketing and changelog pages',
      actionGating: 'Comparison distribution requires human sign-off',
    },
    capabilities: [
      {
        name: 'Feature Parity Matrix Generation',
        description: 'Constructs side-by-side comparison tables across core product dimensions.',
        readiness: 'available',
      },
      {
        name: 'Pricing Tier Delta Mapping',
        description: 'Tracks shifts in per-seat vs usage pricing models.',
        readiness: 'available',
      },
      {
        name: 'Differentiation Gap Analysis',
        description: 'Highlights features offered by competitors not currently present in roadmap.',
        readiness: 'available',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied competitor URLs and target capabilities:',
      sampleInput: `{\n  "competitors": ["AlphaApp", "BetaPlatform"],\n  "capabilities": ["Audit logs", "SSO", "Role-based access control"]\n}`,
      sampleOutputDescription: 'Side-by-side comparison matrix:',
      sampleOutput: `### Competitive Feature Parity Matrix\n\n| Capability | AlphaApp | BetaPlatform | CORE Agents |\n| :--- | :--- | :--- | :--- |\n| Audit Logs | 30 Days (Pro) | 1 Year (Ent) | Tamper-Evident SHA256 |\n| SSO | Okta/SAML | Google Only | Okta, SAML, SCIM |\n| Approval Gates | None | None | Consequential Barrier |`,
    },
    relevantUseCases: [
      'Quarterly product strategy roadmap sessions',
      'Sales enablement competitive battlecards',
      'Pricing model restructuring analysis',
    ],
    requiredInputs: ['Competitor list or websites', 'Comparison dimensions', 'Internal product baseline'],
    expectedOutputs: ['Comparison matrix table', 'Positioning analysis', 'Differentiator summary'],
    defaultInstructions: `You are a Competitive Intelligence Product Manager.
Maintain objectivity. Base comparisons strictly on verifiable published documentation.
Clearly highlight areas where competitors lead as well as unique differentiators.`,
    limitations: [
      'Cannot access internal or NDA-protected competitor materials.',
      'Pricing estimates are based strictly on public tier disclosures.',
    ],
  },
  {
    id: 'meeting-intelligence-assistant',
    name: 'Meeting Intelligence Assistant',
    category: 'productivity',
    categoryLabel: 'Productivity',
    summary: 'Convert meeting notes or transcripts into concise summaries, decision registers, and action items.',
    detailedDescription:
      'The Meeting Intelligence Assistant parses raw conversation transcripts or scratch meeting notes, identifies agreed decisions, assigns task owners, and prepares structured follow-up summaries.',
    purpose:
      'Eliminates meeting ambiguity by delivering instant, structured decision records and accountable action item checklists following calls.',
    iconName: 'FileText',
    tags: ['Meeting notes', 'Action items', 'Transcripts', 'Productivity'],
    curatedRank: 8,
    version: '1.1.0',
    createdAt: '2026-10-04T00:00:00Z',
    setupComplexity: 'Minimal',
    suggestedOperatingMode: 'manual',
    suggestedSchedule: 'On-demand after calls',
    requiredTools: ['Markdown Synthesizer', 'Progress Tracker'],
    optionalTools: ['Citation Verifier'],
    defaultTools: ['Markdown Synthesizer', 'Progress Tracker'],
    requiredIntegrations: [],
    optionalIntegrations: ['Slack (for posting summary to channel)'],
    knowledgeRequirements: 'Meeting agenda or project glossary.',
    permissions: {
      readOnly: true,
      networkAccess: 'None required; processes pasted notes locally',
      actionGating: 'Operator review before sending to attendees',
    },
    capabilities: [
      {
        name: 'Decision Register Extraction',
        description: 'Separates confirmed architectural decisions from exploratory brainstorming.',
        readiness: 'available',
      },
      {
        name: 'Action Item Owner Assignment',
        description: 'Identifies task owners and deadlines mentioned in notes.',
        readiness: 'available',
      },
      {
        name: 'Executive Summary Generation',
        description: 'Distills 60-minute calls into 3 bullet points for leadership.',
        readiness: 'available',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied rough meeting notes:',
      sampleInput: `Rough notes: Team agreed on Postgres for auth. Alex will write schema by Thursday. Maya raised concern on query latency under 10k users. We decided to defer caching until load testing in Sprint 4.`,
      sampleOutputDescription: 'Structured meeting record:',
      sampleOutput: `### Architecture Sync · Decisions & Action Items\n\n**Decisions:**\n- Adopted PostgreSQL for primary auth database.\n- Deferred Redis caching layer until Sprint 4 load test.\n\n**Action Items:**\n- [ ] Alex: Draft initial auth DDL schema (Due: Thursday)\n- [ ] Maya: Define 10k concurrent user query benchmark`,
    },
    relevantUseCases: [
      'Engineering sync documentation',
      'Client discovery call synthesis',
      'Sprint retrospective action item tracking',
    ],
    requiredInputs: ['Pasted meeting notes or transcript', 'Optional attendee list', 'Output format preference'],
    expectedOutputs: ['Executive summary', 'Decisions register', 'Action items with owners'],
    defaultInstructions: `You are an Executive Chief of Staff and Technical Scribe.
Extract concrete decisions and assignable action items from unstructured notes.
Avoid narrative filler; focus on clarity, ownership, and deadlines.`,
    limitations: [
      'Does not dial into live calls or record audio.',
      'Relies on user-provided notes or transcription text.',
    ],
  },
  {
    id: 'data-analysis-planner',
    name: 'Data Analysis Planner',
    category: 'business',
    categoryLabel: 'Business',
    summary: 'Help users understand datasets, plan analyses, define metrics, and recommend visual charts.',
    detailedDescription:
      'The Data Analysis Planner inspects sample CSV/JSON datasets or SQL schemas, defines unambiguous KPI formulas, detects potential data hygiene issues, and structures reproducible analysis plans.',
    purpose:
      'Guides analysts and engineers in scoping clean data investigations and avoiding misleading metric aggregations.',
    iconName: 'Server',
    tags: ['Data analysis', 'SQL planning', 'Metrics', 'Statistics'],
    curatedRank: 9,
    version: '1.0.0',
    createdAt: '2026-10-06T00:00:00Z',
    setupComplexity: 'Standard',
    suggestedOperatingMode: 'manual',
    suggestedSchedule: 'On-demand analysis scoping',
    requiredTools: ['Telemetry Query Tool', 'Report Generator'],
    optionalTools: ['Citation Verifier'],
    defaultTools: ['Telemetry Query Tool', 'Report Generator'],
    requiredIntegrations: [],
    optionalIntegrations: ['Generic Webhook'],
    knowledgeRequirements: 'Database schema, data dictionary, or sample table headers.',
    permissions: {
      readOnly: true,
      networkAccess: 'Restricted to supplied data payloads',
      actionGating: 'Read-only analysis; no database writes permitted',
    },
    capabilities: [
      {
        name: 'Schema Profiling & Type Validation',
        description: 'Examines column data types, nullability, and primary key relationships.',
        readiness: 'available',
      },
      {
        name: 'Metric Formula Standardizer',
        description: 'Specifies unambiguous mathematical definitions for business KPIs.',
        readiness: 'available',
      },
      {
        name: 'Chart Recommendation Engine',
        description: 'Suggests appropriate visualizations based on data distribution and cardinality.',
        readiness: 'available',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Supplied schema definition and business question:',
      sampleInput: `{\n  "table": "subscriptions",\n  "columns": ["id", "user_id", "tier", "mrr", "created_at", "canceled_at"],\n  "question": "How do we calculate net revenue retention (NRR)?"\n}`,
      sampleOutputDescription: 'Structured analysis plan:',
      sampleOutput: `### Net Revenue Retention (NRR) Calculation Plan\n\n1. **Cohort Definition**: Customers active at start of 12-month trailing period ($M_{t-12}$).\n2. **Formula**: $\\frac{M_{current} + Expansion - Contraction - Churn}{M_{t-12}} \\times 100$.\n3. **Query Strategy**: Group by cohort month using \`created_at\` and track net MRR deltas.`,
    },
    relevantUseCases: [
      'Customer churn analysis scoping',
      'Financial model metric standardization',
      'Product telemetry experiment plan design',
    ],
    requiredInputs: ['Schema or sample dataset', 'Core business question', 'Desired granularity'],
    expectedOutputs: ['Statistical analysis plan', 'Exact metric definitions', 'Recommended chart specs'],
    defaultInstructions: `You are a Principal Data Scientist and Analytics Architect.
Provide mathematically rigorous analysis plans.
Never hallucinate numbers from datasets that were not supplied. Always emphasize statistical significance.`,
    limitations: [
      'Cannot execute arbitrary Python/R code without a connected sandboxed runtime.',
      'Requires user to provide schema or sample data rows.',
    ],
  },
  {
    id: 'blank-agent',
    name: 'Custom Blank Agent',
    category: 'custom',
    categoryLabel: 'Custom',
    summary: 'A clean starting point to construct a bespoke specialist agent with custom tools and review boundaries.',
    detailedDescription:
      'The Custom Blank Agent provides an unopinionated foundation for users who need custom directives, proprietary tool whitelists, and unique review gates.',
    purpose:
      'Allows architects to build custom AI workflows tailored to internal company requirements without pre-configured assumptions.',
    iconName: 'Sparkles',
    tags: ['Custom', 'Blank slate', 'Bespoke', 'Full control'],
    curatedRank: 10,
    isCustom: true,
    version: '1.0.0',
    createdAt: '2026-10-10T00:00:00Z',
    setupComplexity: 'Minimal',
    suggestedOperatingMode: 'manual',
    suggestedSchedule: 'Configurable',
    requiredTools: ['Markdown Synthesizer'],
    optionalTools: ['Public Web Fetcher', 'Git Read-Only Client', 'AST Code Parser', 'Telemetry Query Tool'],
    defaultTools: ['Markdown Synthesizer'],
    requiredIntegrations: [],
    optionalIntegrations: ['GitHub', 'Slack', 'Email Provider'],
    knowledgeRequirements: 'Optional user-provided documentation or notes.',
    permissions: {
      readOnly: true,
      networkAccess: 'Configurable by user',
      actionGating: 'Human approval barrier recommended for consequential actions',
    },
    capabilities: [
      {
        name: 'Custom Prompt Directives',
        description: 'Define specific role instructions, constraints, and output formats.',
        readiness: 'available',
      },
      {
        name: 'Selective Tool Whitelisting',
        description: 'Grant access strictly to tools required for your specific workflow.',
        readiness: 'available',
      },
      {
        name: 'Custom Review Gate Assignment',
        description: 'Specify whether consequential tasks require manual operator approval.',
        readiness: 'available',
      },
    ],
    sampleIO: {
      sampleInputDescription: 'Sample user prompt:',
      sampleInput: `Summarize yesterday's customer feedback log into 3 prioritized feature themes.`,
      sampleOutputDescription: 'Custom structured output:',
      sampleOutput: `### Prioritized Customer Feedback Themes\n\n1. **Theme A**: SSO SCIM integration request (8 accounts)\n2. **Theme B**: Improved documentation search (5 accounts)\n3. **Theme C**: Dark mode contrast adjustment (3 accounts)`,
    },
    relevantUseCases: [
      'Bespoke internal business workflows',
      'Experimental agent prototyping',
      'Domain-specific knowledge synthesis',
    ],
    requiredInputs: ['Agent name', 'Role & instructions', 'Tool selection'],
    expectedOutputs: ['Configured agent draft in My Agents'],
    defaultInstructions: `You are a specialized AI agent configured to execute repeatable tasks.
Follow the user's specific instructions, respect bounded tool limits, and pause for approval on sensitive operations.`,
    limitations: [
      'Starts with minimal tools; user must explicitly whitelist capabilities.',
    ],
  },
];
