import React, { useState } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Tabs } from '../design-system/Tabs';
import { Button } from '../design-system/Button';
import { STARTER_TEMPLATES, TemplateDefinition } from '../data/templates';
import { TemplatePreviewModal } from '../components/app/TemplatePreviewModal';
import {
  Compass,
  Code2,
  BookOpen,
  Server,
  Activity,
  Sparkles,
  ArrowRight,
  Layers,
  Wrench,
  Eye,
} from 'lucide-react';

interface TemplatesPageProps {
  onSelectTemplateToCreate: (template: TemplateDefinition) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Code2,
  BookOpen,
  Server,
  Activity,
  Sparkles,
};

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onSelectTemplateToCreate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'research', label: 'Research' },
    { id: 'coding', label: 'Coding' },
    { id: 'learning', label: 'Learning' },
    { id: 'business', label: 'Business' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'custom', label: 'Custom' },
  ];

  const filteredTemplates = STARTER_TEMPLATES.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="Templates"
        description="Discover pre-calibrated specialist agent blueprints with verified boundaries, inputs, and approved tools."
      />

      {/* Category Tabs */}
      <div className="flex items-center justify-between pb-2">
        <Tabs
          items={categories}
          activeId={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => {
          const IconComponent = iconMap[template.iconName] || Sparkles;

          return (
            <div
              key={template.id}
              onClick={() => setPreviewTemplate(template)}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141E] transition-all duration-150 cursor-pointer group text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComponent size={20} />
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#171720] text-[#777487] px-2 py-0.5 rounded border border-[#292936]">
                    {template.category}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#F4F2FA] mb-2 group-hover:text-white transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-3 mb-6">
                  {template.summary}
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-[#292936]/80 flex items-center justify-between text-xs text-[#777487] mb-4">
                  <div className="flex items-center gap-1">
                    <Wrench size={12} className="text-[#A78BFA]" />
                    <span>{template.defaultTools.length} tools included</span>
                  </div>
                  <span className="text-[11px] font-mono">{template.suggestedSchedule}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    leftIcon={<Eye size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="flex-1"
                  >
                    Preview blueprint
                  </Button>
                  <Button
                    variant="primary"
                    size="xs"
                    rightIcon={<ArrowRight size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplateToCreate(template);
                    }}
                    className="flex-1"
                  >
                    Use template
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blueprint Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={(tpl) => {
          setPreviewTemplate(null);
          onSelectTemplateToCreate(tpl);
        }}
      />
    </div>
  );
};
