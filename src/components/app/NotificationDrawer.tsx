import React, { useEffect } from 'react';
import { ActivityRecord } from '../../types/app';
import { StatusBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import {
  X,
  Bell,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityRecord[];
  onApprove: (id: string) => void;
  onOpenActivity: (act: ActivityRecord) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  activities,
  onApprove,
  onOpenActivity,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pendingApprovals = activities.filter((a) => a.status === 'awaiting_approval');
  const alertRecords = activities.filter((a) => a.status === 'failed');

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-[#111118] border-l border-[#292936] h-full flex flex-col p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#292936]">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#A78BFA]" />
            <h3 className="text-base font-bold text-[#F4F2FA]">Notifications & Alerts</h3>
            {pendingApprovals.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#F2C879] text-[#09090D] font-mono text-[10px] font-bold flex items-center justify-center">
                {pendingApprovals.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Pending Approval Section */}
          {pendingApprovals.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#F2C879] flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>Pending Human Approvals ({pendingApprovals.length})</span>
              </div>

              {pendingApprovals.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#171720] border border-[#F2C879]/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#F4F2FA]">{act.agentName}</span>
                    <span className="text-[10px] font-mono text-[#777487]">
                      {new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed line-clamp-2">
                    {act.outputSummary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#292936]">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenActivity(act);
                        onClose();
                      }}
                      className="text-xs text-[#A78BFA] hover:underline"
                    >
                      Inspect Diff
                    </button>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => onApprove(act.id)}
                    >
                      Authorize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Execution Alerts */}
          {alertRecords.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-[#F07885] flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle size={14} />
                <span>Execution Alerts ({alertRecords.length})</span>
              </div>

              {alertRecords.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#09090D] border border-[#F07885]/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#F4F2FA]">{act.agentName}</span>
                    <span className="text-[10px] font-mono text-[#F07885]">HTTP 429 Error</span>
                  </div>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed">
                    {act.errorDetails}
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenActivity(act);
                        onClose();
                      }}
                      className="text-xs text-[#A78BFA] hover:underline"
                    >
                      View trace log &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendingApprovals.length === 0 && alertRecords.length === 0 && (
            <div className="py-12 text-center text-xs text-[#777487] space-y-2">
              <CheckCircle2 size={24} className="mx-auto text-[#65D6A3]" />
              <p>No pending approvals or execution alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
