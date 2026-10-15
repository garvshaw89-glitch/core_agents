import React from 'react';
import { MarketplaceTemplate } from '../../data/templates';
import { Button } from '../../design-system/Button';
import {
  Code2,
  Compass,
  Server,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

interface FeaturedTemplatesProps {
  featuredTemplates: MarketplaceTemplate[];
  userAgents: Array<{ sourceTemplateId?: string }>;
  onViewDetails: (template: MarketplaceTemplate) => void;
  onUseTemplate: (template: MarketplaceTemplate) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Compass,
  Server,
  Sparkles,
};

export const FeaturedTemplates: React.FC<FeaturedTemplatesProps> = ({
  featuredTemplates,
  userAgents,
  onViewDetails,
  onUseTemplate,
}) => {
  if (featuredTemplates.length === 0) return null;

  return (
    <section className="space-y-4 text-left" aria-labelledby="featured-heading">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider mb-1">
          <Sparkles size={13} />
          <span>Curated Specialists</span>
        </div>
        <h2 id="featured-heading" className="text-xl sm:text-2xl font-bold text-[#F4F2FA]">
          Start with something powerful
        </h2>
        <p className="text-xs sm:text-sm text-[#A5A2B4] mt-0.5">
          A few carefully selected starting points for your AI workforce.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {featuredTemplates.map((template) => {
          const IconComponent = iconMap[template.iconName] || Sparkles;
          const isAdded = userAgents.some((a) => a.sourceTemplateId === template.id);

          return (
            <div
              key={template.id}
              className="relative p-6 rounded-2xl bg-[#111118] border border-[#292936] hover:border-[#A78BFA]/50 transition-all duration-200 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Editorial Reason Pill */}
                {template.featuredReason && (
                  <div className="text-[11px] text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-2.5 py-1 rounded-lg mb-4 line-clamp-1">
                    ★ {template.featuredReason}
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <IconComponent size={24} />
                  </div>

                  <span className="text-[10px] font-mono uppercase bg-[#171720] text-[#777487] px-2 py-0.5 rounded border border-[#292936]">
                    {template.categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold text-[#F4F2FA] group-hover:text-white transition-colors">
                    {template.name}
                  </h3>
                  {isAdded && (
                    <span className="text-[10px] font-medium text-[#65D6A3] bg-[#65D6A3]/10 px-1.5 py-0.5 rounded border border-[#65D6A3]/20 flex items-center gap-0.5">
                      <CheckCircle2 size={10} />
                      <span>Added</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#A5A2B4] leading-relaxed mb-4 line-clamp-2">
                  {template.summary}
                </p>

                {/* Capabilities preview */}
                <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-[#09090D] border border-[#292936]/80 text-xs">
                  <div className="text-[10px] uppercase font-mono text-[#777487]">Key Capabilities</div>
                  {template.capabilities.slice(0, 2).map((cap) => (
                    <div key={cap.name} className="flex items-center gap-1.5 text-[11px] text-[#F4F2FA]">
                      <span className="w-1 h-1 rounded-full bg-[#A78BFA]" />
                      <span className="truncate">{cap.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#292936] flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  leftIcon={<Eye size={12} />}
                  onClick={() => onViewDetails(template)}
                  className="flex-1"
                >
                  Inspect details
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  rightIcon={<ArrowRight size={12} />}
                  onClick={() => onUseTemplate(template)}
                  className="flex-1"
                >
                  {isAdded ? 'Create another' : 'Use template'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
