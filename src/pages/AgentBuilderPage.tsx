import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Agent, AgentCategory, AgentStatus } from '../types/app';
import { TemplateDefinition } from '../data/templates';
import { appStateService } from '../services/appStateService';
import { validateAgentConfiguration, ValidationResult } from '../services/agentValidationService';
import { useToast } from '../design-system/Toast';
import { ConfirmationDialog } from '../design-system/ConfirmationDialog';
import { EmptyState } from '../design-system/EmptyState';

// Builder Sections
import { AgentBuilderShell } from '../components/builder/AgentBuilderShell';
import { BuilderOverviewSection } from '../components/builder/BuilderOverviewSection';
import { BuilderInstructionsSection } from '../components/builder/BuilderInstructionsSection';
import { BuilderModelSection } from '../components/builder/BuilderModelSection';
import { BuilderToolsSection } from '../components/builder/BuilderToolsSection';
import { BuilderKnowledgeSection } from '../components/builder/BuilderKnowledgeSection';
import { BuilderPermissionsSection } from '../components/builder/BuilderPermissionsSection';
import { BuilderTestingSection } from '../components/builder/BuilderTestingSection';
import { BuilderValidationPanel, BuilderSectionKey } from '../components/builder/BuilderValidationPanel';
import { AgentVersionHistoryPanel } from '../components/builder/AgentVersionHistoryPanel';
import { Bot, ArrowLeft } from 'lucide-react';

interface AgentBuilderPageProps {
  agentId?: string | null; // null or 'new' = create new agent
  initialTemplate?: TemplateDefinition | null;
  initialPrompt?: string;
  initialSection?: BuilderSectionKey;
  onNavigateBack: () => void;
  onNavigateToIntegrations?: () => void;
  onNavigateToKnowledge?: () => void;
  onNavigateToSettings?: () => void;
  onAgentSaved?: (savedAgent: Agent) => void;
}

