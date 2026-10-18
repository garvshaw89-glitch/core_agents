import React from 'react';
import { ActivityRecord } from '../types/app';
import { StatusBadge } from './StatusBadge';
import { Clock, Terminal, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface ActivityItemProps {
  activity: ActivityRecord;
  onOpenDetails: (activity: ActivityRecord) => void;
  onApprove?: (activityId: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onOpenDetails,
  onApprove,
}) => {
  const isAwaiting = activity.status === 'awaiting_approval';
  const isFailed = activity.status === 'failed';

  return (
    <div
      onClick={() => onOpenDetails(activity)}
      className="p-4 rounded-xl bg-[#0D1220] border border-slate-800/60 hover:border-[#38D9FF]/40 hover:bg-[#111827] transition-all duration-200 cursor-pointer text-left space-y-3 group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs text-[#38D9FF] bg-[#151D2E] px-2 py-0.5 rounded border border-slate-700/50">
            {activity.runId}
          </span>
          <span className="text-sm font-semibold text-[#F4F7FC] truncate">{activity.agentName}</span>
          <span className="text-xs text-[#64748B] hidden md:inline">· {activity.triggerType}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
            <Clock size={11} />
            <span>
              {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {activity.durationMs && (
              <span>({(activity.durationMs / 1000).toFixed(1)}s)</span>
            )}
          </div>
          <StatusBadge status={activity.status} size="sm" />
        </div>
      </div>

      <p className="text-xs text-[#9AA7BC] leading-relaxed line-clamp-2">
        {activity.outputSummary}
      </p>

      {isFailed && activity.errorDetails && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#FB7185]/10 border border-[#FB7185]/20 text-xs text-[#FB7185]">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>{activity.errorDetails}</span>
        </div>
      )}

      {isAwaiting && onApprove && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between p-3 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20"
        >
          <div className="flex items-center gap-2 text-xs text-[#FBBF24] font-medium">
            <ShieldCheck size={16} />
            <span>Human Approval Gate: Consequential external action pending</span>
          </div>
          <button
            type="button"
            onClick={() => onApprove(activity.id)}
            className="px-3 py-1 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-[#080B16] text-xs font-semibold transition-colors cursor-pointer"
          >
            Authorize & Execute
          </button>
        </div>
      )}
    </div>
  );
};
