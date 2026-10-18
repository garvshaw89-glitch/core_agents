/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './design-system/Toast';

// Landing Page Components
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

// Authenticated Application Shell & Pages
import { AppShell, AppNavPage } from './components/app/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { MyAgentsPage } from './pages/MyAgentsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ActivityPage } from './pages/ActivityPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AgentDetailDrawer } from './components/app/AgentDetailDrawer';
import { ActivityDetailDrawer } from './components/app/ActivityDetailDrawer';
import { CreateAgentModal } from './components/app/CreateAgentModal';
import { AgentBuilderPage } from './pages/AgentBuilderPage';
import { TemplateDefinition } from './data/templates';
import { Agent, ActivityRecord } from './types/app';
import { appStateService } from './services/appStateService';
import { BuilderSectionKey } from './components/builder/BuilderValidationPanel';

type ViewMode = 'landing' | 'app' | 'builder';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('app'); // Default to authenticated app for immediate evaluation, with instant landing switch
  const [activeAppPage, setActiveAppPage] = useState<AppNavPage>('overview');

  // Builder workspace state
  const [builderAgentId, setBuilderAgentId] = useState<string | null>(null);
  const [builderInitialSection, setBuilderInitialSection] = useState<BuilderSectionKey>('overview');

  // Landing page modal states
  const [isLandingBuilderOpen, setIsLandingBuilderOpen] = useState(false);
  const [landingBuilderSpecialist, setLandingBuilderSpecialist] = useState<SpecialistType>('research');
  const [landingBuilderTier, setLandingBuilderTier] = useState<string>('Starter');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'docs' | null>(null);

  // App contextual drawers
  const [inspectedAgent, setInspectedAgent] = useState<Agent | null>(null);
  const [inspectedActivity, setInspectedActivity] = useState<ActivityRecord | null>(null);
  const [templateForCreation, setTemplateForCreation] = useState<TemplateDefinition | null>(null);
  const [isAppCreateOpen, setIsAppCreateOpen] = useState(false);
  const [initialPromptForCreate, setInitialPromptForCreate] = useState<string | undefined>(undefined);

  // Filter states passed between pages (e.g. from Overview MetricCards)
  const [agentsInitialFilter, setAgentsInitialFilter] = useState<{ status?: string; category?: string; query?: string } | undefined>(undefined);
  const [workflowsInitialFilter, setWorkflowsInitialFilter] = useState<{ status?: string } | undefined>(undefined);
  const [activityInitialFilter, setActivityInitialFilter] = useState<{ status?: string } | undefined>(undefined);

  // Sync with browser URL hash for deep linking and back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const hash = rawHash.toLowerCase();

      // Deep linking to builder: /agents/new, /agents/:id/edit, /agents/:id/test, /agents/:id, /builder/new, etc.
      const cleanPath = (rawHash.startsWith('/') ? rawHash.substring(1) : rawHash).replace(/\/+$/, '');
      const parts = cleanPath.split('/');

      if (parts[0] === 'agents' || parts[0] === 'builder') {
        const targetId = parts[1];
        const subAction = parts[2]?.toLowerCase();

        if (targetId === 'new') {
          setViewMode('builder');
          setBuilderAgentId('new');
          setBuilderInitialSection(subAction === 'test' ? 'testing' : 'overview');
          return;
        }

        if (targetId) {
          setViewMode('builder');
          setBuilderAgentId(targetId);
          if (subAction === 'test') {
            setBuilderInitialSection('testing');
          } else if (
            subAction === 'instructions' ||
            subAction === 'model' ||
            subAction === 'tools' ||
            subAction === 'knowledge' ||
            subAction === 'permissions' ||
            subAction === 'overview'
          ) {
            setBuilderInitialSection(subAction as BuilderSectionKey);
          } else {
            setBuilderInitialSection('overview');
          }
          return;
        }
      }

      if (hash === 'landing' || hash === 'platform' || hash === 'capabilities' || hash === 'how-it-works' || hash === 'pricing') {
        setViewMode('landing');
      } else if (
        hash === 'overview' ||
        hash === 'agents' ||
        hash === 'templates' ||
        hash === 'workflows' ||
        hash === 'activity' ||
        hash === 'knowledge' ||
        hash === 'integrations' ||
        hash === 'settings'
      ) {
        setViewMode('app');
        setActiveAppPage(hash as AppNavPage);
      } else if (hash === 'app') {
        setViewMode('app');
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateAppPage = (page: AppNavPage) => {
    setViewMode('app');
    setActiveAppPage(page);
    window.location.hash = page;
  };

  const navigateToBuilder = (
    agentId?: string | null,
    template?: TemplateDefinition | null,
    prompt?: string,
    initialSection: BuilderSectionKey = 'overview'
  ) => {
    setViewMode('builder');
    setBuilderAgentId(agentId || 'new');
    setTemplateForCreation(template || null);
    setInitialPromptForCreate(prompt);
    setBuilderInitialSection(initialSection);
    if (agentId && agentId !== 'new') {
      window.location.hash = initialSection === 'testing'
        ? `/agents/${agentId}/test`
        : `/agents/${agentId}/edit`;
    } else {
      window.location.hash = initialSection === 'testing'
        ? '/agents/new/test'
        : '/agents/new';
    }
  };

  const switchToLanding = () => {
    setViewMode('landing');
    window.location.hash = 'landing';
  };

  const switchToApp = (page: AppNavPage = 'overview') => {
    setViewMode('app');
    setActiveAppPage(page);
    window.location.hash = page;
  };

  const handleOpenLandingBuilder = (specialist: SpecialistType = 'research', tier: string = 'Starter') => {
    setLandingBuilderSpecialist(specialist);
    setLandingBuilderTier(tier);
    setIsLandingBuilderOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ToastProvider>
      {viewMode === 'builder' ? (
        /* =========================================================================
           ADVANCED AGENT BUILDER WORKSPACE
        ========================================================================= */
        <AgentBuilderPage
          agentId={builderAgentId}
          initialTemplate={templateForCreation}
          initialPrompt={initialPromptForCreate}
          initialSection={builderInitialSection}
          onNavigateBack={() => switchToApp('agents')}
          onNavigateToIntegrations={() => switchToApp('integrations')}
          onNavigateToKnowledge={() => switchToApp('knowledge')}
          onNavigateToSettings={() => switchToApp('settings')}
          onAgentSaved={(savedAgent) => {
            setInspectedAgent(savedAgent);
          }}
        />
      ) : viewMode === 'app' ? (
        /* =========================================================================
           AUTHENTICATED APPLICATION INTERFACE
        ========================================================================= */
        <AppShell
          activePage={activeAppPage}
          onNavigate={navigateAppPage}
          onSwitchToLanding={switchToLanding}
          onCreateAgentAction={() => navigateToBuilder('new')}
        >
          {activeAppPage === 'overview' && (
            <OverviewPage
              onCreateAgent={(prompt) => {
                navigateToBuilder('new', null, prompt);
              }}
              onExploreTemplates={() => navigateAppPage('templates')}
              onOpenAgent={(agent) => setInspectedAgent(agent)}
              onOpenActivity={(act) => setInspectedActivity(act)}
              onNavigateToAgents={(filter) => {
                setAgentsInitialFilter(filter);
                navigateAppPage('agents');
              }}
              onNavigateToWorkflows={(filter) => {
                setWorkflowsInitialFilter(filter);
                navigateAppPage('workflows');
              }}
              onNavigateToActivity={(filter) => {
                setActivityInitialFilter(filter);
                navigateAppPage('activity');
              }}
            />
          )}

          {activeAppPage === 'agents' && (
            <MyAgentsPage
              onCreateAgent={() => navigateToBuilder('new')}
              onEditAgentInBuilder={(agent) => navigateToBuilder(agent.id)}
              onOpenAgent={(agent) => setInspectedAgent(agent)}
              onExploreTemplates={() => navigateAppPage('templates')}
              initialStatusFilter={agentsInitialFilter?.status}
              initialCategoryFilter={agentsInitialFilter?.category}
              initialSearchQuery={agentsInitialFilter?.query}
            />
          )}

          {activeAppPage === 'templates' && (
            <TemplatesPage
              onSelectTemplateToCreate={(template) => {
                navigateToBuilder('new', template);
              }}
              onCreateCustomAgent={() => {
                navigateToBuilder('new');
              }}
              onNavigateToAgent={(agentId) => {
                const agent = appStateService.getAgentById(agentId);
                if (agent) {
                  setInspectedAgent(agent);
                }
                navigateAppPage('agents');
              }}
            />
          )}

          {activeAppPage === 'workflows' && (
            <WorkflowsPage
              onCreateAgent={() => navigateToBuilder('new')}
              initialStatusFilter={workflowsInitialFilter?.status}
            />
          )}

          {activeAppPage === 'activity' && (
            <ActivityPage
              onNavigateToAgents={() => navigateAppPage('agents')}
              initialStatusFilter={activityInitialFilter?.status}
            />
          )}

          {activeAppPage === 'knowledge' && <KnowledgePage />}

          {activeAppPage === 'integrations' && <IntegrationsPage />}

          {activeAppPage === 'settings' && <SettingsPage />}

          {/* Inspected Agent Drawer */}
          <AgentDetailDrawer
            agent={inspectedAgent}
            isOpen={inspectedAgent !== null}
            onClose={() => setInspectedAgent(null)}
            onUpdate={() => {
              setInspectedAgent(null);
            }}
            onOpenBuilder={(agent) => navigateToBuilder(agent.id)}
          />

          {/* Inspected Activity Drawer */}
          <ActivityDetailDrawer
            activity={inspectedActivity}
            isOpen={inspectedActivity !== null}
            onClose={() => setInspectedActivity(null)}
            onApprove={(id) => {
              appStateService.approveActivity(id);
              setInspectedActivity(null);
            }}
          />

          {/* Application Create Agent Modal (Quick creation fallback) */}
          <CreateAgentModal
            isOpen={isAppCreateOpen}
            onClose={() => {
              setIsAppCreateOpen(false);
              setTemplateForCreation(null);
              setInitialPromptForCreate(undefined);
            }}
            initialTemplate={templateForCreation}
            initialPrompt={initialPromptForCreate}
            onSave={(newAgent) => {
              appStateService.saveAgent(newAgent);
              navigateAppPage('agents');
            }}
          />
        </AppShell>
      ) : (
        /* =========================================================================
           PUBLIC LANDING PAGE (Preserved with direct workspace access triggers)
        ========================================================================= */
        <div className="min-h-screen bg-[#09090D] text-[#F4F2FA] relative selection:bg-[#A78BFA]/30 selection:text-white">
          {/* Quick bar banner allowing direct entry to workspace */}
          <div className="bg-[#111118] border-b border-[#292936] py-1.5 px-4 text-center text-xs flex items-center justify-center gap-3">
            <span className="text-[#A5A2B4]">
              Authenticated Workspace Interface Active
            </span>
            <button
              type="button"
              onClick={() => switchToApp('overview')}
              className="text-[#A78BFA] hover:text-[#C4B5FD] font-semibold underline underline-offset-4 cursor-pointer"
            >
              Open Workspace &rarr;
            </button>
          </div>

          {/* Top Navigation */}
          <Navbar
            onOpenGetStarted={() => switchToApp('overview')}
            onOpenSignIn={() => switchToApp('overview')}
          />

          {/* Main Page Landmark */}
          <main id="main-content">
            {/* 1. Hero Section */}
            <Hero
              onBuildFirstAgent={() => switchToApp('agents')}
              onExplorePlatform={() => scrollToSection('#platform')}
            />

            {/* 2. Product Proof Strip */}
            <ProofStrip />

            {/* 3. Capabilities Section */}
            <Capabilities
              onConfigureAgent={(type) => {
                switchToApp('templates');
              }}
            />

            {/* 4. How It Works Section */}
            <HowItWorks />

            {/* 5. Workflow Preview Section */}
            <WorkflowPreview />

            {/* 6. Control and Trust Section */}
            <ControlAndTrust />

            {/* 7. Pricing Section */}
            <PricingSection
              onSelectTier={(tierName) => switchToApp('overview')}
            />

            {/* 8. Final Call to Action */}
            <FinalCTA
              onCreateAgent={() => switchToApp('agents')}
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

          {/* Modals & Interactivity for Landing */}
          <AgentBuilderModal
            isOpen={isLandingBuilderOpen}
            onClose={() => setIsLandingBuilderOpen(false)}
            initialType={landingBuilderSpecialist}
            initialTier={landingBuilderTier}
          />

          <SignInModal
            isOpen={isSignInOpen}
            onClose={() => setIsSignInOpen(false)}
            onOpenGetStarted={() => switchToApp('overview')}
          />

          <LegalModals
            isOpen={legalModalType !== null}
            onClose={() => setLegalModalType(null)}
            type={legalModalType || 'privacy'}
          />
        </div>
      )}
    </ToastProvider>
  );
}
