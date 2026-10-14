import React, { useState } from 'react';
import { Compass, Code2, BookOpen, Server, Check, ShieldAlert, ArrowRight, Wrench, Clock, FileText } from 'lucide-react';
import { SPECIALIST_AGENTS } from '../data/agents';
import { SpecialistType } from '../types';

interface CapabilitiesProps {
  onConfigureAgent: (type: SpecialistType) => void;
}

export const Capabilities: React.FC<CapabilitiesProps> = ({ onConfigureAgent }) => {
  const [activeTab, setActiveTab] = useState<SpecialistType>('research');

  const icons = {
    research: Compass,
    coding: Code2,
    learning: BookOpen,
    operations: Server,
  };

  const selectedAgent = SPECIALIST_AGENTS.find((a) => a.id === activeTab) || SPECIALIST_AGENTS[0];

  return (
    <section id="capabilities" className="py-24 md:py-32" aria-labelledby="capabilities-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#A78BFA]">
            Specialized Architectures
          </div>
          <h2
            id="capabilities-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F2FA]"
          >
            One platform. A workforce of specialists.
          </h2>
          <p className="text-base sm:text-lg text-[#A5A2B4] leading-relaxed text-pretty">
            Rather than relying on single generalist prompts, CORE isolates workflows into bounded, purpose-built agents.
            Each runs with designated permissions, approved tool whitelists, and deterministic review criteria.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SPECIALIST_AGENTS.map((agent) => {
            const Icon = icons[agent.id];
            const isCurrent = activeTab === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setActiveTab(agent.id)}
                className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#171720] border-[#A78BFA] shadow-lg shadow-[#A78BFA]/5 ring-1 ring-[#A78BFA]/30'
                    : 'bg-[#101016] border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141C]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCurrent ? 'bg-[#A78BFA]/20 text-[#C4B5FD]' : 'bg-[#171720] text-[#A5A2B4]'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-mono text-[#777487] tracking-wider uppercase">
                      {agent.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F4F2FA] mb-2">{agent.title}</h3>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed mb-6">{agent.description}</p>
                </div>

                <div className="pt-4 border-t border-[#292936]/60">
                  <div className="text-[11px] text-[#777487] mb-2 flex items-center gap-1.5">
                    <Wrench size={12} className="text-[#A78BFA]" />
                    <span>Approved tools:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {agent.tools.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-[#A5A2B4] bg-[#09090D] px-2 py-0.5 rounded border border-[#292936]"
                      >
                        {t}
                      </span>
                    ))}
                    {agent.tools.length > 2 && (
                      <span className="text-[10px] text-[#777487] px-1 py-0.5">
                        +{agent.tools.length - 2} more
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfigureAgent(agent.id);
                    }}
                    className="w-full flex items-center justify-between text-xs font-medium text-[#F4F2FA] hover:text-[#C4B5FD] py-2 px-3 rounded-lg bg-[#09090D] hover:bg-[#171720] border border-[#292936] transition-colors"
                  >
                    <span>Configure template</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Configuration & Trace Inspector Panel */}
        <div className="bg-[#101016] border border-[#292936] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292936]">
            <div>
              <div className="text-xs text-[#A78BFA] font-medium mb-1">Interactive Specification</div>
              <h3 className="text-xl font-bold text-[#F4F2FA] flex items-center gap-2">
                <span>{selectedAgent.title}</span>
                <span className="text-xs font-normal text-[#777487] font-mono">[{selectedAgent.id}]</span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onConfigureAgent(selectedAgent.id)}
                className="px-4 py-2 text-xs font-semibold text-[#09090D] bg-[#F4F2FA] hover:bg-white rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Deploy with template</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            {/* Column 1: Cadence and Triggers */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F2FA]">
                <Clock size={15} className="text-[#A78BFA]" />
                <span>Execution Trigger</span>
              </div>
              <div className="bg-[#09090D] p-3.5 rounded-xl border border-[#292936]">
                <div className="text-xs font-mono text-[#F4F2FA] mb-1">{selectedAgent.sampleTrigger}</div>
                <div className="text-[11px] text-[#777487]">
                  Triggers can be scheduled (cron) or dispatched via authenticated webhook payloads.
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F2FA] pt-2">
                <FileText size={15} className="text-[#A78BFA]" />
                <span>Structured Output</span>
              </div>
              <div className="bg-[#09090D] p-3.5 rounded-xl border border-[#292936] text-xs text-[#A5A2B4] leading-relaxed">
                {selectedAgent.sampleOutput}
              </div>
            </div>

            {/* Column 2: Approved Tool Whitelist */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F2FA]">
                <Wrench size={15} className="text-[#A78BFA]" />
                <span>Approved Tool Whitelist</span>
              </div>
              <div className="space-y-2">
                {selectedAgent.tools.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#09090D] border border-[#292936] text-xs"
                  >
                    <span className="text-[#F4F2FA]">{tool}</span>
                    <span className="text-[10px] text-[#65D6A3] flex items-center gap-1">
                      <Check size={12} />
                      <span>Whitelisted</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Consequential Action Guardrail */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F2FA]">
                <ShieldAlert size={15} className="text-[#F2C879]" />
                <span>Boundary & Review Gate</span>
              </div>
              <div className="bg-[#09090D] p-4 rounded-xl border border-[#292936] space-y-3">
                <div className="text-xs text-[#F2C879] font-medium">Safety Contract:</div>
                <p className="text-xs text-[#A5A2B4] leading-relaxed">{selectedAgent.guardrail}</p>
                <div className="pt-2 border-t border-[#292936] flex items-center gap-2 text-[11px] text-[#777487]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65D6A3]" />
                  <span>Enforced at API gateway prior to execution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
