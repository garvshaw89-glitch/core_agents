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
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#38D9FF] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38D9FF] shadow-[0_0_8px_rgba(56,217,255,0.6)]" aria-hidden="true" />
              <span>YOUR AI WORKFORCE, BUILT AROUND YOU</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4F7FC] leading-[1.08] text-balance">
              Build your own <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F7FC] via-[#F4F7FC] to-[#80E5FF]">
                AI workforce.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#9AA7BC] leading-relaxed max-w-xl text-pretty">
              Create specialized AI agents that research, build, analyze, and handle repeatable work — while you stay in control.
            </p>

            {/* Action Group */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={onBuildFirstAgent}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#080B16] bg-[#38D9FF] hover:bg-[#80E5FF] active:bg-[#22B8DC] transition-all rounded-xl shadow-[0_0_20px_rgba(56,217,255,0.3)] hover:shadow-[0_0_28px_rgba(56,217,255,0.45)] cursor-pointer"
                >
                  <span>Build your first agent</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={onExplorePlatform}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#F4F7FC] bg-[#111827] hover:bg-[#151D2E] border border-slate-700/60 hover:border-slate-500 transition-all rounded-xl cursor-pointer"
                >
                  <span>Explore the platform</span>
                </button>
              </div>

              {/* Supporting Microcopy */}
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Sparkles size={13} className="text-[#38D9FF]" />
                <span>Start with a template. Customize every step.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Genuine Frontend Agent Ecosystem Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-lg relative bg-[#0D1220]/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
              {/* Header bar of visual */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-[#9AA7BC]">
                  <CoreSymbol size={18} />
                  <span className="font-medium text-[#F4F7FC]">CORE Orchestration Grid</span>
                </div>
                <div className="text-[11px] text-[#9AA7BC] flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shadow-[0_0_6px_rgba(52,211,153,0.6)]" aria-hidden="true" />
                  <span className="tabular-nums">4 Active Specialists</span>
                </div>
              </div>

              {/* Central interactive agent network canvas */}
              <div className="relative py-4">
                {/* Central CORE Intelligence Node */}
                <div className="relative mx-auto w-36 h-36 rounded-full border border-slate-800 bg-[#111827] flex flex-col items-center justify-center text-center p-3 z-20 shadow-xl shadow-black/60 group">
                  {/* Outer breathing ring */}
                  <div className="absolute inset-0 rounded-full border border-[#38D9FF]/40 animate-pulse-subtle pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full border border-slate-800/60 pointer-events-none" />

                  <CoreSymbol size={32} className="text-[#38D9FF] mb-1.5" />
                  <span className="text-xs font-semibold text-[#F4F7FC]">CORE Matrix</span>
                  <span className="text-[10px] text-[#64748B] leading-tight font-mono">Bounded Control</span>
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
                            ? 'bg-[#151D2E] border-[#38D9FF] shadow-md shadow-[#38D9FF]/10 ring-1 ring-[#38D9FF]/40'
                            : 'bg-[#111827]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#111827]'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-[#38D9FF]/20 text-[#38D9FF]' : 'bg-[#151D2E] text-[#9AA7BC]'
                            }`}
                          >
                            <Icon size={15} />
                          </div>
                          <span
                            className={`text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#38D9FF]/15 text-[#38D9FF]'
                                : 'bg-[#151D2E] text-[#64748B]'
                            }`}
                          >
                            {agent.id}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#F4F7FC] truncate">{agent.title}</div>
                        <div className="text-[11px] text-[#9AA7BC] line-clamp-1 mt-0.5">{agent.tagline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Agent Live State Telemetry Inspector */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 bg-[#080B16]/60 rounded-xl p-3.5 border border-slate-800/60">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 text-[#F4F7FC] font-medium">
                    <CheckCircle2 size={13} className="text-[#34D399]" />
                    <span>{activeAgent.title}</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] font-mono">Interactive Preview</span>
                </div>

                <div className="text-xs text-[#9AA7BC] mb-3 leading-relaxed">
                  <span className="text-[#64748B]">Current Action: </span>
                  {activeAgent.activeTask}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60 text-[#64748B] font-mono">
                  <div className="flex items-center gap-1 text-[#FBBF24]">
                    <ShieldCheck size={13} />
                    <span>Human Approval: Enforced</span>
                  </div>
                  <div className="text-[#9AA7BC]">
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
