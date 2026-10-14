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
} from 'lucide-react';

export interface AgentCardProps {
  agent: Agent;
  onOpen: (agent: Agent) => void;
  onTogglePause: (agent: Agent) => void;
  onDuplicate: (agent: Agent) => void;
  onArchive: (agent: Agent) => void;
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
  onTogglePause,
  onDuplicate,
  onArchive,
  layout = 'grid',
}) => {
  const IconComponent = iconMap[agent.iconName] || Compass;

  const menuItems = [
    {
      id: 'open',
      label: 'Open Details',
      icon: <ExternalLink size={13} />,
      onClick: () => onOpen(agent),
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
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141E] transition-all duration-150 cursor-pointer gap-4 group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#F4F2FA] truncate">{agent.name}</h3>
              <StatusBadge status={agent.status} size="sm" />
            </div>
            <p className="text-xs text-[#A5A2B4] truncate max-w-xl mt-0.5">{agent.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#292936]/60">
          <div className="flex items-center gap-3 text-xs text-[#777487]">
            {agent.lastRunAt && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>Last run: {new Date(agent.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            )}
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] text-[#A5A2B4]">
              <Wrench size={12} className="text-[#A78BFA]" />
              <span>{agent.tools.length} tools</span>
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
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
      className="flex flex-col justify-between p-5 rounded-2xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141E] transition-all duration-150 cursor-pointer group text-left"
    >
      <div>
        {/* Top bar with icon and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={20} />
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
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
        <h3 className="text-sm font-semibold text-[#F4F2FA] mb-1.5 group-hover:text-white transition-colors">
          {agent.name}
        </h3>
        <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-2 mb-4">
          {agent.description}
        </p>
      </div>

      {/* Footer metadata */}
      <div className="pt-3 border-t border-[#292936]/80 flex items-center justify-between text-xs text-[#777487]">
        <div className="flex items-center gap-1">
          <Wrench size={12} className="text-[#A78BFA]" />
          <span>{agent.tools.length} approved tools</span>
        </div>

        {agent.lastRunAt ? (
          <span className="text-[11px] font-mono">
            {new Date(agent.lastRunAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        ) : (
          <span className="text-[11px] text-[#777487]">Never run</span>
        )}
      </div>
    </div>
  );
};
