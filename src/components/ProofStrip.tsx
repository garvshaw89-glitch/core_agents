import React from 'react';
import { Layers, GitFork, UserCheck, History } from 'lucide-react';

export const ProofStrip: React.FC = () => {
  const principles = [
    {
      icon: Layers,
      title: 'Specialized agents',
      description: 'Domain-bounded models configured with precise instructions and approved tool suites.',
    },
    {
      icon: GitFork,
      title: 'Connected workflows',
      description: 'Multi-stage execution chains with deterministic inputs, scheduled triggers, and structured output.',
    },
    {
      icon: UserCheck,
      title: 'Human-controlled execution',
      description: 'Consequential operations pause for explicit review before external dispatch or database commits.',
    },
    {
      icon: History,
      title: 'Transparent activity history',
      description: 'Auditable traces of every prompt permutation, tool invocation, and decision path.',
    },
  ];

  return (
    <section
      id="platform"
      className="py-12 border-y border-[#292936] bg-[#101016]/40"
      aria-label="Platform Architecture Principles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#171720]/40 transition-colors"
              >
                <div className="p-2 rounded-lg bg-[#171720] border border-[#292936] text-[#A78BFA] shrink-0 mt-0.5">
                  <Icon size={17} />
                </div>
                <div>
                  <div className="text-xs text-[#777487] font-mono mb-1">0{index + 1}</div>
                  <h2 className="text-sm font-semibold text-[#F4F2FA] mb-1">{item.title}</h2>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
