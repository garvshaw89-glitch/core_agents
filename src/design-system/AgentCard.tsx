import React from 'react';
import { Agent } from '../types/app';
import { StatusBadge } from './StatusBadge';
import { DropdownMenu } from './DropdownMenu';
import { IconButton } from './IconButton';
import {
  Compass,
  Code2,
  BookOpen,
  Server,
  MoreVertical,
  Play,
  Pause,
  Copy,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Clock,
  Sparkles,
  Sliders,
} from 'lucide-react';

export interface AgentCardProps {
  agent: Agent;
  onOpen: (agent: Agent) => void;
  onEditInBuilder?: (agent: Agent) => void;
  onTogglePause: (agent: Agent) => void;
  onDuplicate: (agent: Agent) => void;
  onArchive: (agent: Agent) => void;
  onViewTemplate?: (templateId: string) => void;
  layout?: 'grid' | 'list';
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Code2,
  BookOpen,
  Server,
  Sparkles,
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onOpen,
  onEditInBuilder,
  onTogglePause,
  onDuplicate,
  onArchive,
  onViewTemplate,
  layout = 'grid',
}) => {
  const IconComponent = iconMap[agent.iconName] || Compass;

  const menuItems = [
    {
      id: 'open',
      label: 'Quick Inspector',
      icon: <ExternalLink size={13} />,
      onClick: () => onOpen(agent),
    },
    {
      id: 'edit_builder',
      label: 'Open in Builder',
      icon: <Sliders size={13} />,
      onClick: () => (onEditInBuilder ? onEditInBuilder(agent) : onOpen(agent)),
    },
    {
      id: 'toggle',
      label: agent.status === 'paused' ? 'Resume Agent' : 'Pause Agent',
      icon: agent.status === 'paused' ? <Play size={13} /> : <Pause size={13} />,
      onClick: () => onTogglePause(agent),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy size={13} />,
      onClick: () => onDuplicate(agent),
    },
    ...(agent.sourceTemplateId && onViewTemplate
      ? [
          {
            id: 'view_template',
            label: 'View Source Blueprint',
            icon: <BookOpen size={13} />,
            onClick: () => onViewTemplate(agent.sourceTemplateId!),
          },
        ]
      : []),
    'divider' as const,
    {
      id: 'archive',
      label: 'Archive Agent',
      icon: <Trash2 size={13} />,
      destructive: true,
      onClick: () => onArchive(agent),
    },
  ];

  if (layout === 'list') {
    return (
      <div
        onClick={() => onOpen(agent)}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0D1220] border border-slate-800/60 hover:border-[#38D9FF]/40 hover:bg-[#111827] transition-all duration-200 cursor-pointer gap-4 group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#151D2E] border border-slate-700/40 text-[#38D9FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-semibold text-[#F4F7FC] truncate">{agent.name}</h3>
              <StatusBadge status={agent.status} size="sm" />
            </div>
            <p className="text-xs text-[#9AA7BC] truncate max-w-xl mt-0.5">{agent.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono">
            {agent.lastRunAt && (
              <span className="flex items-center gap-1 text-[#9AA7BC]">
                <Clock size={11} />
                <span>{new Date(agent.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            )}
            {agent.lastRunAt && <span aria-hidden="true">·</span>}
            <span className="hidden md:inline-flex items-center gap-1 text-[#9AA7BC]">
              <Wrench size={11} className="text-[#38D9FF]" />
              <span>{agent.tools.length} tools</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {onEditInBuilder && (
              <button
                type="button"
                onClick={() => onEditInBuilder(agent)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151D2E] border border-slate-700/40 text-[11px] font-medium text-[#9AA7BC] hover:text-[#F4F7FC] hover:border-[#38D9FF]/50 transition-colors cursor-pointer"
                title="Open in Builder"
              >
                <Sliders size={12} className="text-[#38D9FF]" />
                <span>Configure</span>
              </button>
            )}
            <DropdownMenu
              align="right"
              trigger={
                <IconButton
                  icon={<MoreVertical size={15} />}
                  aria-label="Agent options"
                  variant="ghost"
                  size="sm"
                />
              }
              items={menuItems}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(agent)}
      className="flex flex-col justify-between p-5 rounded-2xl bg-[#0D1220] border border-slate-800/60 hover:border-[#38D9FF]/40 hover:bg-[#111827] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group text-left"
    >
      <div>
        {/* Top bar with icon and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#151D2E] border border-slate-700/40 text-[#38D9FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={20} />
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {onEditInBuilder && (
              <button
                type="button"
                onClick={() => onEditInBuilder(agent)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#151D2E] border border-slate-700/40 text-[11px] text-[#9AA7BC] hover:text-[#F4F7FC] hover:border-[#38D9FF]/50 transition-all cursor-pointer"
                title="Configure Agent in Builder"
              >
                <Sliders size={11} className="text-[#38D9FF]" />
                <span className="hidden xl:inline">Configure</span>
              </button>
            )}
            <StatusBadge status={agent.status} size="sm" />
            <DropdownMenu
              align="right"
              trigger={
                <IconButton
                  icon={<MoreVertical size={15} />}
                  aria-label="Agent options"
                  variant="ghost"
                  size="sm"
                />
              }
              items={menuItems}
            />
          </div>
        </div>

        {/* Title and description */}
        <h3 className="text-sm font-semibold text-[#F4F7FC] mb-1 group-hover:text-[#38D9FF] transition-colors">
          {agent.name}
        </h3>
        {agent.sourceTemplateName && (
          <div className="text-[10px] text-[#8B5CF6] font-mono mb-2 flex items-center gap-1">
            <BookOpen size={10} />
            <span>Blueprint: {agent.sourceTemplateName}</span>
          </div>
        )}
        <p className="text-xs text-[#9AA7BC] leading-relaxed line-clamp-2 mb-4">
          {agent.description}
        </p>
      </div>

      {/* Footer metadata */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#9AA7BC]">
          <Wrench size={11} className="text-[#38D9FF]" />
          <span>{agent.tools.length} approved tools</span>
        </div>

        {agent.lastRunAt ? (
          <span className="text-[11px] font-mono text-[#9AA7BC]">
            {new Date(agent.lastRunAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-[#64748B]">Never run</span>
        )}
      </div>
    </div>
  );
};
