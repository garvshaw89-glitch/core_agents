import React, { useState } from 'react';
import { Sliders, CheckCircle2, ShieldCheck, Play, ArrowRight, Check } from 'lucide-react';
import { CoreSymbol } from './CoreSymbol';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [demoApproved, setDemoApproved] = useState<boolean>(false);

  const steps = [
    {
      num: '01',
      title: 'Choose a starting point.',
      subtitle: 'Start with a specialist template or create a custom agent.',
      detail:
        'Select from pre-calibrated blueprints tailored for research, code intelligence, learning, or data operations — or construct a custom architecture with isolated system parameters.',
    },
    {
      num: '02',
      title: 'Configure its capabilities.',
      subtitle: 'Define instructions, approved tools, knowledge sources, and permissions.',
      detail:
        'Specify exactly which external APIs, documentation endpoints, and local codebases the agent can read. Hard-code boundary restrictions and mandate review triggers.',
    },
    {
      num: '03',
      title: 'Run and review.',
      subtitle: 'Execute the agent, inspect its output, and approve consequential actions.',
      detail:
        'The agent gathers verified context, prepares structured drafts, and halts whenever a consequential action (publishing, modifying code, dispatching emails) is proposed.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#101016]/40 border-t border-[#292936]" aria-labelledby="hiw-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#A78BFA]">
            Deterministic Lifecycle
          </div>
          <h2 id="hiw-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F2FA]">
            How it works
          </h2>
          <p className="text-base sm:text-lg text-[#A5A2B4] leading-relaxed">
            From initial template setup to human-verified execution, every step is transparent and under your direct supervision.
          </p>
        </div>

        {/* Steps Grid with Interactive Visual Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Selector List */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step, idx) => {
              const stepNumber = idx + 1;
              const isSelected = activeStep === stepNumber;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(stepNumber)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#171720] border-[#A78BFA] shadow-md shadow-[#A78BFA]/5'
                      : 'bg-[#101016] border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141C]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-[#A78BFA]/20 text-[#C4B5FD]' : 'bg-[#09090D] text-[#777487]'
                      }`}
                    >
                      Step {step.num}
                    </span>
                    <span className="text-xs text-[#777487]">Phase {stepNumber} of 3</span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F4F2FA] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed mb-3">{step.subtitle}</p>

                  {isSelected && (
                    <p className="text-xs text-[#777487] pt-3 border-t border-[#292936] leading-relaxed">
                      {step.detail}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Graphic / Step State Simulator */}
          <div className="lg:col-span-7 bg-[#101016] border border-[#292936] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#292936]">
              <div className="flex items-center gap-2 text-xs text-[#F4F2FA] font-medium">
                <CoreSymbol size={16} />
                <span>Lifecycle Simulation · Step 0{activeStep}</span>
              </div>
              <span className="text-[11px] font-mono text-[#777487]">
                {activeStep === 1 && 'Template Blueprint'}
                {activeStep === 2 && 'Security & Tool Whitelist'}
                {activeStep === 3 && 'Human Approval Barrier'}
              </span>
            </div>

            {/* Step 1 Visual: Specialist Blueprint Picker */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs text-[#A5A2B4]">Select a specialized starting blueprint:</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#171720] border border-[#A78BFA] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F4F2FA]">Competitive Intel</span>
                      <Check size={14} className="text-[#A78BFA]" />
                    </div>
                    <p className="text-[11px] text-[#A5A2B4]">Public changelogs & release diff parsing</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] opacity-75 space-y-1.5">
                    <span className="text-xs font-semibold text-[#F4F2FA]">Code Triager</span>
                    <p className="text-[11px] text-[#777487]">Reproduce issues & draft minimal test cases</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] opacity-75 space-y-1.5">
                    <span className="text-xs font-semibold text-[#F4F2FA]">Curriculum Tutor</span>
                    <p className="text-[11px] text-[#777487]">Construct progressive study roadmaps</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] opacity-75 space-y-1.5">
                    <span className="text-xs font-semibold text-[#F4F2FA]">Ops Monitor</span>
                    <p className="text-[11px] text-[#777487]">Scheduled metric auditing & anomaly alerts</p>
                  </div>
                </div>
                <div className="p-3 bg-[#09090D] rounded-xl border border-[#292936] text-[11px] text-[#777487] flex items-center justify-between">
                  <span>Custom scratch model option available</span>
                  <span className="font-mono text-[#A78BFA]">Next: Define boundaries</span>
                </div>
              </div>
            )}

            {/* Step 2 Visual: Permissions & Tool Configuration */}
            {activeStep === 2 && (
              <div className="space-y-3">
                <div className="text-xs text-[#A5A2B4]">Bounded Tool Entitlements:</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090D] border border-[#292936]">
                    <div>
                      <div className="text-xs font-semibold text-[#F4F2FA]">Web Content Scraper</div>
                      <div className="text-[11px] text-[#777487]">Allow fetching public HTML/JSON documentation</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#65D6A3]/10 text-[#65D6A3] border border-[#65D6A3]/20">
                      WHITELISTED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090D] border border-[#292936]">
                    <div>
                      <div className="text-xs font-semibold text-[#F4F2FA]">Slack Notification Dispatch</div>
                      <div className="text-[11px] text-[#777487]">Send executive summaries to internal channel</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F2C879]/10 text-[#F2C879] border border-[#F2C879]/20">
                      APPROVAL GATED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090D] border border-[#292936]">
                    <div>
                      <div className="text-xs font-semibold text-[#F4F2FA]">Arbitrary Shell Execution</div>
                      <div className="text-[11px] text-[#777487]">Run CLI commands in environment</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F07885]/10 text-[#F07885] border border-[#F07885]/20">
                      STRICTLY BLOCKED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Visual: Human Approval Barrier */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="text-xs text-[#A5A2B4]">Consequential Action Approval Barrier:</div>

                <div className="p-4 rounded-xl bg-[#171720] border border-[#F2C879]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F2C879]">
                      <ShieldCheck size={16} />
                      <span>Pending Consequential Action</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#777487]">Trace #4891-B</span>
                  </div>

                  <div className="text-xs text-[#F4F2FA]">
                    <strong>Proposal:</strong> Send 4-page Competitor Intelligence Digest to leadership list (12 recipients).
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#09090D] border border-[#292936] text-[11px] text-[#A5A2B4]">
                    "Sources verified: 14 public changelogs. Diff highlights validated. Zero hallucinations flagged."
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {demoApproved ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#65D6A3] font-medium py-1 px-3 bg-[#65D6A3]/10 rounded-lg">
                        <CheckCircle2 size={15} />
                        <span>Action Approved & Executed</span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setDemoApproved(false)}
                          className="px-3 py-1.5 text-xs font-medium text-[#A5A2B4] hover:text-[#F4F2FA] rounded-lg bg-[#09090D] border border-[#292936]"
                        >
                          Request Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDemoApproved(true)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-[#09090D] bg-[#65D6A3] hover:bg-[#57C794] rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          <Check size={13} />
                          <span>Approve & Dispatch</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#777487] flex items-center justify-between">
                  <span>Audit log record created synchronously</span>
                  <button
                    type="button"
                    onClick={() => setDemoApproved(false)}
                    className="text-[#A78BFA] hover:underline"
                  >
                    Reset simulation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
