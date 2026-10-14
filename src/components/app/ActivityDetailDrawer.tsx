import React, { useEffect } from 'react';
import { ActivityRecord } from '../../types/app';
import { StatusBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import {
  X,
  Clock,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Bot,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface ActivityDetailDrawerProps {
  activity: ActivityRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
}

export const ActivityDetailDrawer: React.FC<ActivityDetailDrawerProps> = ({
  activity,
  isOpen,
  onClose,
  onApprove,
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

  if (!isOpen || !activity) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-[#111118] border-l border-[#292936] h-full flex flex-col p-6 sm:p-8 overflow-y-auto shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#292936]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#A78BFA] bg-[#171720] px-2 py-0.5 rounded border border-[#292936]">
              {activity.runId}
            </span>
            <StatusBadge status={activity.status} size="sm" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
            aria-label="Close run inspector"
          >
            <X size={16} />
          </button>
        </div>

        {/* Title and metadata */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-bold text-[#F4F2FA]">{activity.agentName}</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
              <span className="text-[#777487] block text-[11px]">Trigger:</span>
              <span className="text-[#F4F2FA] font-mono mt-0.5 block">{activity.triggerType}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
              <span className="text-[#777487] block text-[11px]">Start & Duration:</span>
              <span className="text-[#F4F2FA] font-mono mt-0.5 block">
                {new Date(activity.startTime).toLocaleTimeString()} ({activity.durationMs ? `${(activity.durationMs / 1000).toFixed(1)}s` : 'N/A'})
              </span>
            </div>
          </div>
        </div>

        {/* Output Summary */}
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-semibold text-[#F4F2FA] uppercase tracking-wider">
            Output Summary
          </h4>
          <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#A5A2B4] leading-relaxed">
            {activity.outputSummary}
          </div>
        </div>

        {/* If awaiting approval, prominent gate banner */}
        {activity.status === 'awaiting_approval' && onApprove && (
          <div className="p-4 rounded-xl bg-[#F2C879]/10 border border-[#F2C879]/30 space-y-3 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2C879]">
              <ShieldCheck size={16} />
              <span>Consequential Action Authorization Barrier</span>
            </div>
            <p className="text-xs text-[#A5A2B4] leading-relaxed">
              The agent has prepared the staged payload and halted. Authorize this action to allow external dispatch to configured team channels.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onApprove(activity.id);
                onClose();
              }}
            >
              Authorize & Dispatch Now
            </Button>
          </div>
        )}

        {/* Error Details */}
        {activity.status === 'failed' && activity.errorDetails && (
          <div className="p-4 rounded-xl bg-[#F07885]/10 border border-[#F07885]/30 space-y-1 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F07885]">
              <AlertTriangle size={15} />
              <span>Execution Error</span>
            </div>
            <p className="text-xs text-[#F07885] leading-relaxed">{activity.errorDetails}</p>
          </div>
        )}

        {/* Execution Step Timeline */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold text-[#F4F2FA] uppercase tracking-wider">
            Execution Steps ({activity.steps.length})
          </h4>
          <div className="space-y-2">
            {activity.steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-3 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#777487] text-[10px]">0{idx + 1}</span>
                  <span className="text-[#F4F2FA] font-medium">{step.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {step.durationMs && (
                    <span className="text-[10px] font-mono text-[#777487]">
                      {step.durationMs}ms
                    </span>
                  )}
                  <StatusBadge status={step.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal Execution Logs */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#F4F2FA] flex items-center gap-1.5 uppercase tracking-wider">
              <Terminal size={13} className="text-[#A78BFA]" />
              <span>Verifiable Trace Log</span>
            </h4>
            <span className="text-[10px] font-mono text-[#777487]">SHA256 Signed</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] font-mono text-[11px] text-[#A5A2B4] space-y-1 max-h-48 overflow-y-auto">
            {activity.logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
