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
      className="p-4 rounded-xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] hover:bg-[#14141E] transition-all duration-150 cursor-pointer text-left space-y-3 group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs text-[#A78BFA] bg-[#171720] px-2 py-0.5 rounded border border-[#292936]">
            {activity.runId}
          </span>
          <span className="text-sm font-semibold text-[#F4F2FA] truncate">{activity.agentName}</span>
          <span className="text-xs text-[#777487] hidden md:inline">· {activity.triggerType}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#777487] font-mono">
            <Clock size={12} />
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

      <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-2">
        {activity.outputSummary}
      </p>

      {isFailed && activity.errorDetails && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F07885]/10 border border-[#F07885]/20 text-xs text-[#F07885]">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>{activity.errorDetails}</span>
        </div>
      )}

      {isAwaiting && onApprove && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between p-3 rounded-xl bg-[#F2C879]/10 border border-[#F2C879]/20"
        >
          <div className="flex items-center gap-2 text-xs text-[#F2C879] font-medium">
            <ShieldCheck size={16} />
            <span>Human Approval Gate: Consequential external action pending</span>
          </div>
          <button
            type="button"
            onClick={() => onApprove(activity.id)}
            className="px-3 py-1 rounded-lg bg-[#F2C879] hover:bg-[#E2B768] text-[#09090D] text-xs font-semibold transition-colors cursor-pointer"
          >
            Authorize & Execute
          </button>
        </div>
      )}
    </div>
  );
};
