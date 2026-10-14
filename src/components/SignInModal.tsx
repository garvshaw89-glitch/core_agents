import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CoreSymbol } from './CoreSymbol';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGetStarted: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onOpenGetStarted }) => {
  const [tokenOrEmail, setTokenOrEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenOrEmail.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
    >
      <div
        className="relative w-full max-w-md bg-[#101016] border border-[#292936] rounded-2xl shadow-2xl p-6 sm:p-8 text-left"
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

        <div className="flex items-center gap-2.5 mb-5">
          <CoreSymbol size={24} />
          <span className="text-sm font-semibold tracking-tight text-[#F4F2FA]">
            CORE <span className="text-[#A5A2B4] font-normal">Agents Workspace</span>
          </span>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#65D6A3]/15 text-[#65D6A3] flex items-center justify-center mx-auto border border-[#65D6A3]/30">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#F4F2FA]">Access Verification Pending</h3>
            <p className="text-xs text-[#A5A2B4] leading-relaxed">
              We received your workspace access request for <strong>{tokenOrEmail}</strong>. If your account is
              part of the initial pilot cohort, an instant magic link has been sent to your inbox.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-5 py-2 text-xs font-semibold rounded-lg bg-[#F4F2FA] text-[#09090D] hover:bg-white"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <h3 id="signin-title" className="text-xl font-bold text-[#F4F2FA] mb-2">
              Sign In to Your Workspace
            </h3>
            <p className="text-xs text-[#A5A2B4] leading-relaxed mb-6">
              Enter your work email or early access token to open your active agent console.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="signin-input" className="block text-xs font-medium text-[#A5A2B4] mb-1">
                  Email or Pilot Token
                </label>
                <input
                  id="signin-input"
                  type="text"
                  required
                  value={tokenOrEmail}
                  onChange={(e) => setTokenOrEmail(e.target.value)}
                  placeholder="name@company.com or core_XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] focus:outline-none focus:border-[#A78BFA]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F4F2FA] text-[#09090D] text-xs font-semibold hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Workspace</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#292936] text-center space-y-2">
              <p className="text-xs text-[#777487]">Don't have an access key yet?</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGetStarted();
                }}
                className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors"
              >
                Request early access & configure your first agent &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
