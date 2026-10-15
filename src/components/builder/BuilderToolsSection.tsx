import React, { useState } from 'react';
import { Agent } from '../../types/app';
import { CORE_TOOL_REGISTRY, ToolDefinition, ToolCategory } from '../../data/tools';
import { appStateService } from '../../services/appStateService';
import { Button } from '../../design-system/Button';
import {
  Wrench,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Check,
  ExternalLink,
  Layers,
  Search,
  Filter,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface BuilderToolsSectionProps {
  agent: Agent;
  onChange: (updates: Partial<Agent>) => void;
  onNavigateToIntegrations?: () => void;
}

export const BuilderToolsSection: React.FC<BuilderToolsSectionProps> = ({
  agent,
  onChange,
  onNavigateToIntegrations,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const integrations = appStateService.getIntegrations();

  const enabledToolNames = agent.tools || [];

  const handleToggleTool = (toolName: string) => {
    const isCurrentlyEnabled = enabledToolNames.includes(toolName);
    let updated: string[];

    if (isCurrentlyEnabled) {
      updated = enabledToolNames.filter((t) => t !== toolName);
    } else {
      updated = [...enabledToolNames, toolName];
    }

    onChange({ tools: updated });
  };

  const handleEnableAllSafe = () => {
    const safeToolNames = CORE_TOOL_REGISTRY.filter((t) => t.accessScope === 'read_only').map(
      (t) => t.name
    );
    // Combine existing with safe
    const combined = Array.from(new Set([...enabledToolNames, ...safeToolNames]));
    onChange({ tools: combined });
  };

  const handleClearAll = () => {
    onChange({ tools: [] });
  };

  const filteredTools = CORE_TOOL_REGISTRY.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'research', label: 'Research' },
    { id: 'development', label: 'Code & Git' },
    { id: 'learning', label: 'Learning' },
    { id: 'operations', label: 'Operations' },
    { id: 'communication', label: 'Communication' },
  ];

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
            Section 04 · Approved Tool Capabilities
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
            Tool Whitelist & Egress Boundaries
          </h2>
          <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
            Whitelist approved data fetchers and connectors. Tools marked with consequential risk require human authorization before execution.
          </p>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Disable All
          </Button>
          <Button variant="outline" size="sm" onClick={handleEnableAllSafe}>
            Enable Safe Tools
          </Button>
        </div>
      </div>

      {/* Controls Bar: Search & Category Chips */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777487]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by capability or description..."
              className="w-full pl-9 pr-3 py-2 bg-[#111118] border border-[#292936] rounded-xl text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#171720] text-[#F4F2FA] border border-[#292936]'
                    : 'text-[#777487] hover:text-[#A5A2B4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enabled Counter Banner */}
        <div className="p-3 rounded-xl bg-[#111118] border border-[#292936] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#A5A2B4]">
            <Wrench size={13} className="text-[#A78BFA]" />
            <span>
              Enabled: <strong className="text-[#F4F2FA] font-mono">{enabledToolNames.length}</strong> of{' '}
              {CORE_TOOL_REGISTRY.length} registered tools
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#65D6A3]">
            Least-Privilege Mode Active
          </span>
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => {
          const isEnabled = enabledToolNames.includes(tool.name);

          // Check integration status if required
          let integrationStatus: 'connected' | 'disconnected' | 'not_required' = 'not_required';
          if (tool.requiredIntegrationId) {
            const intObj = integrations.find((i) => i.id === tool.requiredIntegrationId);
            integrationStatus = intObj?.status === 'connected' ? 'connected' : 'disconnected';
          }

          const isConsequential = tool.accessScope === 'external_state_change';

          return (
            <div
              key={tool.id}
              onClick={() => handleToggleTool(tool.name)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between text-left ${
                isEnabled
                  ? 'bg-[#171720] border-[#A78BFA] shadow-md shadow-[#A78BFA]/5'
                  : 'bg-[#111118] border-[#292936] hover:border-[#3D3D4E]'
              }`}
            >
              {/* Card Top */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-[#F4F2FA] flex items-center gap-2">
                      <span>{tool.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#777487] uppercase">
                      {tool.categoryLabel}
                    </span>
                  </div>

                  {/* Toggle Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                      isEnabled
                        ? 'bg-[#A78BFA] border-[#A78BFA] text-[#09090D]'
                        : 'border-[#292936] bg-[#09090D]'
                    }`}
                  >
                    {isEnabled && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* Capabilities & Badges */}
              <div className="space-y-3 pt-3 mt-3 border-t border-[#292936]/60">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  {/* Access Scope Badge */}
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      tool.accessScope === 'read_only'
                        ? 'bg-[#65D6A3]/10 text-[#65D6A3] border-[#65D6A3]/20'
                        : tool.accessScope === 'sandboxed_execution'
                        ? 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/20'
                        : 'bg-[#F2C879]/10 text-[#F2C879] border-[#F2C879]/20'
                    }`}
                  >
                    {tool.accessScope === 'read_only'
                      ? 'Read-Only'
                      : tool.accessScope === 'sandboxed_execution'
                      ? 'Sandboxed Container'
                      : 'External State Change'}
                  </span>

                  {/* Consequential / Review Required */}
                  {tool.requiresHumanApproval && (
                    <span className="px-2 py-0.5 rounded bg-[#F07885]/10 text-[#F07885] border border-[#F07885]/20 flex items-center gap-1">
                      <ShieldAlert size={10} />
                      <span>Review Required</span>
                    </span>
                  )}
                </div>

                {/* Integration Dependency Status */}
                {tool.requiredIntegrationId && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#777487]">
                      Requires {tool.requiredIntegrationName}:
                    </span>
                    {integrationStatus === 'connected' ? (
                      <span className="text-[#65D6A3] font-mono flex items-center gap-1">
                        <Check size={11} /> Connected
                      </span>
                    ) : (
                      <span className="text-[#F2C879] font-mono flex items-center gap-1">
                        <AlertTriangle size={11} /> Setup Needed
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Direct Link Callout */}
      <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#A5A2B4] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-[#A78BFA] shrink-0" />
          <span>
            Need to authenticate GitHub, Slack, or webhook credentials?
          </span>
        </div>
        {onNavigateToIntegrations && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToIntegrations}
            rightIcon={<ExternalLink size={12} />}
          >
            Manage Integrations
          </Button>
        )}
      </div>
    </div>
  );
};
