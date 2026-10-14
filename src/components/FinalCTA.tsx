import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CoreSymbol } from './CoreSymbol';

interface FinalCTAProps {
  onCreateAgent: () => void;
  onExploreUseCases: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onCreateAgent, onExploreUseCases }) => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden" aria-label="Call to Action">
      {/* Background subtle radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[600px] h-[350px] rounded-full bg-[#A78BFA]/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#101016] border border-[#292936] text-center relative overflow-hidden shadow-2xl">
          {/* Subtle top hairline accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#A78BFA]/40 to-transparent" />

          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#171720] border border-[#292936] mb-6">
            <CoreSymbol size={32} />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F2FA] mb-4 text-balance">
            Put your repetitive work on autopilot.
          </h2>

          <p className="text-base sm:text-lg text-[#A5A2B4] max-w-xl mx-auto mb-8 text-pretty">
            Start with one agent. Build a workflow that gives you time back.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-6">
            <button
              type="button"
              onClick={onCreateAgent}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#09090D] bg-[#F4F2FA] hover:bg-white active:bg-[#E2DEEE] transition-all rounded-xl shadow-lg shadow-black/40 hover:shadow-[#A78BFA]/10 cursor-pointer"
            >
              <span>Create your first agent</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={onExploreUseCases}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#F4F2FA] bg-[#171720] hover:bg-[#20202C] border border-[#292936] transition-all rounded-xl cursor-pointer"
            >
              <span>Explore use cases</span>
            </button>
          </div>

          <div className="text-xs text-[#777487] flex items-center justify-center gap-2">
            <Sparkles size={13} className="text-[#A78BFA]" />
            <span>Deterministic boundaries · Explicit human approval barrier</span>
          </div>
        </div>
      </div>
    </section>
  );
};
