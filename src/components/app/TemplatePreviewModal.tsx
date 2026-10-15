import React, { useEffect } from 'react';
import { TemplateDefinition } from '../../data/templates';
import { Button } from '../../design-system/Button';
import {
  X,
  Compass,
  Code2,
  BookOpen,
  Server,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface TemplatePreviewModalProps {
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: TemplateDefinition) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Code2,
  BookOpen,
  Server,
  Activity,
  Sparkles,
};

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const IconComponent = iconMap[template.iconName] || Sparkles;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#111118] border border-[#292936] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-[#292936] shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center shrink-0">
            <IconComponent size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#F4F2FA]">{template.name}</h3>
              <span className="text-[10px] font-mono uppercase bg-[#171720] text-[#A78BFA] px-2 py-0.5 rounded border border-[#292936]">
                {template.category}
              </span>
            </div>
            <p className="text-xs text-[#A5A2B4] mt-0.5">{template.summary}</p>
          </div>
        </div>

        {/* Scrollable Blueprint Content */}
        <div className="overflow-y-auto pr-2 space-y-5 text-xs text-[#A5A2B4] leading-relaxed">
          {/* Purpose */}
          <div className="p-3.5 rounded-xl bg-[#171720] border border-[#292936]">
            <h4 className="text-xs font-semibold text-[#F4F2FA] mb-1">Architectural Purpose</h4>
            <p className="text-xs text-[#A5A2B4]">{template.purpose}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Required Inputs */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#F4F2FA] flex items-center gap-1.5">
                <Layers size={13} className="text-[#A78BFA]" />
                <span>Required Inputs</span>
              </div>
              <ul className="space-y-1.5 p-3 rounded-xl bg-[#09090D] border border-[#292936]">
                {template.requiredInputs.map((input, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#A5A2B4]">
                    <span className="text-[#A78BFA] font-mono">·</span>
                    <span>{input}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Outputs */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#F4F2FA] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#65D6A3]" />
                <span>Expected Outputs</span>
              </div>
              <ul className="space-y-1.5 p-3 rounded-xl bg-[#09090D] border border-[#292936]">
                {template.expectedOutputs.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#A5A2B4]">
                    <span className="text-[#65D6A3] font-mono">·</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Integrations & Permissions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#F4F2FA] flex items-center gap-1.5">
                <Wrench size={13} className="text-[#A78BFA]" />
                <span>Default Tools & Connectors</span>
              </div>
              <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936] space-y-1">
                {template.defaultTools.map((tool, idx) => (
                  <div key={idx} className="text-[11px] text-[#F4F2FA] font-mono">
                    ✓ {tool}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#F4F2FA] flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-[#F2C879]" />
                <span>Required Permissions</span>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-[#09090D] border border-[#292936] text-[11px] text-[#A5A2B4]">
                <div>• Read-Only: {template.permissions.readOnly ? 'Enforced' : 'Unrestricted'}</div>
                <div>• Network: {template.permissions.networkAccess}</div>
                <div>• Action Gating: {template.permissions.actionGating}</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#777487] p-2.5 rounded-lg bg-[#09090D] border border-[#292936] flex items-center justify-between">
            <span>Suggested cadence: {template.suggestedSchedule}</span>
            <span className="text-[#A78BFA]">Draft mode initially</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-[#292936] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#777487]">Opens a draft configuration flow</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight size={14} />}
              onClick={() => onUseTemplate(template)}
            >
              Use this template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
