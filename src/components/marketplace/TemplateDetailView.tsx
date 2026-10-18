import React from 'react';
import { MarketplaceTemplate } from '../../data/templates';
import { Button } from '../../design-system/Button';
import { StatusBadge } from '../../design-system/StatusBadge';
import { appStateService } from '../../services/appStateService';
import {
  Code2,
  Compass,
  Server,
  BookOpen,
  Sparkles,
  Activity,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  Lock,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface TemplateDetailViewProps {
  template: MarketplaceTemplate;
  onBack: () => void;
  onUseTemplate: (template: MarketplaceTemplate) => void;
  onViewMyAgent?: (agentId: string) => void;
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

export const TemplateDetailView: React.FC<TemplateDetailViewProps> = ({
  template,
  onBack,
  onUseTemplate,
  onViewMyAgent,
}) => {
  const IconComponent = iconMap[template.iconName] || Sparkles;
  const userAgents = appStateService.getAgents();
  const existingUserAgent = userAgents.find((a) => a.sourceTemplateId === template.id);
  const integrations = appStateService.getIntegrations();

  const readinessLabels = {
    available: { label: 'Operational Now', color: 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20' },
    requires_configuration: { label: 'Requires User Setup', color: 'text-[#38D9FF] bg-[#38D9FF]/10 border-[#38D9FF]/20' },
    requires_integration: { label: 'Requires Connected App', color: 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/20' },
    planned: { label: 'Planned Roadmap', color: 'text-[#64748B] bg-[#111827] border-slate-800' },
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-150 text-left max-w-5xl mx-auto pb-12">
      {/* Top Navigation Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#9AA7BC] hover:text-[#F4F7FC] transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#64748B]">Version {template.version}</span>
          <span className="text-xs text-[#64748B]">·</span>
          <span className="text-[11px] text-[#38D9FF] font-medium">{template.setupComplexity} Setup</span>
        </div>
      </div>

      {/* Hero Header Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1220]/90 border border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm backdrop-blur-md">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#151D2E] border border-slate-700/60 text-[#38D9FF] flex items-center justify-center shrink-0 shadow-sm">
            <IconComponent size={28} />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#151D2E] text-[#64748B] px-2 py-0.5 rounded border border-slate-800">
                {template.categoryLabel}
              </span>
              {template.featured && (
                <span className="text-[10px] font-semibold text-[#38D9FF] bg-[#38D9FF]/15 px-2 py-0.5 rounded border border-[#38D9FF]/30">
                  Featured Blueprint
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F7FC] tracking-tight">
              {template.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#9AA7BC] max-w-2xl leading-relaxed">
              {template.summary}
            </p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800/60">
          {existingUserAgent && onViewMyAgent && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => onViewMyAgent(existingUserAgent.id)}
            >
              View in My Agents
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={15} />}
            onClick={() => onUseTemplate(template)}
          >
            {existingUserAgent ? 'Create another copy' : 'Use this template'}
          </Button>
        </div>
      </div>

      {/* Existing Agent Notice */}
      {existingUserAgent && (
        <div className="p-3.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/25 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#34D399]">
            <CheckCircle2 size={15} />
            <span>
              You already have a configured agent based on this template:{' '}
              <strong>{existingUserAgent.name}</strong> ({existingUserAgent.status}).
            </span>
          </div>
          {onViewMyAgent && (
            <button
              type="button"
              onClick={() => onViewMyAgent(existingUserAgent.id)}
              className="text-xs text-[#34D399] hover:underline font-medium cursor-pointer"
            >
              Open agent &rarr;
            </button>
          )}
        </div>
      )}

      {/* Grid: 1. Overview & Purpose + 2. Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Purpose and Scope */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-4 backdrop-blur-md">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <Layers size={14} className="text-[#38D9FF]" />
            <span>1. What does this agent do?</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA7BC] leading-relaxed">
            {template.detailedDescription}
          </p>

          <div className="pt-3 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-[#F4F7FC] mb-1">Intended Purpose:</div>
            <p className="text-xs text-[#64748B] leading-relaxed">{template.purpose}</p>
          </div>
        </div>

        {/* Suitable Use Cases */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-4 backdrop-blur-md">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#34D399]" />
            <span>2. What tasks is it suitable for?</span>
          </h2>

          <ul className="space-y-2.5">
            {template.relevantUseCases.map((useCase, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#9AA7BC]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0 mt-1.5" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Capabilities Matrix with Readiness Badges */}
      <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <Wrench size={14} className="text-[#38D9FF]" />
            <span>Structured Capabilities & Readiness</span>
          </h2>
          <span className="text-[11px] text-[#64748B]">Clear operational boundaries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {template.capabilities.map((cap) => {
            const readinessMeta = readinessLabels[cap.readiness];

            return (
              <div
                key={cap.name}
                className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-xs font-semibold text-[#F4F7FC]">{cap.name}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${readinessMeta.color}`}
                    >
                      {readinessMeta.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#9AA7BC] leading-relaxed">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inputs & Outputs (Contract) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Inputs */}
        <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-3 backdrop-blur-md">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <Terminal size={14} className="text-[#38D9FF]" />
            <span>3. What information does it need?</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            The agent operates bounded by these explicit inputs:
          </p>

          <ul className="space-y-2 pt-1">
            {template.requiredInputs.map((input, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-lg bg-[#111827] border border-slate-800 text-xs text-[#9AA7BC] flex items-center gap-2"
              >
                <span className="text-[#38D9FF] font-mono text-[11px]">0{idx + 1}</span>
                <span>{input}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expected Outputs */}
        <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-3 backdrop-blur-md">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} className="text-[#34D399]" />
            <span>4. What will it produce?</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Deterministic deliverables produced upon execution:
          </p>

          <ul className="space-y-2 pt-1">
            {template.expectedOutputs.map((output, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-lg bg-[#111827] border border-slate-800 text-xs text-[#9AA7BC] flex items-center gap-2"
              >
                <CheckCircle2 size={13} className="text-[#34D399] shrink-0" />
                <span>{output}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Illustrative Sample Input / Output Preview */}
      <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} className="text-[#38D9FF]" />
              <span>Input & Output Preview</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Sample interaction model illustrating input format and resulting output synthesis.
            </p>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#151D2E] border border-slate-800 text-[10px] font-mono text-[#FBBF24]">
            Illustrative Example · Execution Requires User Input
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* Sample Input */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#9AA7BC]">
              {template.sampleIO.sampleInputDescription}
            </span>
            <pre className="p-4 rounded-xl bg-[#080B16] border border-slate-800 text-[11px] font-mono text-[#38D9FF] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {template.sampleIO.sampleInput}
            </pre>
          </div>

          {/* Sample Output */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#9AA7BC]">
              {template.sampleIO.sampleOutputDescription}
            </span>
            <pre className="p-4 rounded-xl bg-[#080B16] border border-slate-800 text-[11px] font-mono text-[#F4F7FC] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {template.sampleIO.sampleOutput}
            </pre>
          </div>
        </div>
      </div>

      {/* Tools, Integrations & Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tools & Integrations Status */}
        <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-4 backdrop-blur-md">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <Wrench size={14} className="text-[#38D9FF]" />
            <span>5. Required Tools & Integrations</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-[11px] font-semibold text-[#64748B] mb-2 uppercase font-mono">
                Approved Tools
              </div>
              <div className="space-y-1.5">
                {template.requiredTools.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-slate-800"
                  >
                    <span className="text-[#F4F7FC]">{tool}</span>
                    <span className="text-[10px] text-[#34D399] font-mono">Whitelisted</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60">
              <div className="text-[11px] font-semibold text-[#64748B] mb-2 uppercase font-mono">
                External Integrations
              </div>
              {template.requiredIntegrations.length === 0 ? (
                <div className="p-2.5 rounded-lg bg-[#111827] border border-slate-800 text-[#34D399] text-xs">
                  ✓ Operates stand-alone without mandatory external OAuth
                </div>
              ) : (
                <div className="space-y-1.5">
                  {template.requiredIntegrations.map((intReq) => {
                    const matchedInt = integrations.find((i) =>
                      intReq.toLowerCase().includes(i.name.toLowerCase())
                    );
                    const isConnected = matchedInt?.status === 'connected';

                    return (
                      <div
                        key={intReq}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#111827] border border-slate-800"
                      >
                        <span className="text-[#F4F7FC]">{intReq}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isConnected
                              ? 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20'
                              : 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/20'
                          }`}
                        >
                          {isConnected ? 'Connected in Workspace' : 'Setup Required'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions & Limitations */}
        <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 space-y-4 backdrop-blur-md">
          <h2 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider flex items-center gap-2">
            <Lock size={14} className="text-[#FBBF24]" />
            <span>6 & 7. Permissions & Limitations</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-[#F4F7FC]">Least-Privilege Entitlements:</div>
              <div className="text-[11px] text-[#9AA7BC]">
                • <strong>Read-Only Mode:</strong> {template.permissions.readOnly ? 'Enforced' : 'Unrestricted'}
              </div>
              <div className="text-[11px] text-[#9AA7BC]">
                • <strong>Network Boundary:</strong> {template.permissions.networkAccess}
              </div>
              <div className="text-[11px] text-[#9AA7BC]">
                • <strong>Action Gating:</strong> {template.permissions.actionGating}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-[#FB7185] uppercase font-mono">
                Current Limitations
              </div>
              <ul className="space-y-1.5 p-3 rounded-xl bg-[#111827] border border-slate-800">
                {template.limitations.map((lim, idx) => (
                  <li key={idx} className="text-[11px] text-[#9AA7BC] flex items-start gap-1.5">
                    <span className="text-[#FB7185] font-mono">✕</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Actions */}
      <div className="p-6 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="text-xs text-[#64748B]">
          Ready to customize instructions, connect tools, and stage this agent draft?
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={onBack} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={15} />}
            onClick={() => onUseTemplate(template)}
            className="w-full sm:w-auto"
          >
            {existingUserAgent ? 'Create another copy' : 'Use this template'}
          </Button>
        </div>
      </div>
    </div>
  );
};
