import React from 'react';
import { AgentStatus, WorkflowStatus, ActivityStatus, KnowledgeStatus, IntegrationStatus } from '../types/app';

export type AnyStatus = AgentStatus | WorkflowStatus | ActivityStatus | KnowledgeStatus | IntegrationStatus | 'pending';

interface StatusBadgeProps {
  status: AnyStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const getStatusConfig = (s: AnyStatus) => {
    switch (s) {
      case 'active':
      case 'ready':
      case 'connected':
      case 'completed':
        return {
          label: s === 'ready' ? 'Ready' : s === 'connected' ? 'Connected' : s === 'completed' ? 'Completed' : 'Active',
          dotColor: 'bg-[#34D399]',
          textColor: 'text-[#34D399]',
          glow: 'shadow-[0_0_8px_rgba(52,211,153,0.35)]',
        };
      case 'paused':
        return {
          label: 'Paused',
          dotColor: 'bg-[#FBBF24]',
          textColor: 'text-[#FBBF24]',
          glow: '',
        };
      case 'draft':
        return {
          label: 'Draft',
          dotColor: 'bg-[#64748B]',
          textColor: 'text-[#9AA7BC]',
          glow: '',
        };
      case 'needs_attention':
      case 'awaiting_approval':
        return {
          label: s === 'awaiting_approval' ? 'Awaiting Approval' : 'Needs Attention',
          dotColor: 'bg-[#FBBF24]',
          textColor: 'text-[#FBBF24]',
          glow: 'shadow-[0_0_8px_rgba(251,191,36,0.35)]',
        };
      case 'failed':
      case 'error':
        return {
          label: s === 'error' ? 'Error' : 'Failed',
          dotColor: 'bg-[#FB7185]',
          textColor: 'text-[#FB7185]',
          glow: 'shadow-[0_0_8px_rgba(251,113,133,0.35)]',
        };
      case 'running':
      case 'indexing':
        return {
          label: s === 'indexing' ? 'Indexing' : 'Running',
          dotColor: 'bg-[#38D9FF] animate-pulse',
          textColor: 'text-[#38D9FF]',
          glow: 'shadow-[0_0_10px_rgba(56,217,255,0.45)]',
        };
      case 'coming_soon':
      case 'disconnected':
        return {
          label: s === 'coming_soon' ? 'Coming Soon' : 'Not Connected',
          dotColor: 'bg-[#64748B]',
          textColor: 'text-[#64748B]',
          glow: '',
        };
      default:
        return {
          label: String(s),
          dotColor: 'bg-[#64748B]',
          textColor: 'text-[#9AA7BC]',
          glow: '',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium whitespace-nowrap select-none ${
        size === 'sm' ? 'text-[11px]' : 'text-xs'
      } ${config.textColor} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor} ${config.glow}`}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
};
