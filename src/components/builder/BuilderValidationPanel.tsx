import React from 'react';
import { AgentValidationIssue } from '../../types/app';
import { AgentReadinessStage } from '../../services/agentValidationService';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export type BuilderSectionKey =
  | 'overview'
  | 'instructions'
  | 'model'
  | 'tools'
  | 'knowledge'
  | 'permissions'
  | 'testing';

interface BuilderValidationPanelProps {
  issues: AgentValidationIssue[];
  readinessStage: AgentReadinessStage;
  readinessLabel: string;
  onJumpToSection: (section: BuilderSectionKey) => void;
  onClose?: () => void;
  isCollapsible?: boolean;
}

export const BuilderValidationPanel: React.FC<BuilderValidationPanelProps> = ({
  issues,
  readinessStage,
  readinessLabel,
  onJumpToSection,
  onClose,
  isCollapsible = false,
}) => {
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  const sectionLabels: Record<BuilderSectionKey, string> = {
    overview: '01. Overview',
    instructions: '02. Instructions',
    model: '03. Model',
    tools: '04. Tools',
    knowledge: '05. Knowledge',
    permissions: '06. Permissions',
    testing: '07. Testing',
  };

  return (
    <div className="p-5 rounded-2xl bg-[#111118] border border-[#292936] space-y-5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#292936]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#A78BFA]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F2FA]">
            Configuration Audit
          </h3>
        </div>

        {isCollapsible && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[#777487] hover:text-[#F4F2FA] p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close audit panel"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Readiness Stage Indicator */}
      <div
        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
          readinessStage === 'invalid'
            ? 'bg-[#F07885]/10 border-[#F07885]/30 text-[#F07885]'
            : readinessStage === 'draft_valid'
            ? 'bg-[#F2C879]/10 border-[#F2C879]/30 text-[#F2C879]'
            : 'bg-[#65D6A3]/10 border-[#65D6A3]/30 text-[#65D6A3]'
        }`}
      >
        <div className="flex items-center gap-2 font-semibold">
          {readinessStage === 'invalid' ? (
            <AlertCircle size={15} />
          ) : readinessStage === 'draft_valid' ? (
            <AlertTriangle size={15} />
          ) : (
            <CheckCircle2 size={15} />
          )}
          <span>{readinessLabel}</span>
        </div>
        <span className="text-[10px] font-mono uppercase">
          {issues.length} {issues.length === 1 ? 'Notice' : 'Notices'}
        </span>
      </div>

      {/* Issues List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#F07885] block">
              Blocking Errors ({errors.length})
            </span>
            <div className="space-y-1.5">
              {errors.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => onJumpToSection(issue.section)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#09090D] border border-[#F07885]/30 hover:border-[#F07885] transition-all cursor-pointer group flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#F07885] block">
                      {sectionLabels[issue.section]}
                    </span>
                    <span className="text-xs text-[#F4F2FA] leading-tight block">
                      {issue.message}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-[#777487] group-hover:text-[#F07885] shrink-0 mt-1 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#F2C879] block">
              Warnings ({warnings.length})
            </span>
            <div className="space-y-1.5">
              {warnings.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => onJumpToSection(issue.section)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#09090D] border border-[#292936] hover:border-[#F2C879] transition-all cursor-pointer group flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#F2C879] block">
                      {sectionLabels[issue.section]}
                    </span>
                    <span className="text-xs text-[#A5A2B4] group-hover:text-[#F4F2FA] leading-tight block">
                      {issue.message}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-[#777487] group-hover:text-[#F2C879] shrink-0 mt-1 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        {infos.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#A78BFA] block">
              Recommendations ({infos.length})
            </span>
            <div className="space-y-1.5">
              {infos.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => onJumpToSection(issue.section)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#09090D] border border-[#292936] hover:border-[#A78BFA] transition-all cursor-pointer group flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#A78BFA] block">
                      {sectionLabels[issue.section]}
                    </span>
                    <span className="text-xs text-[#777487] group-hover:text-[#A5A2B4] leading-tight block">
                      {issue.message}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-[#777487] group-hover:text-[#A78BFA] shrink-0 mt-1 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {issues.length === 0 && (
          <div className="p-4 rounded-xl bg-[#09090D] border border-[#65D6A3]/20 text-center space-y-1 text-xs">
            <CheckCircle2 size={18} className="mx-auto text-[#65D6A3]" />
            <div className="font-semibold text-[#F4F2FA]">Zero Configuration Issues</div>
            <span className="text-[11px] text-[#777487] block">
              All required fields, tool dependencies, and safety gates are satisfied.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
