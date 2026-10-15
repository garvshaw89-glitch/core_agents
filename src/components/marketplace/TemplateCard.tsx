import React from 'react';
import { MarketplaceTemplate } from '../../data/templates';
import { Button } from '../../design-system/Button';
import {
  Code2,
  Compass,
  Server,
  BookOpen,
  Sparkles,
  Activity,
  FileText,
  ArrowRight,
  Eye,
  CheckCircle2,
  Wrench,
  Shield,
  Layers,
} from 'lucide-react';

interface TemplateCardProps {
  template: MarketplaceTemplate;
  isAlreadyAdded?: boolean;
  addedCount?: number;
  onViewDetails: (template: MarketplaceTemplate) => void;
  onUseTemplate: (template: MarketplaceTemplate) => void;
  layout?: 'grid' | 'list';
}

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Compass,
  Server,
  BookOpen,
  Sparkles,
  Activity,
  FileText,
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isAlreadyAdded = false,
  addedCount = 0,
  onViewDetails,
  onUseTemplate,
  layout = 'grid',
}) => {
  const IconComponent = iconMap[template.iconName] || Sparkles;

  const complexityColorMap = {
    Minimal: 'text-[#65D6A3] bg-[#65D6A3]/10 border-[#65D6A3]/20',
    Standard: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20',
    Advanced: 'text-[#F2C879] bg-[#F2C879]/10 border-[#F2C879]/20',
  };

  if (layout === 'list') {
    return (
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141E] transition-all duration-150 gap-4 text-left group"
      >
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
            <IconComponent size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-[#F4F2FA] group-hover:text-white transition-colors">
                {template.name}
              </h3>
              <span className="text-[10px] font-mono uppercase bg-[#171720] text-[#777487] px-2 py-0.5 rounded border border-[#292936]">
                {template.categoryLabel}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  complexityColorMap[template.setupComplexity]
                }`}
              >
                {template.setupComplexity} setup
              </span>
              {isAlreadyAdded && (
                <span className="text-[10px] font-medium text-[#65D6A3] bg-[#65D6A3]/10 px-2 py-0.5 rounded border border-[#65D6A3]/20 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>Added {addedCount > 1 ? `(${addedCount})` : ''}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#A5A2B4] leading-relaxed max-w-2xl line-clamp-2 mb-2">
              {template.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-[#777487] bg-[#09090D] px-2 py-0.5 rounded border border-[#292936]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#292936]/60">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Eye size={13} />}
            onClick={() => onViewDetails(template)}
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight size={13} />}
            onClick={() => onUseTemplate(template)}
          >
            {isAlreadyAdded ? 'Create another' : 'Use template'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-between p-6 rounded-2xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141E] transition-all duration-150 text-left group"
    >
      <div>
        {/* Top bar with icon, category, and complexity */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={20} />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-mono uppercase bg-[#171720] text-[#777487] px-2 py-0.5 rounded border border-[#292936]">
              {template.categoryLabel}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                complexityColorMap[template.setupComplexity]
              }`}
            >
              {template.setupComplexity} setup
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-[#F4F2FA] group-hover:text-white transition-colors">
            {template.name}
          </h3>
          {isAlreadyAdded && (
            <span
              className="text-[10px] font-medium text-[#65D6A3] bg-[#65D6A3]/10 px-1.5 py-0.2 rounded border border-[#65D6A3]/20 flex items-center gap-0.5"
              title="You have already created an agent from this blueprint"
            >
              <CheckCircle2 size={10} />
              <span>Added</span>
            </span>
          )}
        </div>

        {/* Summary Description */}
        <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-3 mb-5">
          {template.summary}
        </p>

        {/* Capability Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-[#777487] bg-[#09090D] px-2 py-0.5 rounded border border-[#292936]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-[#292936]/80 space-y-4">
        <div className="flex items-center justify-between text-[11px] text-[#777487]">
          <div className="flex items-center gap-1">
            <Wrench size={12} className="text-[#A78BFA]" />
            <span>{template.requiredTools.length} tools</span>
          </div>
          {template.requiredIntegrations.length > 0 ? (
            <span className="text-[10px] text-[#F2C879]">Integration required</span>
          ) : (
            <span className="text-[10px] text-[#65D6A3]">Zero integrations needed</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="xs"
            leftIcon={<Eye size={12} />}
            onClick={() => onViewDetails(template)}
            className="w-full"
          >
            View details
          </Button>
          <Button
            variant="primary"
            size="xs"
            rightIcon={<ArrowRight size={12} />}
            onClick={() => onUseTemplate(template)}
            className="w-full"
          >
            {isAlreadyAdded ? 'Create copy' : 'Use template'}
          </Button>
        </div>
      </div>
    </div>
  );
};
