import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Sparkles, Wrench, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SPECIALIST_AGENTS } from '../data/agents';
import { SpecialistType } from '../types';
import { CoreSymbol } from './CoreSymbol';

interface AgentBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: SpecialistType;
  initialTier?: string;
}

export const AgentBuilderModal: React.FC<AgentBuilderModalProps> = ({
  isOpen,
  onClose,
  initialType = 'research',
  initialTier = 'Starter',
}) => {
  const [selectedType, setSelectedType] = useState<SpecialistType>(initialType);
  const [agentName, setAgentName] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [approvalRequired, setApprovalRequired] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setSelectedType(initialType);
    const agent = SPECIALIST_AGENTS.find((a) => a.id === initialType) || SPECIALIST_AGENTS[0];
    setAgentName(agent.title);
    setCustomInstructions(`Execute repeatable ${agent.id} tasks following bounded policies. Summarize all findings with source citations.`);
    setSelectedTools([...agent.tools]);
  }, [initialType, isOpen]);

  // Handle ESC key
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

  const currentAgent = SPECIALIST_AGENTS.find((a) => a.id === selectedType) || SPECIALIST_AGENTS[0];

  const handleSelectType = (type: SpecialistType) => {
    setSelectedType(type);
    const agent = SPECIALIST_AGENTS.find((a) => a.id === type) || SPECIALIST_AGENTS[0];
    setAgentName(agent.title);
    setCustomInstructions(`Execute repeatable ${agent.id} tasks following bounded policies. Summarize all findings with source citations.`);
    setSelectedTools([...agent.tools]);
  };

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      if (selectedTools.length > 1) {
        setSelectedTools(selectedTools.filter((t) => t !== tool));
      }
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate clean token registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="builder-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#101016] border border-[#292936] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#65D6A3]/15 text-[#65D6A3] flex items-center justify-center mx-auto border border-[#65D6A3]/30">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-2xl font-bold text-[#F4F2FA]">Agent Configuration Staged</h3>

            <p className="text-sm text-[#A5A2B4] max-w-md mx-auto leading-relaxed">
              We have reserved your early access workspace for <strong>{email}</strong> on the{' '}
              <span className="text-[#A78BFA]">{initialTier}</span> plan with your customized{' '}
              <strong>{agentName}</strong>.
            </p>

            <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-[#777487]">
                <span>Config Token:</span>
                <span className="font-mono text-[#F4F2FA]">core_{Math.random().toString(36).substring(2, 9)}</span>
              </div>
              <div className="flex justify-between text-[#777487]">
                <span>Human Approval Barrier:</span>
                <span className="text-[#65D6A3]">Enforced</span>
              </div>
              <div className="flex justify-between text-[#777487]">
                <span>Whitelisted Tools:</span>
                <span className="text-[#F4F2FA]">{selectedTools.length} tools</span>
              </div>
            </div>

            <p className="text-xs text-[#777487]">
              Phase 1 early-access invites are rolling out weekly. We will notify you at this email.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#F4F2FA] text-[#09090D] text-xs font-semibold hover:bg-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <CoreSymbol size={24} />
              <div>
                <h3 id="builder-title" className="text-lg font-bold text-[#F4F2FA]">
                  Configure Your First Agent
                </h3>
                <p className="text-xs text-[#777487]">
                  Start with a template, whitelist its tools, and set your review gates.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Specialist Choice */}
              <div>
                <label className="block text-xs font-medium text-[#A5A2B4] mb-2">
                  1. Specialist Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPECIALIST_AGENTS.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => handleSelectType(agent.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                        selectedType === agent.id
                          ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                          : 'bg-[#09090D] border-[#292936] text-[#A5A2B4] hover:border-[#3D3D4E]'
                      }`}
                    >
                      <div className="font-semibold capitalize truncate">{agent.id}</div>
                      <div className="text-[10px] text-[#777487] truncate">{agent.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Agent Title & Instructions */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="agent-name" className="block text-xs font-medium text-[#A5A2B4] mb-1">
                    2. Agent Identifier
                  </label>
                  <input
                    id="agent-name"
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA]"
                    placeholder="e.g. Competitive Intelligence Lead"
                  />
                </div>

                <div>
                  <label htmlFor="agent-prompt" className="block text-xs font-medium text-[#A5A2B4] mb-1">
                    Directives & Objective
                  </label>
                  <textarea
                    id="agent-prompt"
                    rows={2}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Step 3: Approved Tool Whitelist */}
              <div>
                <label className="block text-xs font-medium text-[#A5A2B4] mb-2">
                  3. Approved Tool Whitelist (Click to toggle)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentAgent.tools.map((tool) => {
                    const isChecked = selectedTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                            : 'bg-[#09090D] border-[#292936] text-[#777487]'
                        }`}
                      >
                        <span className="truncate">{tool}</span>
                        {isChecked && <Check size={14} className="text-[#65D6A3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Consequential Human Barrier Toggle */}
              <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <Shield size={16} className="text-[#F2C879] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#F4F2FA]">
                      Human Approval Barrier for Consequential Actions
                    </div>
                    <div className="text-[11px] text-[#777487]">
                      Requires manual review before sending messages, modifying repos, or committing records.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setApprovalRequired(!approvalRequired)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    approvalRequired ? 'bg-[#A78BFA]' : 'bg-[#292936]'
                  }`}
                  aria-pressed={approvalRequired}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      approvalRequired ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Step 5: Work Email for Early Access Workspace */}
              <div>
                <label htmlFor="user-email" className="block text-xs font-medium text-[#A5A2B4] mb-1">
                  Work Email (to receive your deployment workspace credentials)
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  required
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA]"
                />
                {errorMsg && <p className="text-xs text-[#F07885] mt-1.5">{errorMsg}</p>}
              </div>

              {/* Footer CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#777487]">No credit card required · Free in Early Access</span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#F4F2FA] hover:bg-white text-[#09090D] text-xs font-semibold transition-all inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Staging Agent...' : 'Stage Agent & Request Access'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
