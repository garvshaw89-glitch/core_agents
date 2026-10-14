import React from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onSelectTier: (tierName: string) => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectTier }) => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'during early access',
      description: 'For individuals exploring bounded specialist agents for personal or project automation.',
      features: [
        '3 active specialist agents',
        'Standard research & coding templates',
        'Manual review queue for all proposals',
        '7-day execution trace retention',
        'Community support & documentation',
      ],
      cta: 'Join with Starter',
      highlighted: false,
    },
    {
      name: 'Team',
      price: '$49',
      period: 'per month / seat',
      description: 'For collaborative teams deploying recurring market research, issue triage, and operational digests.',
      features: [
        '15 active specialist agents',
        'All templates + custom agent builder',
        'Scheduled cron & webhook event triggers',
        'Multi-seat approval & review routing',
        '30-day cryptographic trace history',
        'Role-based tool access controls',
      ],
      cta: 'Request Team Access',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored deployment',
      description: 'For organizations requiring dedicated execution isolation, VPC egress controls, and bespoke tool integrations.',
      features: [
        'Unlimited bounded specialist agents',
        'Private VPC / isolated execution environments',
        'Custom enterprise tool connectors & APIs',
        'SSO / SAML authentication & SCIM',
        'Full tamper-evident audit log streaming',
        'Dedicated SLA and onboarding engineer',
      ],
      cta: 'Discuss Enterprise',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#A78BFA]">
            Transparent Entitlements
          </div>
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F2FA]">
            Predictable plans. No hidden lock-in.
          </h2>
          <p className="text-base sm:text-lg text-[#A5A2B4] leading-relaxed">
            Choose the operational capacity appropriate for your workflow. All tiers include strict human approval
            controls and deterministic boundary enforcement.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col justify-between p-8 rounded-2xl border transition-all duration-200 ${
                tier.highlighted
                  ? 'bg-[#171720] border-[#A78BFA] shadow-xl shadow-[#A78BFA]/10 ring-1 ring-[#A78BFA]/40 relative'
                  : 'bg-[#101016] border-[#292936] hover:border-[#3D3D4E]'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-8 px-2.5 py-0.5 rounded-full bg-[#A78BFA] text-[#09090D] text-[10px] font-bold uppercase tracking-wider">
                  Recommended for Teams
                </div>
              )}

              <div>
                <div className="text-lg font-bold text-[#F4F2FA] mb-1">{tier.name}</div>
                <p className="text-xs text-[#A5A2B4] min-h-[36px] mb-6 leading-relaxed">
                  {tier.description}
                </p>

                <div className="mb-6 pb-6 border-b border-[#292936]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight text-[#F4F2FA] font-mono">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#777487]">{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-medium text-[#F4F2FA]">Included capabilities:</div>
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-[#A5A2B4]">
                      <Check size={14} className="text-[#65D6A3] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectTier(tier.name)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    tier.highlighted
                      ? 'bg-[#F4F2FA] text-[#09090D] hover:bg-white shadow-md'
                      : 'bg-[#171720] text-[#F4F2FA] hover:bg-[#20202C] border border-[#292936]'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight size={14} />
                </button>
                <div className="mt-3 text-center text-[10px] text-[#777487] flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-[#A78BFA]" />
                  <span>Human approval barrier included</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
