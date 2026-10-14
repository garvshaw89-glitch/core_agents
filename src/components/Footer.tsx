import React from 'react';
import { CoreSymbol } from './CoreSymbol';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDocs: () => void;
  onSelectUseCase: (hash: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDocs,
  onSelectUseCase,
}) => {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const elem = document.querySelector(hash);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#292936] bg-[#09090D] pt-16 pb-12 text-xs text-[#A5A2B4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#292936]">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-[#F4F2FA]">
              <CoreSymbol size={26} />
              <span className="text-base font-semibold tracking-tight text-[#F4F2FA]">
                CORE <span className="text-[#A5A2B4] font-normal">Agents</span>
              </span>
            </div>
            <p className="text-xs text-[#777487] max-w-sm leading-relaxed">
              A premium workforce platform where users create and manage specialized AI agents that perform useful,
              repeatable work with human approval for consequential operations.
            </p>
            <div className="text-[11px] text-[#777487] font-mono">
              Designed for predictability & control
            </div>
          </div>

          {/* Column: Platform */}
          <div className="space-y-3">
            <div className="font-semibold text-[#F4F2FA]">Platform</div>
            <ul className="space-y-2">
              <li>
                <a
                  href="#platform"
                  onClick={(e) => handleScrollTo(e, '#platform')}
                  className="hover:text-[#F4F2FA] transition-colors"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="#capabilities"
                  onClick={(e) => handleScrollTo(e, '#capabilities')}
                  className="hover:text-[#F4F2FA] transition-colors"
                >
                  Specialist Models
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  onClick={(e) => handleScrollTo(e, '#workflow')}
                  className="hover:text-[#F4F2FA] transition-colors"
                >
                  Workflow Preview
                </a>
              </li>
              <li>
                <a
                  href="#trust"
                  onClick={(e) => handleScrollTo(e, '#trust')}
                  className="hover:text-[#F4F2FA] transition-colors"
                >
                  Security & Governance
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleScrollTo(e, '#pricing')}
                  className="hover:text-[#F4F2FA] transition-colors"
                >
                  Pricing Tiers
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Use Cases */}
          <div className="space-y-3">
            <div className="font-semibold text-[#F4F2FA]">Specialists</div>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectUseCase('#capabilities')}
                  className="hover:text-[#F4F2FA] transition-colors text-left"
                >
                  Competitive Research
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectUseCase('#capabilities')}
                  className="hover:text-[#F4F2FA] transition-colors text-left"
                >
                  Code Review & Triage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectUseCase('#capabilities')}
                  className="hover:text-[#F4F2FA] transition-colors text-left"
                >
                  Curriculum Learning
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectUseCase('#capabilities')}
                  className="hover:text-[#F4F2FA] transition-colors text-left"
                >
                  Operations Monitoring
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Governance & Legal */}
          <div className="space-y-3">
            <div className="font-semibold text-[#F4F2FA]">Resources</div>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenDocs}
                  className="hover:text-[#F4F2FA] transition-colors text-left cursor-pointer"
                >
                  Platform Documentation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-[#F4F2FA] transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="hover:text-[#F4F2FA] transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777487]">
          <div>
            &copy; {currentYear} CORE Agents Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Human-Controlled Execution</span>
            <span>·</span>
            <span>Immutable Trace Auditing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
