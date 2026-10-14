import React, { useState } from 'react';
import { Lock, FileSpreadsheet, History, RotateCcw, Clock, Eye, AlertTriangle, Check, Shield } from 'lucide-react';

export const ControlAndTrust: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'permissions' | 'proposals' | 'audit' | 'retry'>('permissions');

  const governancePillars = [
    {
      id: 'permissions',
      label: 'Explicit Tool Permissions',
      icon: Lock,
      title: 'Whitelist tools per agent',
      desc: 'Restrict agents to specific network endpoints, read-only repositories, and bounded query limits.',
    },
    {
      id: 'proposals',
      label: 'Reviewable Proposals',
      icon: Eye,
      title: 'Consequential action gates',
      desc: 'Any external email, production code diff, or external update requires human sign-off before dispatch.',
    },
    {
      id: 'audit',
      label: 'Execution History',
      icon: History,
      title: 'Full trace reproducibility',
      desc: 'Every prompt input, retrieved chunk, and tool execution is logged with immutable timestamps.',
    },
    {
      id: 'retry',
      label: 'Error & Retry States',
      icon: RotateCcw,
      title: 'Predictable failure modes',
      desc: 'Bounded backoff schedules prevent runaway loops. Dead-letter alerts notify operators immediately.',
    },
  ];

  return (
    <section id="trust" className="py-24 md:py-32 bg-[#101016]/40 border-t border-[#292936]" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#A78BFA]">
            Enterprise Governance
          </div>
          <h2 id="trust-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F2FA]">
            Powerful automation. Clear boundaries.
          </h2>
          <p className="text-base sm:text-lg text-[#A5A2B4] leading-relaxed">
            AI agents shouldn’t operate as black boxes with unrestricted access. CORE enforces granular
            entitlements, approval barriers, and verifiable audit records at every execution boundary.
          </p>
        </div>

        {/* Governance Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tab Column */}
          <div className="lg:col-span-4 space-y-3">
            {governancePillars.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activeTab === pillar.id;

              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActiveTab(pillar.id as any)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#171720] border-[#A78BFA] shadow-md shadow-[#A78BFA]/5'
                      : 'bg-[#101016] border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141C]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-[#A78BFA]/20 text-[#C4B5FD]' : 'bg-[#171720] text-[#777487]'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-semibold text-[#F4F2FA]">{pillar.label}</span>
                  </div>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed pl-8">{pillar.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive Interface Preview Panel */}
          <div className="lg:col-span-8 bg-[#101016] border border-[#292936] rounded-2xl p-6 sm:p-8">
            {/* View 1: Explicit Tool Permissions Matrix */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#292936]">
                  <div>
                    <h3 className="text-base font-semibold text-[#F4F2FA]">Active Tool Entitlements</h3>
                    <p className="text-xs text-[#777487]">Agent: research-specialist-01 · Policy: Strict Isolation</p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#65D6A3]/10 text-[#65D6A3] border border-[#65D6A3]/20">
                    Policy Enforced
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#09090D] border border-[#292936]">
                    <div>
                      <div className="text-xs font-semibold text-[#F4F2FA]">HTTP Public Ingestion (GET)</div>
                      <div className="text-[11px] text-[#777487]">Permitted domain filter: *.github.io, *.gov, *.edu, docs.*</div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#65D6A3]/15 text-[#65D6A3]">Allowed</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#09090D] border border-[#292936]">
                    <div>
                      <div className="text-xs font-semibold text-[#F4F2FA]">Email Dispatch (SMTP / SendGrid)</div>
                      <div className="text-[11px] text-[#777487]">Consequential action: Outbound customer transmission</div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#F2C879]/15 text-[#F2C879]">Approval Required</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#09090D] border border-[#292936]">
                    <div>
                      <div className="text-xs font-semibold text-[#F4F2FA]">Database Direct Write / Mutations</div>
                      <div className="text-[11px] text-[#777487]">Production SQL INSERT, UPDATE, or DELETE operations</div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#F07885]/15 text-[#F07885]">Denied</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Reviewable Action Proposals */}
            {activeTab === 'proposals' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#292936]">
                  <div>
                    <h3 className="text-base font-semibold text-[#F4F2FA]">Staged Action Proposal</h3>
                    <p className="text-xs text-[#777487]">Proposal ID: prop_98124 · Target: github/releases</p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#F2C879]/10 text-[#F2C879] border border-[#F2C879]/20">
                    Awaiting Review
                  </span>
                </div>

                <div className="bg-[#09090D] rounded-xl p-4 border border-[#292936] space-y-3">
                  <div className="text-xs text-[#A5A2B4] leading-relaxed">
                    <span className="text-[#F4F2FA] font-medium">Proposed Operation: </span>
                    Create draft Pull Request in repository <code className="text-[#C4B5FD] font-mono">core/queue-worker</code> with regression fix for ticket #412.
                  </div>

                  <div className="p-3 bg-[#101016] rounded-lg border border-[#292936] font-mono text-[11px] text-[#A5A2B4]">
                    <div>+ // Ensure concurrency lock is released on timeout</div>
                    <div>+ await distributedMutex.release(lockKey);</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#292936]/60 text-xs">
                    <span className="text-[#777487]">Reviewer: Assigned to Team Lead</span>
                    <span className="text-[#65D6A3] font-medium">Safe Sandbox Validated</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Execution History & Trace Log */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#292936]">
                  <div>
                    <h3 className="text-base font-semibold text-[#F4F2FA]">Verifiable Execution Trace</h3>
                    <p className="text-xs text-[#777487]">Cryptographically signed execution records</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#777487]">SHA256 Signed</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#777487]">08:00:01</span>
                      <span className="text-[#F4F2FA]">Trigger received (cron: 0 8 * * 1)</span>
                    </div>
                    <span className="text-[#65D6A3]">PASS</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#777487]">08:00:14</span>
                      <span className="text-[#F4F2FA]">Fetched 4 approved public changelogs</span>
                    </div>
                    <span className="text-[#65D6A3]">200 OK</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#777487]">08:01:02</span>
                      <span className="text-[#F4F2FA]">Synthesis complete · 0 hallucinations flagged</span>
                    </div>
                    <span className="text-[#65D6A3]">VALID</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#777487]">08:01:03</span>
                      <span className="text-[#F2C879]">Consequential Barrier: Halted for Human Review</span>
                    </div>
                    <span className="text-[#F2C879]">HELD</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Clear Error and Retry States */}
            {activeTab === 'retry' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#292936]">
                  <div>
                    <h3 className="text-base font-semibold text-[#F4F2FA]">Predictable Failure Handling</h3>
                    <p className="text-xs text-[#777487]">Strict retry limits with human escalation</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#A5A2B4]">Max 3 Retries</span>
                </div>

                <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#F07885] font-medium">
                    <AlertTriangle size={15} />
                    <span>Handling Transient API Rate Limits</span>
                  </div>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed">
                    If an external endpoint returns HTTP 429 or network disconnect, CORE employs exponential
                    backoff with jitter (2s, 8s, 32s). If exhausted, the agent pauses cleanly and alerts the owner
                    rather than cycling endlessly or corrupting state.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                    <div className="p-2 rounded bg-[#101016] border border-[#292936] text-[#A5A2B4]">
                      Attempt 1: +2s
                    </div>
                    <div className="p-2 rounded bg-[#101016] border border-[#292936] text-[#A5A2B4]">
                      Attempt 2: +8s
                    </div>
                    <div className="p-2 rounded bg-[#101016] border border-[#292936] text-[#F07885]">
                      Escalate to human
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
