import React, { useState } from 'react';
import { ArrowRight, Compass, Code2, BookOpen, Server, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CoreSymbol } from './CoreSymbol';
import { SPECIALIST_AGENTS } from '../data/agents';
import { SpecialistType } from '../types';

interface HeroProps {
  onBuildFirstAgent: () => void;
  onExplorePlatform: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBuildFirstAgent, onExplorePlatform }) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistType>('research');

  const specialistIcons = {
    research: Compass,
    coding: Code2,
    learning: BookOpen,
    operations: Server,
  };

  const activeAgent = SPECIALIST_AGENTS.find((a) => a.id === selectedSpecialist) || SPECIALIST_AGENTS[0];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden" aria-label="Hero">
      {/* Background radial gradient anchor - subtle violet glow */}
      <div
        className="pointer-events-none absolute top-1/4 right-1/4 -z-10 w-[600px] h-[600px] rounded-full bg-[#A78BFA]/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 -left-40 -z-10 w-[500px] h-[500px] rounded-full bg-[#101016] blur-[90px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition and Call to Action */}
          <div className="lg:col-span-6 space-y-8 z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#A78BFA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" aria-hidden="true" />
              <span>YOUR AI WORKFORCE, BUILT AROUND YOU</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4F2FA] leading-[1.08] text-balance">
              Build your own <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F2FA] via-[#F4F2FA] to-[#C4B5FD]">
                AI workforce.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#A5A2B4] leading-relaxed max-w-xl text-pretty">
              Create specialized AI agents that research, build, analyze, and handle repeatable work — while you stay in control.
            </p>

            {/* Action Group */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onBuildFirstAgent}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#09090D] bg-[#F4F2FA] hover:bg-white active:bg-[#E2DEEE] transition-all rounded-xl shadow-lg shadow-black/40 hover:shadow-[#A78BFA]/10 focus-visible:outline-2 focus-visible:outline-[#A78BFA] cursor-pointer"
                >
                  <span>Build your first agent</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={onExplorePlatform}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#F4F2FA] bg-[#171720] hover:bg-[#20202C] border border-[#292936] hover:border-[#3D3D4E] transition-all rounded-xl focus-visible:outline-2 focus-visible:outline-[#A78BFA] cursor-pointer"
                >
                  <span>Explore the platform</span>
                </button>
              </div>

              {/* Supporting Microcopy */}
              <div className="flex items-center gap-2 text-xs text-[#777487]">
                <Sparkles size={13} className="text-[#A78BFA]" />
                <span>Start with a template. Customize every step.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Genuine Frontend Agent Ecosystem Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-lg relative bg-[#101016]/90 border border-[#292936] rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
              {/* Header bar of visual */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#292936]/80 text-xs">
                <div className="flex items-center gap-2 text-[#A5A2B4]">
                  <CoreSymbol size={18} />
                  <span className="font-medium text-[#F4F2FA]">CORE Orchestration Grid</span>
                </div>
                <div className="text-[11px] text-[#A5A2B4] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65D6A3]" aria-hidden="true" />
                  <span className="tabular-nums">4 Active Specialists</span>
                </div>
              </div>

              {/* Central interactive agent network canvas */}
              <div className="relative py-4">
                {/* Central CORE Intelligence Node */}
                <div className="relative mx-auto w-36 h-36 rounded-full border border-[#292936] bg-[#171720] flex flex-col items-center justify-center text-center p-3 z-20 shadow-xl shadow-black/60 group">
                  {/* Subtle outer breathing ring */}
                  <div className="absolute inset-0 rounded-full border border-[#A78BFA]/30 animate-pulse-subtle pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full border border-[#292936]/50 stroke-dasharray pointer-events-none" />

                  <CoreSymbol size={32} className="text-[#A78BFA] mb-1.5" />
                  <span className="text-xs font-semibold text-[#F4F2FA]">CORE Matrix</span>
                  <span className="text-[10px] text-[#777487] leading-tight">Bounded Control</span>
                </div>

                {/* 4 Satellite Agent Cards in 2x2 Grid surrounding CORE */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {SPECIALIST_AGENTS.map((agent) => {
                    const Icon = specialistIcons[agent.id];
                    const isSelected = selectedSpecialist === agent.id;

                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => setSelectedSpecialist(agent.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#171720] border-[#A78BFA] shadow-md shadow-[#A78BFA]/10 ring-1 ring-[#A78BFA]/40'
                            : 'bg-[#101016] border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141C]'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-[#A78BFA]/20 text-[#C4B5FD]' : 'bg-[#171720] text-[#A5A2B4]'
                            }`}
                          >
                            <Icon size={15} />
                          </div>
                          <span
                            className={`text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#A78BFA]/15 text-[#C4B5FD]'
                                : 'bg-[#171720] text-[#777487]'
                            }`}
                          >
                            {agent.id}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#F4F2FA] truncate">{agent.title}</div>
                        <div className="text-[11px] text-[#A5A2B4] line-clamp-1 mt-0.5">{agent.tagline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Agent Live State Telemetry Inspector */}
              <div className="mt-4 pt-4 border-t border-[#292936] bg-[#09090D]/60 rounded-xl p-3.5 border border-[#292936]/60">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 text-[#F4F2FA] font-medium">
                    <CheckCircle2 size={13} className="text-[#65D6A3]" />
                    <span>{activeAgent.title}</span>
                  </div>
                  <span className="text-[11px] text-[#777487]">Interactive Preview</span>
                </div>

                <div className="text-xs text-[#A5A2B4] mb-3 leading-relaxed">
                  <span className="text-[#777487]">Current Action: </span>
                  {activeAgent.activeTask}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#292936]/40 text-[#777487]">
                  <div className="flex items-center gap-1 text-[#F2C879]">
                    <ShieldCheck size={13} />
                    <span>Human Approval: Required</span>
                  </div>
                  <div className="text-[#A5A2B4]">
                    {activeAgent.tools.length} Approved Tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