export const AgentBuilderPage: React.FC<AgentBuilderPageProps> = ({
  agentId,
  initialTemplate,
  initialPrompt,
  initialSection,
  onNavigateBack,
  onNavigateToIntegrations,
  onNavigateToKnowledge,
  onNavigateToSettings,
  onAgentSaved,
}) => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<BuilderSectionKey>(initialSection || 'overview');
  const [isValidationOpen, setIsValidationOpen] = useState(true);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved' | 'error'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(undefined);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Sync activeSection when initialSection prop updates (e.g. from deep link hash change)
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Initialize agent state
  const [agent, setAgent] = useState<Agent>(() => {
    // If editing existing agent
    if (agentId && agentId !== 'new') {
      const existing = appStateService.getAgentById(agentId);
      if (existing) {
        return { ...existing };
      }
    }

    // Creating new agent from template
    if (initialTemplate) {
      return {
        id: `agent-${Math.random().toString(36).substring(2, 9)}`,
        name: initialTemplate.name,
        description: initialTemplate.summary,
        category: initialTemplate.category,
        status: 'draft',
        iconName: initialTemplate.iconName || 'Bot',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        triggerType: 'scheduled',
        tools: [...initialTemplate.requiredTools],
        instructions: initialTemplate.defaultInstructions,
        humanApprovalRequired: initialTemplate.permissions?.actionGating?.toLowerCase().includes('approval') ?? true,
        sourceTemplateId: initialTemplate.id,
        sourceTemplateName: initialTemplate.name,
        sourceTemplateVersion: initialTemplate.version,
        operatingMode: initialTemplate.suggestedOperatingMode || 'approval_required',
        modelConfig: {
          provider: 'google',
          modelId: 'gemini-2.5-flash',
          temperature: 0.7,
          maxOutputTokens: 4096,
          responseFormat: 'markdown',
        },
        permissionsPolicy: {
          operatingMode: initialTemplate.suggestedOperatingMode || 'approval_required',
          readOnly: initialTemplate.permissions?.readOnly ?? true,
          networkAccess: 'restricted',
          allowExternalDispatch: false,
          requireApprovalForConsequential: true,
          maxExecutionTimeoutSecs: 60,
          maxToolCallsPerRun: 10,
        },
      };
    }

    // Creating fresh custom agent
    const newId = `agent-${Math.random().toString(36).substring(2, 9)}`;
    return {
      id: newId,
      name: initialPrompt ? 'Custom AI Specialist' : 'New Specialist Agent',
      description: initialPrompt || 'A custom specialized agent configured to execute repeatable workspace tasks.',
      category: 'custom',
      status: 'draft',
      iconName: 'Bot',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggerType: 'manual',
      tools: ['Public Web Fetcher', 'Citation Verifier'],
      instructions: initialPrompt
        ? `You are an AI Specialist designed to accomplish the following task:\n${initialPrompt}\n\nOperate with verified citations and least-privilege boundaries.`
        : 'You are a specialized AI assistant. Execute assigned tasks with factual precision and adhere strictly to authorized tool permissions.',
      humanApprovalRequired: true,
      operatingMode: 'approval_required',
      modelConfig: {
        provider: 'google',
        modelId: 'gemini-2.5-flash',
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseFormat: 'markdown',
      },
      permissionsPolicy: {
        operatingMode: 'approval_required',
        readOnly: true,
        networkAccess: 'restricted',
        allowExternalDispatch: false,
        requireApprovalForConsequential: true,
        maxExecutionTimeoutSecs: 60,
        maxToolCallsPerRun: 10,
      },
    };
  });

  const [initialSnapshot, setInitialSnapshot] = useState<string>(() => JSON.stringify(agent));

  // Verify existence on mount if editing
  useEffect(() => {
    if (agentId && agentId !== 'new') {
      const existing = appStateService.getAgentById(agentId);
      if (!existing) {
        setNotFound(true);
      } else {
        setAgent({ ...existing });
        setInitialSnapshot(JSON.stringify(existing));
        setLastSavedAt(existing.updatedAt);
      }
    }
  }, [agentId]);

  // Dirty state tracking
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(agent) !== initialSnapshot;
  }, [agent, initialSnapshot]);

  useEffect(() => {
    if (hasUnsavedChanges && saveStatus !== 'saving') {
      setSaveStatus('unsaved');
    }
  }, [hasUnsavedChanges, saveStatus]);

  // Dynamic real-time validation
  const validationResult: ValidationResult = useMemo(() => {
    return validateAgentConfiguration(agent);
  }, [agent]);

  // Update helper
  const handleUpdateAgent = useCallback((updates: Partial<Agent>) => {
    setAgent((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Save implementation
  const handleSave = useCallback(async () => {
    // Check for hard errors
    if (validationResult.errorsCount > 0) {
      showToast({
        type: 'error',
        title: 'Cannot Save Agent',
        message: `Please resolve ${validationResult.errorsCount} blocking error${validationResult.errorsCount > 1 ? 's' : ''} first.`,
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const now = new Date().toISOString();
      const updatedAgent: Agent = {
        ...agent,
        updatedAt: now,
      };

      appStateService.saveAgent(updatedAgent);
      setAgent(updatedAgent);
      setInitialSnapshot(JSON.stringify(updatedAgent));
      setLastSavedAt(now);
      setSaveStatus('saved');

      showToast({
        type: 'success',
        title: 'Agent Saved Successfully',
        message: `Configuration for "${updatedAgent.name}" has been recorded.`,
      });

      if (onAgentSaved) {
        onAgentSaved(updatedAgent);
      }
    } catch (err) {
      setSaveStatus('error');
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'An error occurred while saving the agent configuration.',
      });
    } finally {
      setIsSaving(false);
    }
  }, [agent, validationResult.errorsCount, showToast, onAgentSaved]);

  // Global Keyboard shortcut: Cmd+S / Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // Handle safe back navigation
  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onNavigateBack();
    }
  };

  // If agent not found
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#09090D] text-[#F4F2FA] p-8 flex items-center justify-center">
        <EmptyState
          icon={<Bot size={32} className="text-[#F07885]" />}
          title="Agent Not Found"
          description={`The requested agent identifier "${agentId}" does not exist in this workspace or was previously deleted.`}
          primaryAction={{
            label: 'Return to My Agents',
            onClick: onNavigateBack,
            icon: <ArrowLeft size={14} />,
          }}
        />
      </div>
    );
  }

  const handleSelectSection = useCallback((section: BuilderSectionKey) => {
    setActiveSection(section);
    if (agentId && agentId !== 'new') {
      if (section === 'testing') {
        window.location.hash = `/agents/${agentId}/test`;
      } else {
        window.location.hash = `/agents/${agentId}/edit`;
      }
    } else {
      if (section === 'testing') {
        window.location.hash = '/agents/new/test';
      } else {
        window.location.hash = '/agents/new';
      }
    }
  }, [agentId]);

  return (
    <>
      <AgentBuilderShell
        agent={agent}
        onUpdateAgent={handleUpdateAgent}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onBack={handleBack}
        onSave={handleSave}
        isSaving={isSaving}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        errorsCount={validationResult.errorsCount}
        warningsCount={validationResult.warningsCount}
        readinessLabel={validationResult.readinessLabel}
        isValidationOpen={isValidationOpen}
        onToggleValidation={() => setIsValidationOpen(!isValidationOpen)}
        onToggleVersionHistory={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
        validationPanelNode={
          <BuilderValidationPanel
            issues={validationResult.issues}
            readinessStage={validationResult.readinessStage}
            readinessLabel={validationResult.readinessLabel}
            onJumpToSection={(sec) => {
              handleSelectSection(sec);
              if (typeof window !== 'undefined' && window.innerWidth < 1280) {
                setIsValidationOpen(false);
              }
            }}
            onClose={() => setIsValidationOpen(false)}
            isCollapsible={true}
          />
        }
        versionHistoryPanelNode={
          <AgentVersionHistoryPanel
            isOpen={isVersionHistoryOpen}
            onClose={() => setIsVersionHistoryOpen(false)}
            agent={agent}
            onRevertSuccess={(revertedAgent) => {
              setAgent(revertedAgent);
              setInitialSnapshot(JSON.stringify(revertedAgent));
              setLastSavedAt(revertedAgent.updatedAt);
              setSaveStatus('saved');
              showToast({
                type: 'success',
                title: 'Agent Reverted',
                message: `Configuration restored to snapshot. All sections have been synchronized.`,
              });
            }}
          />
        }
      >
        {/* Render Section based on activeSection */}
        {activeSection === 'overview' && (
          <BuilderOverviewSection
            agent={agent}
            onChange={handleUpdateAgent}
            lastSavedAt={lastSavedAt}
            readinessLabel={validationResult.readinessLabel}
          />
        )}

        {activeSection === 'instructions' && (
          <BuilderInstructionsSection
            agent={agent}
            onChange={handleUpdateAgent}
          />
        )}

        {activeSection === 'model' && (
          <BuilderModelSection
            agent={agent}
            onChange={handleUpdateAgent}
            onNavigateToSettings={onNavigateToSettings}
          />
        )}

        {activeSection === 'tools' && (
          <BuilderToolsSection
            agent={agent}
            onChange={handleUpdateAgent}
            onNavigateToIntegrations={onNavigateToIntegrations}
          />
        )}

        {activeSection === 'knowledge' && (
          <BuilderKnowledgeSection
            agent={agent}
            onChange={handleUpdateAgent}
            onNavigateToKnowledge={onNavigateToKnowledge}
          />
        )}

        {activeSection === 'permissions' && (
          <BuilderPermissionsSection
            agent={agent}
            onChange={handleUpdateAgent}
          />
        )}

        {activeSection === 'testing' && (
          <BuilderTestingSection
            agent={agent}
            readinessLabel={validationResult.readinessLabel}
            errorsCount={validationResult.errorsCount}
            warningsCount={validationResult.warningsCount}
          />
        )}
      </AgentBuilderShell>

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmationDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setShowExitConfirm(false);
          onNavigateBack();
        }}
        title="Discard Unsaved Changes?"
        message="You have unsaved edits in this agent configuration. If you exit now, your changes will be lost."
        confirmLabel="Discard & Exit"
        variant="danger"
      />
    </>
  );
};
