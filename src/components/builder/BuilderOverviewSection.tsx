import React, { useState } from 'react';
import { Agent, AgentCategory, AgentStatus } from '../../types/app';
import { Input } from '../../design-system/Input';
import { Textarea } from '../../design-system/Textarea';
import { Select } from '../../design-system/Select';
import { StatusBadge } from '../../design-system/StatusBadge';
import {
  Compass,
  Code2,
  BookOpen,
  Server,
  Sparkles,
  Terminal,
  FileText,
  Activity,
  Shield,
  Bot,
  Tag,
  Plus,
  X,
  Clock,
  Layers,
  Wrench,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface BuilderOverviewSectionProps {
  agent: Agent;
  onChange: (updates: Partial<Agent>) => void;
  lastSavedAt?: string;
  readinessLabel: string;
}

const AVAILABLE_ICONS = [
  { name: 'Compass', icon: Compass, label: 'Research' },
  { name: 'Code2', icon: Code2, label: 'Code' },
  { name: 'BookOpen', icon: BookOpen, label: 'Learning' },
  { name: 'Server', icon: Server, label: 'Operations' },
  { name: 'Bot', icon: Bot, label: 'Agent' },
  { name: 'Sparkles', icon: Sparkles, label: 'AI' },
  { name: 'Terminal', icon: Terminal, label: 'Terminal' },
  { name: 'FileText', icon: FileText, label: 'Documents' },
  { name: 'Activity', icon: Activity, label: 'Monitoring' },
  { name: 'Shield', icon: Shield, label: 'Security' },
];

const CATEGORIES: { value: AgentCategory; label: string; desc: string }[] = [
  { value: 'research', label: 'Research & Intelligence', desc: 'Competitor monitoring, changelog tracking, and market synthesis' },
  { value: 'development', label: 'Development & Engineering', desc: 'Codebase review, AST parsing, test coverage analysis' },
  { value: 'learning', label: 'Education & Tutoring', desc: 'Progressive concept coaching, concept maps, practice drills' },
  { value: 'operations', label: 'Operations & Reliability', desc: 'SLO monitoring, cloud compute audit, anomaly alerts' },
  { value: 'productivity', label: 'Productivity & Workflows', desc: 'Document summarization, task sequencing, agenda prep' },
  { value: 'marketing', label: 'Marketing & Content', desc: 'Brief writing, messaging consistency, positioning analysis' },
  { value: 'custom', label: 'Custom Specialist', desc: 'User-defined operational parameters and specialized tools' },
];

export const BuilderOverviewSection: React.FC<BuilderOverviewSectionProps> = ({
  agent,
  onChange,
  lastSavedAt,
  readinessLabel,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const tags = agent.tags || [];

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange({ tags: [...tags, trimmed] });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ tags: tags.filter((t) => t !== tagToRemove) });
  };

  const currentIconObj = AVAILABLE_ICONS.find((i) => i.name === agent.iconName) || AVAILABLE_ICONS[0];
  const IconComponent = currentIconObj.icon;

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
          Section 01 · Identity & Purpose
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
          Agent Identity & Positioning
        </h2>
        <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
          Define the agent’s name, public classification, core mission, and workspace visual avatar.
        </p>
      </div>

      {/* Main Identity Form */}
      <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] space-y-6">
        {/* Name and Icon Row */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Avatar Icon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block">Avatar Symbol</label>
            <div className="relative group">
              <div className="w-14 h-14 rounded-2xl bg-[#171720] border border-[#292936] flex items-center justify-center text-[#A78BFA] shadow-xs group-hover:border-[#A78BFA]/60 transition-colors">
                <IconComponent size={28} />
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="flex-1 w-full space-y-2">
            <Input
              label="Agent Name *"
              value={agent.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Competitor Intelligence Specialist"
              helperText={`${agent.name.length} / 80 characters`}
              error={!agent.name.trim() ? 'Agent name cannot be empty' : undefined}
            />
          </div>
        </div>

        {/* Icon Picker Chips */}
        <div className="space-y-2 pt-2 border-t border-[#292936]/60">
          <label className="text-xs font-medium text-[#777487] block">Select Avatar Symbol</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_ICONS.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = agent.iconName === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onChange({ iconName: item.name })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#A78BFA]/15 border-[#A78BFA] text-[#F4F2FA]'
                      : 'bg-[#09090D] border-[#292936] text-[#A5A2B4] hover:border-[#3D3D4E] hover:text-[#F4F2FA]'
                  }`}
                >
                  <ItemIcon size={14} className={isSelected ? 'text-[#A78BFA]' : 'text-[#777487]'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Textarea
            label="Short Tagline / Description"
            value={agent.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Briefly state what this agent monitors, analyzes, or accomplishes for your team..."
            rows={2}
            helperText={`${agent.description.length} / 320 characters. Shown in My Agents listings and workflow pipelines.`}
          />
        </div>

        {/* Category & Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block">Operational Category</label>
            <select
              value={agent.category}
              onChange={(e) => onChange({ category: e.target.value as AgentCategory })}
              className="w-full bg-[#09090D] border border-[#292936] rounded-xl px-3 py-2.5 text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#777487]">
              {CATEGORIES.find((c) => c.value === agent.category)?.desc}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block">Lifecycle Status</label>
            <select
              value={agent.status}
              onChange={(e) => onChange({ status: e.target.value as AgentStatus })}
              className="w-full bg-[#09090D] border border-[#292936] rounded-xl px-3 py-2.5 text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              <option value="draft">Draft · Under active configuration</option>
              <option value="active">Active · Available for manual or scheduled runs</option>
              <option value="paused">Paused · Inbound executions suspended</option>
              <option value="needs_attention">Needs Attention · Review configuration warnings</option>
            </select>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#777487]">Current badge:</span>
              <StatusBadge status={agent.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Intended Purpose (Deep Context) */}
        <div className="space-y-2">
          <Textarea
            label="Intended Business Purpose (Optional)"
            value={agent.intendedPurpose || ''}
            onChange={(e) => onChange({ intendedPurpose: e.target.value })}
            placeholder="e.g. Prepare competitive feature comparisons every Monday to accelerate product roadmap decisions..."
            rows={2}
            helperText="Provides high-level grounding for the agent's reasoning process and output calibration."
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#A5A2B4] block flex items-center gap-1.5">
            <Tag size={13} className="text-[#A78BFA]" />
            <span>Search & Organization Tags</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-[#09090D] border border-[#292936]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171720] border border-[#292936] text-xs text-[#F4F2FA]"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[#777487] hover:text-[#F07885] transition-colors cursor-pointer"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1 ml-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag + Enter..."
                className="bg-transparent text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none w-28"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="p-1 rounded text-[#A78BFA] hover:text-white transition-colors cursor-pointer"
                title="Add tag"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Status & Readiness Summary Card */}
      <div className="p-5 rounded-2xl bg-[#111118] border border-[#292936] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A5A2B4] flex items-center gap-2">
          <Layers size={13} className="text-[#A78BFA]" />
          <span>Configuration Snapshot</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
            <span className="text-[10px] uppercase font-mono text-[#777487] block">Readiness State</span>
            <span className="font-semibold text-[#65D6A3] block mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>{readinessLabel}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
            <span className="text-[10px] uppercase font-mono text-[#777487] block">Tools Whitelisted</span>
            <span className="font-semibold text-[#F4F2FA] block mt-1 flex items-center gap-1.5">
              <Wrench size={13} className="text-[#A78BFA]" />
              <span>{agent.tools.length} Approved Tool{agent.tools.length !== 1 ? 's' : ''}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
            <span className="text-[10px] uppercase font-mono text-[#777487] block">Last Saved</span>
            <span className="font-mono text-[#A5A2B4] block mt-1 flex items-center gap-1.5">
              <Clock size={13} className="text-[#777487]" />
              <span>{lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : 'Draft in memory'}</span>
            </span>
          </div>
        </div>

        {agent.sourceTemplateName && (
          <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936] text-[11px] text-[#A5A2B4] flex items-center justify-between">
            <span>Derived from starter template: <strong className="text-[#F4F2FA]">{agent.sourceTemplateName}</strong></span>
            <span className="font-mono text-[#A78BFA]">v{agent.sourceTemplateVersion || '1.0.0'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
