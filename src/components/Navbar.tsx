import React, { useState, useEffect } from 'react';
import { CoreSymbol } from './CoreSymbol';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenGetStarted: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGetStarted, onOpenSignIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Use cases', href: '#capabilities' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#080B16]/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-slate-800/40 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with CORE symbol */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-[#F4F7FC] hover:text-white transition-colors group whitespace-nowrap shrink-0"
            aria-label="CORE Agents Home"
          >
            <CoreSymbol size={28} className="group-hover:scale-105 transition-transform duration-200" />
            <span className="text-lg font-semibold tracking-tight text-[#F4F7FC]">
              CORE <span className="text-[#38D9FF] font-normal">Agents</span>
            </span>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9AA7BC]"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-[#F4F7FC] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#38D9FF] decoration-2 whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSignIn}
              className="px-3.5 py-1.5 text-xs font-medium text-[#9AA7BC] hover:text-[#F4F7FC] transition-colors rounded-lg hover:bg-[#111827] focus-visible:outline-2 focus-visible:outline-[#38D9FF] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#080B16] bg-[#38D9FF] hover:bg-[#80E5FF] active:bg-[#22B8DC] transition-all rounded-lg shadow-sm hover:shadow-[0_0_16px_rgba(56,217,255,0.3)] focus-visible:outline-2 focus-visible:outline-[#38D9FF] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Get started
              <ArrowUpRight size={14} className="text-[#080B16]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenGetStarted}
              className="px-3 py-1.5 text-xs font-medium text-[#09090D] bg-[#F4F2FA] rounded-md"
            >
              Get started
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720] rounded-lg focus-visible:outline-2 focus-visible:outline-[#A78BFA]"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-[#292936] bg-[#101016]/95 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-[#292936] space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="px-3 py-2 text-sm font-medium text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-[#292936] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full text-center py-2.5 text-xs font-medium text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720] rounded-lg transition-colors"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenGetStarted();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#09090D] bg-[#F4F2FA] rounded-lg"
              >
                Get started
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
