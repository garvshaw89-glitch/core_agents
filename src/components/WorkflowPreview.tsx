import React, { useState } from 'react';
import { Calendar, Globe, FileSearch, FileCheck2, UserCheck2, Check, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';
import { WorkflowStep } from '../types';

export const WorkflowPreview: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(5); // default to step 5 (approval gate) to highlight core value prop
  const [approvedState, setApprovedState] = useState<boolean>(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      label: 'Scheduled Trigger',
      sublabel: 'Every Monday · 08:00 UTC',
      status: 'completed',
      detail: 'Deterministic cron trigger initiates execution without human intervention.',
      payloadTitle: 'Trigger Specification',
      payloadContent: `{\n  "cadence": "0 8 * * 1",\n  "timezone": "UTC",\n  "agent_id": "research-specialist-01",\n  "execution_mode": "sandboxed"\n}`,
    },
    {
      id: 2,
      label: 'Gather Public Sources',
      sublabel: 'Whitelisted URLs only',
      status: 'completed',
      detail: 'Fetches RSS feeds, public release announcements, and documentation changelogs.',
      payloadTitle: 'Retrieved Source Manifest (4 sources)',
      payloadContent: `1. https://competitor-a.com/changelog (HTTP 200 · 34KB)\n2. https://competitor-b.io/releases (HTTP 200 · 18KB)\n3. https://industry-digest.org/feed (HTTP 200 · 62KB)\n4. SEC EDGAR 10-Q Public Disclosures (HTTP 200 · 112KB)`,
    },
    {
      id: 3,
      label: 'Summarize Relevant Changes',
      sublabel: 'Diff clustering & categorization',
      status: 'completed',
      detail: 'Filters marketing fluff, isolates technical deltas, and cross-references feature updates.',
      payloadTitle: 'Delta Extraction Summary',
      payloadContent: `• Competitor A launched Enterprise SSO + SCIM provisioning.\n• Competitor B shifted pricing from per-seat to consumption tiers.\n• 3 redundant minor patch notes discarded per filtering rule.\n• Confidence score: High · Zero unverifiable statements found.`,
    },
    {
      id: 4,
      label: 'Generate Report',
      sublabel: 'Structured Markdown synthesis',
      status: 'completed',
      detail: 'Formats the findings into a clear executive brief with verifiable citations.',
      payloadTitle: 'Draft Document Preview (Excerpt)',
      payloadContent: `# Weekly Competitive Intelligence Brief · Oct 14\n\n## Key Movements\n1. Enterprise Access: Competitor A introduced SCIM 2.0.\n2. Pricing Shift: Competitor B added usage billing models.\n\n*All assertions cited from verifiable public release notes.*`,
    },
    {
      id: 5,
      label: 'Request Human Approval',
      sublabel: 'Consequential action barrier',
      status: 'gate',
      detail: 'Execution strictly halts. External dispatch to team channel or email list requires human sign-off.',
      payloadTitle: 'Approval Gate State',
      payloadContent: `CONSEQUENTIAL BARRIER ENFORCED:\nDestination: #product-strategy (Slack) & exec-team@company.internal\nStatus: Awaiting human operator authorization.`,
    },
  ];

  const currentStep = workflowSteps.find((s) => s.id === activeStepId) || workflowSteps[4];

  const stepIcons = {
    1: Calendar,
    2: Globe,
    3: FileSearch,
    4: FileCheck2,
    5: UserCheck2,
  };

  return (
    <section id="workflow" className="py-24 md:py-32" aria-labelledby="workflow-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#A78BFA]">
            End-To-End Architecture
          </div>
          <h2 id="workflow-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F2FA]">
            Workflow preview
          </h2>
          <p className="text-base sm:text-lg text-[#A5A2B4] leading-relaxed">
            Every Monday, prepare a competitor intelligence report. See how CORE orchestrates a multi-step workflow
            with an unbypassable human review gate before distribution.
          </p>
        </div>

        {/* Workflow Pipeline Frame */}
        <div className="bg-[#101016] border border-[#292936] rounded-2xl p-6 sm:p-8">
          {/* Top metadata strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#292936] gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#65D6A3]" aria-hidden="true" />
              <div>
                <div className="text-sm font-semibold text-[#F4F2FA]">Competitor Intelligence Pipeline</div>
                <div className="text-xs text-[#777487]">Recurrence: Weekly Mondays @ 08:00 UTC</div>
              </div>
            </div>

            {/* Illustrative Notice Pill / Clarification */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171720] border border-[#292936] text-[11px] text-[#A5A2B4]">
              <AlertCircle size={13} className="text-[#A78BFA]" />
              <span>Illustrative product preview · Consequential actions require approval barrier</span>
            </div>
          </div>

          {/* Pipeline Stepper Horizontal Bar */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
            {workflowSteps.map((step) => {
              const Icon = stepIcons[step.id as keyof typeof stepIcons];
              const isSelected = activeStepId === step.id;
              const isGate = step.status === 'gate';

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isGate
                        ? 'bg-[#171720] border-[#F2C879] ring-1 ring-[#F2C879]/30'
                        : 'bg-[#171720] border-[#A78BFA] ring-1 ring-[#A78BFA]/30'
                      : 'bg-[#09090D] border-[#292936] hover:border-[#3D3D4E]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#777487]">0{step.id}</span>
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isGate
                          ? 'bg-[#F2C879]/20 text-[#F2C879]'
                          : 'bg-[#A78BFA]/20 text-[#C4B5FD]'
                      }`}
                    >
                      <Icon size={13} />
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#F4F2FA] mb-1 line-clamp-1">{step.label}</div>
                  <div className="text-[11px] text-[#777487] line-clamp-1">{step.sublabel}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Inspector View */}
          <div className="bg-[#09090D] border border-[#292936] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#292936]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#A78BFA]">Step 0{currentStep.id}</span>
                  <span className="text-xs text-[#777487]">·</span>
                  <h3 className="text-sm font-semibold text-[#F4F2FA]">{currentStep.label}</h3>
                </div>
                <p className="text-xs text-[#A5A2B4] mt-1">{currentStep.detail}</p>
              </div>

              {currentStep.status === 'gate' && (
                <div className="flex items-center gap-2">
                  {approvedState ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#65D6A3]/15 text-[#65D6A3] rounded-lg text-xs font-medium">
                      <Check size={14} />
                      <span>Authorized & Dispatched</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setApprovedState(true)}
                      className="px-4 py-2 text-xs font-semibold text-[#09090D] bg-[#F2C879] hover:bg-[#E5BC6D] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Approve Distribution</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Step payload / log preview */}
            <div>
              <div className="text-[11px] font-mono text-[#777487] mb-2">{currentStep.payloadTitle}</div>
              <pre className="p-4 rounded-lg bg-[#101016] border border-[#292936] font-mono text-xs text-[#A5A2B4] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {currentStep.payloadContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
