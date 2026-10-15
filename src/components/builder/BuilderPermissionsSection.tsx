import React from 'react';
import { Agent, AgentPermissionsPolicy } from '../../types/app';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  UserCheck,
  Zap,
  Clock,
  RotateCcw,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface BuilderPermissionsSectionProps {
  agent: Agent;
  onChange: (updates: Partial<Agent>) => void;
}

export const BuilderPermissionsSection: React.FC<BuilderPermissionsSectionProps> = ({
  agent,
  onChange,
}) => {
  const currentPolicy: AgentPermissionsPolicy = agent.permissionsPolicy || {
    operatingMode: agent.operatingMode || 'approval_required',
    readOnly: true,
    networkAccess: 'restricted',
    allowExternalDispatch: false,
    requireApprovalForConsequential: agent.humanApprovalRequired !== false,
    maxExecutionTimeoutSecs: 60,
    maxToolCallsPerRun: 10,
  };

  const handleUpdatePolicy = (updates: Partial<AgentPermissionsPolicy>) => {
    const updatedPolicy = { ...currentPolicy, ...updates };

    onChange({
      permissionsPolicy: updatedPolicy,
      operatingMode: updatedPolicy.operatingMode,
      humanApprovalRequired: updatedPolicy.requireApprovalForConsequential,
    });
  };

  const operatingModes = [
    {
      id: 'approval_required' as const,
      title: 'Human-in-the-Loop Barrier (Recommended)',
      tag: 'Protected Standard',
      description: 'The agent executes read-only steps autonomously, but consequential operations (external messages, PR updates) pause and require an operator signature.',
      badgeColor: 'text-[#65D6A3] bg-[#65D6A3]/10 border-[#65D6A3]/20',
      icon: ShieldCheck,
    },
    {
      id: 'manual' as const,
      title: 'Manual Operator Trigger Only',
      tag: 'Supervised',
      description: 'The agent never runs on schedules or inbound webhooks. Every execution must be manually initiated by a human user from the workspace.',
      badgeColor: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20',
      icon: UserCheck,
    },
    {
      id: 'automated' as const,
      title: 'Autonomous Sandboxed Execution',
      tag: 'Advanced Ceilings',
      description: 'Runs scheduled workflows without manual staging. Constrained strictly to read-only tools and isolated compute containers.',
      badgeColor: 'text-[#F2C879] bg-[#F2C879]/10 border-[#F2C879]/20',
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
          Section 06 · Security, Boundaries & Governance
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
          Execution Policy & Approval Gates
        </h2>
        <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
          Enforce cryptographic boundaries, human approval checkpoints for consequential actions, and runtime limits.
        </p>
      </div>

      {/* Operating Mode Selector */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-[#A5A2B4] block uppercase tracking-wider font-mono">
          Operational Mode
        </label>

        <div className="space-y-3">
          {operatingModes.map((mode) => {
            const isSelected = currentPolicy.operatingMode === mode.id;
            const ModeIcon = mode.icon;

            return (
              <div
                key={mode.id}
                onClick={() => handleUpdatePolicy({ operatingMode: mode.id })}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex items-start gap-4 ${
                  isSelected
                    ? 'bg-[#171720] border-[#A78BFA] shadow-md shadow-[#A78BFA]/5'
                    : 'bg-[#111118] border-[#292936] hover:border-[#3D3D4E]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#A78BFA]/20 text-[#A78BFA]' : 'bg-[#09090D] text-[#777487]'
                  }`}
                >
                  <ModeIcon size={18} />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="text-sm font-bold text-[#F4F2FA] flex items-center gap-2">
                      <span>{mode.title}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start ${mode.badgeColor}`}
                    >
                      {mode.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#A5A2B4] leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Boundary Policies */}
      <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] space-y-6">
        <h3 className="text-sm font-bold text-[#F4F2FA] flex items-center gap-2">
          <Lock size={15} className="text-[#A78BFA]" />
          <span>Consequential Action Protection</span>
        </h3>

        {/* Checkbox: Human Approval Barrier */}
        <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#F4F2FA] block flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#65D6A3]" />
              <span>Require Human Approval for External State Changes</span>
            </span>
            <p className="text-[11px] text-[#A5A2B4] leading-relaxed">
              When enabled, actions that dispatch external messages (Slack, PR comments, Webhooks, Emails) are halted in an <code>awaiting_approval</code> state until explicitly signed off in the Activity log.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={currentPolicy.requireApprovalForConsequential}
              onChange={(e) =>
                handleUpdatePolicy({ requireApprovalForConsequential: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-[#292936] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F4F2FA] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A78BFA]"></div>
          </label>
        </div>

        {/* Network & Resource Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Timeout */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block flex items-center gap-1.5">
              <Clock size={13} className="text-[#A78BFA]" />
              <span>Execution Timeout Ceiling</span>
            </label>
            <select
              value={currentPolicy.maxExecutionTimeoutSecs}
              onChange={(e) =>
                handleUpdatePolicy({ maxExecutionTimeoutSecs: parseInt(e.target.value) })
              }
              className="w-full bg-[#09090D] border border-[#292936] rounded-xl px-3 py-2.5 text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              <option value={30}>30 seconds (Fast audit / ping)</option>
              <option value={60}>60 seconds (Standard default)</option>
              <option value={120}>120 seconds (Complex multi-tool synthesis)</option>
              <option value={300}>300 seconds (Deep repository mapping)</option>
            </select>
            <span className="text-[10px] text-[#777487] block">
              Execution automatically aborts if elapsed time exceeds this ceiling.
            </span>
          </div>

          {/* Tool Calls Ceiling */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A5A2B4] block flex items-center gap-1.5">
              <RotateCcw size={13} className="text-[#A78BFA]" />
              <span>Max Tool Calls Per Run</span>
            </label>
            <select
              value={currentPolicy.maxToolCallsPerRun}
              onChange={(e) =>
                handleUpdatePolicy({ maxToolCallsPerRun: parseInt(e.target.value) })
              }
              className="w-full bg-[#09090D] border border-[#292936] rounded-xl px-3 py-2.5 text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              <option value={3}>3 calls (Strict limit)</option>
              <option value={5}>5 calls (Lightweight)</option>
              <option value={10}>10 calls (Standard pipeline)</option>
              <option value={20}>20 calls (Deep exploratory crawl)</option>
            </select>
            <span className="text-[10px] text-[#777487] block">
              Prevents unbounded recursive tool looping.
            </span>
          </div>
        </div>
      </div>

      {/* Security Architecture Callout */}
      <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#A5A2B4] flex items-start gap-3">
        <Info size={16} className="text-[#65D6A3] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[#F4F2FA]">Backend Enforcement Contract:</span>
          <p className="leading-relaxed">
            Policy boundaries are cryptographically enforced on the server-side execution runtime. Toggles in this UI write to the immutable agent policy definition. Unauthorized outbound network calls or missing approval tokens will result in immediate execution halts and audit logging.
          </p>
        </div>
      </div>
    </div>
  );
};
