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
          dotColor: 'bg-[#65D6A3]',
          textColor: 'text-[#65D6A3]',
          bgColor: 'bg-[#65D6A3]/10',
          borderColor: 'border-[#65D6A3]/20',
        };
      case 'paused':
        return {
          label: 'Paused',
          dotColor: 'bg-[#F2C879]',
          textColor: 'text-[#F2C879]',
          bgColor: 'bg-[#F2C879]/10',
          borderColor: 'border-[#F2C879]/20',
        };
      case 'draft':
        return {
          label: 'Draft',
          dotColor: 'bg-[#777487]',
          textColor: 'text-[#A5A2B4]',
          bgColor: 'bg-[#171720]',
          borderColor: 'border-[#292936]',
        };
      case 'needs_attention':
      case 'awaiting_approval':
        return {
          label: s === 'awaiting_approval' ? 'Awaiting Approval' : 'Needs Attention',
          dotColor: 'bg-[#F2C879]',
          textColor: 'text-[#F2C879]',
          bgColor: 'bg-[#F2C879]/10',
          borderColor: 'border-[#F2C879]/20',
        };
      case 'failed':
      case 'error':
        return {
          label: s === 'error' ? 'Error' : 'Failed',
          dotColor: 'bg-[#F07885]',
          textColor: 'text-[#F07885]',
          bgColor: 'bg-[#F07885]/10',
          borderColor: 'border-[#F07885]/20',
        };
      case 'running':
      case 'indexing':
        return {
          label: s === 'indexing' ? 'Indexing' : 'Running',
          dotColor: 'bg-[#A78BFA] animate-pulse',
          textColor: 'text-[#C4B5FD]',
          bgColor: 'bg-[#A78BFA]/10',
          borderColor: 'border-[#A78BFA]/20',
        };
      case 'coming_soon':
      case 'disconnected':
        return {
          label: s === 'coming_soon' ? 'Coming Soon' : 'Not Connected',
          dotColor: 'bg-[#777487]',
          textColor: 'text-[#777487]',
          bgColor: 'bg-[#171720]',
          borderColor: 'border-[#292936]',
        };
      default:
        return {
          label: String(s),
          dotColor: 'bg-[#777487]',
          textColor: 'text-[#A5A2B4]',
          bgColor: 'bg-[#171720]',
          borderColor: 'border-[#292936]',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md whitespace-nowrap select-none ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${config.bgColor} ${config.borderColor} ${config.textColor} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
