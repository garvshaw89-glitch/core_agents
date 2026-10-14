import React, { useEffect } from 'react';
import { X, Shield, FileText, BookOpen } from 'lucide-react';
import { CoreSymbol } from './CoreSymbol';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'docs';
}

export const LegalModals: React.FC<ModalProps> = ({ isOpen, onClose, type }) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#101016] border border-[#292936] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#292936] shrink-0">
          <CoreSymbol size={22} />
          <span className="text-sm font-semibold tracking-tight text-[#F4F2FA]">
            {type === 'privacy' && 'Privacy Policy'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'docs' && 'Platform Documentation'}
          </span>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4 text-xs text-[#A5A2B4] leading-relaxed">
          {type === 'privacy' && (
            <>
              <h4 className="text-sm font-semibold text-[#F4F2FA]">Privacy & Data Governance at CORE Agents</h4>
              <p>
                At CORE Agents, we treat customer data with strict isolation. When you deploy specialized agents,
                we adhere to explicit boundary enforcement:
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <strong className="text-[#F4F2FA]">Zero Model Training:</strong> Your instructions, prompt inputs,
                  retrieved repository snippets, and generated outputs are never utilized to train foundation models.
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <strong className="text-[#F4F2FA]">Ephemeral Execution:</strong> Scratchpad memory and intermediary
                  tool payload responses are discarded immediately following task execution.
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <strong className="text-[#F4F2FA]">Encrypted Audit Logs:</strong> Execution traces and human approval
                  records are encrypted at rest with customer-scoped keys.
                </div>
              </div>
              <p className="text-[11px] text-[#777487]">
                Last updated: October 2026. For inquiries regarding GDPR or enterprise VPC isolation, contact
                security@coreagents.internal.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="text-sm font-semibold text-[#F4F2FA]">Terms of Service & Usage Governance</h4>
              <p>
                By accessing the CORE Agents platform or deploying an agent template, you agree to bounded execution
                principles:
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <strong className="text-[#F4F2FA]">Human Accountability:</strong> While CORE agents execute automated
                  analysis and report synthesis, the operator retains responsibility for approving consequential
                  actions (such as outbound broadcasts or code merges).
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <strong className="text-[#F4F2FA]">Permitted Tool Boundaries:</strong> Agents must not be configured
                  to circumvent network security restrictions or scrape non-public unauthorized data sources.
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <strong className="text-[#F4F2FA]">Service Availability:</strong> During the Phase 1 Early Access
                  period, operational rate limits and feature adjustments may be applied with advance notification.
                </div>
              </div>
            </>
          )}

          {type === 'docs' && (
            <>
              <h4 className="text-sm font-semibold text-[#F4F2FA]">Platform Architectural Overview</h4>
              <p>
                CORE Agents is built around four fundamental concepts:
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <span className="text-xs font-semibold text-[#F4F2FA] block mb-1">1. Specialist Agents</span>
                  Single-purpose models pre-configured with narrow prompts and strict output schemas.
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <span className="text-xs font-semibold text-[#F4F2FA] block mb-1">2. Whitelisted Tool Connectors</span>
                  Deterministic adapters that restrict network queries, git operations, and data transformations.
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <span className="text-xs font-semibold text-[#F4F2FA] block mb-1">3. Consequential Action Gates</span>
                  Hard stops that require an authenticated user to sign off on sensitive external mutations.
                </div>
                <div className="p-3 rounded-lg bg-[#09090D] border border-[#292936]">
                  <span className="text-xs font-semibold text-[#F4F2FA] block mb-1">4. Verifiable Execution Traces</span>
                  Cryptographically stamped execution records providing 100% auditability for regulatory compliance.
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-[#292936] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#171720] hover:bg-[#20202C] text-[#F4F2FA] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
