import React, { useState, useEffect } from 'react';
import {
  History,
  RotateCcw,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  ShieldCheck,
  Cpu,
  Wrench,
  Tag,
  User,
  Plus,
  X,
  FileText,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Agent, AgentVersion } from '../../types/app';
import { appStateService } from '../../services/appStateService';
import { Button } from '../../design-system/Button';
import { ConfirmationDialog } from '../../design-system/ConfirmationDialog';

interface AgentVersionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  onRevertSuccess: (revertedAgent: Agent) => void;
}

export const AgentVersionHistoryPanel: React.FC<AgentVersionHistoryPanelProps> = ({
  isOpen,
  onClose,
  agent,
  onRevertSuccess,
}) => {
  const [versions, setVersions] = useState<AgentVersion[]>([]);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [inspectVersion, setInspectVersion] = useState<AgentVersion | null>(null);
  const [versionToRevert, setVersionToRevert] = useState<AgentVersion | null>(null);
  const [isReverting, setIsReverting] = useState(false);
  const [isTaggingCheckpoint, setIsTaggingCheckpoint] = useState(false);
  const [checkpointLabel, setCheckpointLabel] = useState('');
  const [revertFeedback, setRevertFeedback] = useState<string | null>(null);

  // Load versions on open or agent change
  useEffect(() => {
    if (isOpen && agent.id) {
      const history = appStateService.getAgentVersions(agent.id);
      setVersions(history);
      if (history.length > 0 && !expandedVersionId) {
        setExpandedVersionId(history[0].id);
      }
    }
  }, [isOpen, agent.id]);

  if (!isOpen) return null;

  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpointLabel.trim()) return;

    const newVersion = appStateService.recordAgentVersion(
      agent,
      versions[0]?.snapshot || null,
      checkpointLabel.trim()
    );

    setVersions([newVersion, ...versions]);
    setCheckpointLabel('');
    setIsTaggingCheckpoint(false);
    setExpandedVersionId(newVersion.id);
    setRevertFeedback(`Checkpoint "${newVersion.label}" created successfully.`);
    setTimeout(() => setRevertFeedback(null), 4000);
  };

  const handleConfirmRevert = () => {
    if (!versionToRevert) return;
    setIsReverting(true);

    try {
      const restored = appStateService.revertAgentToVersion(agent.id, versionToRevert.id);
      if (restored) {
        const updatedHistory = appStateService.getAgentVersions(agent.id);
        setVersions(updatedHistory);
        onRevertSuccess(restored);
        setRevertFeedback(`Successfully reverted to v${versionToRevert.versionNumber}`);
        setTimeout(() => setRevertFeedback(null), 4000);
      }
    } finally {
      setIsReverting(false);
      setVersionToRevert(null);
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return {
        date: date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        relative: getRelativeTimeString(date),
      };
    } catch {
      return { date: 'Unknown', time: '', relative: '' };
    }
  };

  function getRelativeTimeString(date: Date): string {
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  }

  const activeVersionId = versions[0]?.id;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#0D0D13] border-l border-[#292936] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Agent Version History"
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-[#292936] flex items-center justify-between shrink-0 bg-[#111118]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#171720] border border-[#292936] flex items-center justify-center text-[#A78BFA]">
              <History size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#F4F2FA]">Version History</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#171720] border border-[#292936] text-[#A5A2B4]">
                  {versions.length} {versions.length === 1 ? 'snapshot' : 'snapshots'}
                </span>
              </div>
              <p className="text-xs text-[#777487] mt-0.5">
                Every save records an immutable configuration snapshot and diff
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors cursor-pointer"
            aria-label="Close version history"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Alert */}
        {revertFeedback && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-[#65D6A3]/10 border border-[#65D6A3]/30 text-xs text-[#65D6A3] flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <Check size={14} /> {revertFeedback}
            </span>
            <button
              type="button"
              onClick={() => setRevertFeedback(null)}
              className="text-[#65D6A3] hover:text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Action Header / Tag Checkpoint */}
        <div className="px-5 py-3 border-b border-[#292936] bg-[#09090D] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#A5A2B4] font-mono">
            Current Agent: <span className="text-[#F4F2FA] font-semibold">{agent.name}</span>
          </span>

          <button
            type="button"
            onClick={() => setIsTaggingCheckpoint(!isTaggingCheckpoint)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#171720] hover:bg-[#20202E] border border-[#292936] text-xs font-medium text-[#A78BFA] hover:text-[#C4B5FD] transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Tag Checkpoint</span>
          </button>
        </div>

        {/* Tag Checkpoint Form */}
        {isTaggingCheckpoint && (
          <form
            onSubmit={handleCreateCheckpoint}
            className="p-4 mx-5 my-3 rounded-xl bg-[#171720] border border-[#A78BFA]/40 space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#F4F2FA] flex items-center gap-1.5">
                <Tag size={13} className="text-[#A78BFA]" /> Create Named Milestone Checkpoint
              </span>
              <button
                type="button"
                onClick={() => setIsTaggingCheckpoint(false)}
                className="text-[#777487] hover:text-[#F4F2FA]"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              value={checkpointLabel}
              onChange={(e) => setCheckpointLabel(e.target.value)}
              placeholder="e.g. Release candidate v1.2, Pre-refactor backup..."
              className="w-full px-3 py-2 rounded-lg bg-[#0D0D13] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-hidden focus:border-[#A78BFA]"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsTaggingCheckpoint(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!checkpointLabel.trim()}
              >
                Save Milestone
              </Button>
            </div>
          </form>
        )}

        {/* Version List Timeline */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {versions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#111118] border border-[#292936]">
              <History size={32} className="mx-auto text-[#777487] mb-2 opacity-50" />
              <p className="text-sm font-medium text-[#F4F2FA]">No versions recorded yet</p>
              <p className="text-xs text-[#777487] mt-1">
                Saving changes in the builder will automatically generate version snapshots.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#292936]">
              {versions.map((ver, idx) => {
                const ts = formatTimestamp(ver.timestamp);
                const isCurrent = ver.id === activeVersionId;
                const isExpanded = expandedVersionId === ver.id;

                return (
                  <div key={ver.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCurrent
                          ? 'bg-[#A78BFA] border-[#A78BFA] text-[#09090D]'
                          : 'bg-[#111118] border-[#3D3D4E] group-hover:border-[#A78BFA]'
                      }`}
                    >
                      {isCurrent ? (
                        <Check size={10} strokeWidth={3} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#777487]" />
                      )}
                    </div>

                    {/* Version Card */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-[#14141E] border-[#A78BFA]/50 shadow-sm'
                          : 'bg-[#111118] border-[#292936] hover:border-[#3D3D4E]'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-md border border-[#A78BFA]/20">
                              v{ver.versionNumber}
                            </span>
                            <h3 className="text-xs font-semibold text-[#F4F2FA] truncate">
                              {ver.label || `Version ${ver.versionNumber}`}
                            </h3>
                            {isCurrent && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#65D6A3]/10 border border-[#65D6A3]/30 text-[#65D6A3]">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#777487] mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 font-mono text-[#A5A2B4]">
                              <Clock size={11} />
                              <span title={`${ts.date} ${ts.time}`}>{ts.relative}</span>
                            </span>
                            <span>•</span>
                            <span className="font-mono">{ts.date} {ts.time}</span>
                            {ver.author && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <User size={10} /> {ver.author}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectVersion(ver)}
                            className="p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors cursor-pointer"
                            title="Inspect full snapshot and parameters"
                          >
                            <Eye size={14} />
                          </button>

                          {!isCurrent ? (
                            <button
                              type="button"
                              onClick={() => setVersionToRevert(ver)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171720] hover:bg-[#A78BFA] text-[#A78BFA] hover:text-[#09090D] border border-[#292936] hover:border-[#A78BFA] text-[11px] font-semibold transition-all cursor-pointer"
                              title={`Revert agent to version ${ver.versionNumber}`}
                            >
                              <RotateCcw size={11} />
                              <span>Revert</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-[#777487] px-2 py-1">
                              Current
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedVersionId(isExpanded ? null : ver.id)
                            }
                            className="p-1 rounded-lg text-[#777487] hover:text-[#F4F2FA] transition-colors"
                            aria-label={isExpanded ? 'Collapse changes' : 'Expand changes'}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Snapshot Metadata Badges */}
                      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#292936]/60 flex-wrap text-[11px] font-mono text-[#A5A2B4]">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#09090D] border border-[#292936]">
                          <Cpu size={11} className="text-[#A78BFA]" />
                          <span>{ver.snapshot.modelConfig?.modelId || 'gemini-2.5-pro'}</span>
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#09090D] border border-[#292936]">
                          <Wrench size={11} className="text-[#A78BFA]" />
                          <span>{ver.snapshot.tools.length} tools</span>
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#09090D] border border-[#292936]">
                          <ShieldCheck size={11} className="text-[#65D6A3]" />
                          <span>{ver.snapshot.humanApprovalRequired ? 'Approval Gate' : 'Autonomous'}</span>
                        </span>
                      </div>

                      {/* Expanded Change Log */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[#292936] space-y-1.5 animate-in fade-in">
                          <span className="text-[10px] font-mono text-[#777487] uppercase tracking-wider block">
                            Snapshot Change Log:
                          </span>
                          {ver.changesSummary && ver.changesSummary.length > 0 ? (
                            <ul className="space-y-1">
                              {ver.changesSummary.map((change, cIdx) => (
                                <li
                                  key={cIdx}
                                  className="text-xs text-[#A5A2B4] flex items-start gap-2"
                                >
                                  <span className="text-[#A78BFA] mt-0.5">•</span>
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-[#777487] italic">
                              Initial configuration point.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-[#292936] bg-[#09090D] flex items-center justify-between shrink-0 text-xs text-[#777487]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#65D6A3]" /> Non-destructive: Reverting creates a recovery point
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Snapshot Inspector Modal */}
      {inspectVersion && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setInspectVersion(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0D0D13] border border-[#292936] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Snapshot details for v${inspectVersion.versionNumber}`}
          >
            <div className="p-4 border-b border-[#292936] flex items-center justify-between bg-[#111118]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded border border-[#A78BFA]/20">
                  v{inspectVersion.versionNumber}
                </span>
                <h3 className="text-sm font-semibold text-[#F4F2FA]">
                  {inspectVersion.label || `Version ${inspectVersion.versionNumber} Snapshot`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectVersion(null)}
                className="text-[#777487] hover:text-[#F4F2FA] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#111118] border border-[#292936]">
                  <span className="text-[10px] text-[#777487] uppercase font-mono block">Model & Hyperparameters</span>
                  <p className="font-semibold text-[#F4F2FA] mt-1 font-mono">
                    {inspectVersion.snapshot.modelConfig?.modelId || 'gemini-2.5-pro'}
                  </p>
                  <p className="text-[#A5A2B4] font-mono text-[11px] mt-0.5">
                    Temp: {inspectVersion.snapshot.modelConfig?.temperature ?? 0.7} • Max Tokens: {inspectVersion.snapshot.modelConfig?.maxOutputTokens ?? 4096}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#111118] border border-[#292936]">
                  <span className="text-[10px] text-[#777487] uppercase font-mono block">Governance & Execution</span>
                  <p className="font-semibold text-[#65D6A3] mt-1 flex items-center gap-1.5">
                    <ShieldCheck size={13} />
                    {inspectVersion.snapshot.humanApprovalRequired ? 'Human Review Gate' : 'Autonomous Execution'}
                  </p>
                  <p className="text-[#A5A2B4] font-mono text-[11px] mt-0.5">
                    Trigger: {inspectVersion.snapshot.triggerType}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-[#A5A2B4] block mb-1.5">
                  Attached Tools ({inspectVersion.snapshot.tools.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectVersion.snapshot.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#171720] border border-[#292936] text-[11px] font-mono text-[#F4F2FA]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-[#A5A2B4] block mb-1.5 flex items-center gap-1">
                  <FileText size={13} className="text-[#A78BFA]" />
                  System Instructions Snapshot ({inspectVersion.snapshot.instructions?.length || 0} characters):
                </span>
                <pre className="p-3 rounded-xl bg-[#09090D] border border-[#292936] text-xs font-mono text-[#F4F2FA] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {inspectVersion.snapshot.instructions || '(No instructions configured)'}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-[#292936] bg-[#111118] flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setInspectVersion(null)}>
                Dismiss
              </Button>
              {inspectVersion.id !== activeVersionId && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<RotateCcw size={13} />}
                  onClick={() => {
                    setInspectVersion(null);
                    setVersionToRevert(inspectVersion);
                  }}
                >
                  Revert to this Version
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Reverting */}
      <ConfirmationDialog
        isOpen={versionToRevert !== null}
        onClose={() => setVersionToRevert(null)}
        onConfirm={handleConfirmRevert}
        title={`Revert to Version ${versionToRevert?.versionNumber}?`}
        message={`Are you sure you want to revert "${agent.name}" to the configuration saved on ${
          versionToRevert ? formatTimestamp(versionToRevert.timestamp).date : ''
        } at ${
          versionToRevert ? formatTimestamp(versionToRevert.timestamp).time : ''
        }? Current unsaved edits will be replaced, and a recovery checkpoint of your current state will automatically be saved.`}
        confirmLabel={isReverting ? 'Reverting...' : `Revert to v${versionToRevert?.versionNumber}`}
        variant="warning"
      />
    </div>
  );
};
