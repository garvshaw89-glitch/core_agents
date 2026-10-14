/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProofStrip } from './components/ProofStrip';
import { Capabilities } from './components/Capabilities';
import { HowItWorks } from './components/HowItWorks';
import { WorkflowPreview } from './components/WorkflowPreview';
import { ControlAndTrust } from './components/ControlAndTrust';
import { PricingSection } from './components/PricingSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AgentBuilderModal } from './components/AgentBuilderModal';
import { SignInModal } from './components/SignInModal';
import { LegalModals } from './components/LegalModals';
import { SpecialistType } from './types';

export default function App() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderSpecialist, setBuilderSpecialist] = useState<SpecialistType>('research');
  const [builderTier, setBuilderTier] = useState<string>('Starter');

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'docs' | null>(null);

  const handleOpenBuilder = (specialist: SpecialistType = 'research', tier: string = 'Starter') => {
    setBuilderSpecialist(specialist);
    setBuilderTier(tier);
    setIsBuilderOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090D] text-[#F4F2FA] relative selection:bg-[#A78BFA]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenGetStarted={() => handleOpenBuilder('research', 'Starter')}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Page Landmark */}
      <main id="main-content">
        {/* 1. Hero Section */}
        <Hero
          onBuildFirstAgent={() => handleOpenBuilder('research', 'Starter')}
          onExplorePlatform={() => scrollToSection('#platform')}
        />

        {/* 2. Product Proof Strip */}
        <ProofStrip />

        {/* 3. Capabilities Section */}
        <Capabilities
          onConfigureAgent={(type) => handleOpenBuilder(type, 'Starter')}
        />

        {/* 4. How It Works Section */}
        <HowItWorks />

        {/* 5. Workflow Preview Section */}
        <WorkflowPreview />

        {/* 6. Control and Trust Section */}
        <ControlAndTrust />

        {/* 7. Pricing Section */}
        <PricingSection
          onSelectTier={(tierName) => handleOpenBuilder('research', tierName)}
        />

        {/* 8. Final Call to Action */}
        <FinalCTA
          onCreateAgent={() => handleOpenBuilder('research', 'Starter')}
          onExploreUseCases={() => scrollToSection('#capabilities')}
        />
      </main>

      {/* 9. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenDocs={() => setLegalModalType('docs')}
        onSelectUseCase={(hash) => scrollToSection(hash)}
      />

      {/* Modals & Interactivity */}
      <AgentBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        initialType={builderSpecialist}
        initialTier={builderTier}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onOpenGetStarted={() => handleOpenBuilder('research', 'Starter')}
      />

      <LegalModals
        isOpen={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || 'privacy'}
      />
    </div>
  );
}
