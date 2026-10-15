import React, { useState } from 'react';
import { MarketplaceTemplate } from '../../data/templates';
import { Agent, AgentCategory } from '../../types/app';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Textarea } from '../../design-system/Textarea';
import { useToast } from '../../design-system/Toast';
import { appStateService } from '../../services/appStateService';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Shield,
  Wrench,
  Database,
  Terminal,
  Layers,
  Sparkles,
  AlertCircle,
  Clock,
  BookOpen,
  Info,
} from 'lucide-react';

interface AgentConfigurationWizardProps {
  template: MarketplaceTemplate;
  onCancel: () => void;
  onComplete: (agent: Agent) => void;
}

export const AgentConfigurationWizard: React.FC<AgentConfigurationWizardProps> = ({
  template,
  onCancel,
  onComplete,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  // Step 1: Identity
  const [name, setName] = useState<string>(template.name);
  const [description, setDescription] = useState<string>(template.summary);
  const [category, setCategory] = useState<AgentCategory>(template.category);

  // Step 2: Instructions
  const [instructions, setInstructions] = useState<string>(template.defaultInstructions);

  // Step 3: Knowledge
  const availableKnowledge = appStateService.getKnowledge();
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>([]);

  // Step 4: Tools & Integrations
  const availableIntegrations = appStateService.getIntegrations();
  const [selectedTools, setSelectedTools] = useState<string[]>([...template.requiredTools]);

  // Step 5: Permissions & Operating Mode
  const [operatingMode, setOperatingMode] = useState<'manual' | 'approval_required' | 'automated'>(
    template.suggestedOperatingMode
  );
  const [humanApprovalRequired, setHumanApprovalRequired] = useState<boolean>(
    template.suggestedOperatingMode !== 'automated'
  );
  const [initialStatus, setInitialStatus] = useState<'draft' | 'active'>('active');

  const steps = [
    { number: 1, label: 'Identity' },
    { number: 2, label: 'Instructions' },
    { number: 3, label: 'Knowledge' },
    { number: 4, label: 'Tools' },
    { number: 5, label: 'Governance' },
    { number: 6, label: 'Review' },
  ];

  // Step 1 Validation
  const handleNextFromStep1 = () => {
    if (!name.trim()) {
      setValidationError('Agent name is required.');
      return;
    }
    setValidationError('');
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = () => {
    if (!instructions.trim()) {
      setValidationError('System instructions cannot be blank.');
      return;
    }
    setValidationError('');
    setCurrentStep(3);
  };

  const toggleKnowledge = (id: string) => {
    if (selectedKnowledgeIds.includes(id)) {
      setSelectedKnowledgeIds(selectedKnowledgeIds.filter((k) => k !== id));
    } else {
      setSelectedKnowledgeIds([...selectedKnowledgeIds, id]);
    }
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

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setValidationError('Agent name is required.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const newAgent: Agent = {
        id: `agent-${Math.random().toString(36).substring(2, 9)}`,
        name: name.trim(),
        description: description.trim() || template.summary,
        category,
        status: initialStatus,
        iconName: template.iconName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        triggerType:
          operatingMode === 'automated' ? 'scheduled' : operatingMode === 'manual' ? 'manual' : 'scheduled',
        schedule: operatingMode === 'automated' ? template.suggestedSchedule : undefined,
        tools: selectedTools,
        instructions: instructions.trim(),
        humanApprovalRequired,
        sourceTemplateId: template.id,
        sourceTemplateName: template.name,
        sourceTemplateVersion: template.version,
        selectedKnowledgeIds,
        operatingMode,
      };

      // Persist in repository
      appStateService.saveAgent(newAgent);

      showToast({
        type: 'success',
        title: 'Agent Created',
        message: `${newAgent.name} has been added to your My Agents workforce.`,
      });

      onComplete(newAgent);
    } catch (err) {
      setIsSubmitting(false);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not persist agent configuration. Your entered values have been retained.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-150 text-left pb-16">
      {/* Top Breadcrumb and Cancel */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-[#A5A2B4] hover:text-[#F4F2FA] transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit Setup to Marketplace</span>
        </button>

        <span className="text-xs text-[#777487] font-mono">
          Step 0{currentStep} of 06 · {steps[currentStep - 1].label}
        </span>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="p-4 rounded-2xl bg-[#111118] border border-[#292936] shadow-sm">
        <div className="flex items-center justify-between relative">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center gap-1.5 relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs transition-colors ${
                      isCompleted
                        ? 'bg-[#65D6A3] text-[#09090D] font-bold'
                        : isCurrent
                        ? 'bg-[#A78BFA] text-[#09090D] font-bold ring-4 ring-[#A78BFA]/20'
                        : 'bg-[#171720] text-[#777487] border border-[#292936]'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : s.number}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:inline ${
                      isCurrent ? 'text-[#F4F2FA]' : 'text-[#777487]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 transition-colors ${
                      currentStep > idx + 1 ? 'bg-[#65D6A3]' : 'bg-[#292936]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form Content Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111118] border border-[#292936] space-y-6 shadow-md">
        {/* Source Template Info Banner */}
        <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#A78BFA]" />
            <span className="text-[#777487]">Configuring copy of blueprint:</span>
            <span className="font-semibold text-[#F4F2FA]">{template.name}</span>
          </div>
          <span className="text-[10px] font-mono text-[#777487] bg-[#171720] px-2 py-0.5 rounded">
            v{template.version}
          </span>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-[#F07885]/10 border border-[#F07885]/20 text-xs text-[#F07885] flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#F4F2FA]">Step 1: Agent Identity</h2>
              <p className="text-xs text-[#A5A2B4] mt-1">
                Name your agent and customize its role description in your personal workforce.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Agent Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationError('');
                }}
                placeholder="e.g. Acme Codebase Triager"
                required
              />

              <Textarea
                label="Role Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this agent does in 1-2 sentences..."
                rows={2}
              />

              <div>
                <label className="block text-xs font-medium text-[#A5A2B4] mb-1.5">
                  Category Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AgentCategory)}
                  className="w-full bg-[#09090D] text-[#F4F2FA] text-xs rounded-xl border border-[#292936] p-2.5 focus:outline-none focus:border-[#A78BFA]"
                >
                  <option value="development">Development</option>
                  <option value="research">Research</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                  <option value="productivity">Productivity</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#292936] flex justify-end">
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />} onClick={handleNextFromStep1}>
                Continue to Instructions
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: INSTRUCTIONS */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#F4F2FA]">Step 2: System Instructions & Directives</h2>
              <p className="text-xs text-[#A5A2B4] mt-1">
                Fine-tune how the agent executes tasks. Editing this copy will not modify the original marketplace template.
              </p>
            </div>

            {/* Instruction Guidance Box */}
            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#777487] space-y-1.5">
              <div className="text-[#A78BFA] font-medium flex items-center gap-1.5">
                <Info size={13} />
                <span>Prompt Architecture Guidelines:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#A5A2B4] pl-5 list-disc">
                <li><strong>Role & Objective:</strong> Clearly describe its domain specialty and persona.</li>
                <li><strong>Constraints:</strong> Specify what it must NOT do (e.g. read-only, no merge rights).</li>
                <li><strong>Output Format:</strong> Define exact Markdown, JSON, or tabular structure expected.</li>
              </ul>
            </div>

            <Textarea
              label="System Instructions"
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                setValidationError('');
              }}
              rows={8}
              className="font-mono text-xs"
              required
            />

            <div className="pt-4 border-t border-[#292936] flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />} onClick={handleNextFromStep2}>
                Continue to Knowledge
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: KNOWLEDGE */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#F4F2FA]">Step 3: Grounding Knowledge Sources</h2>
              <p className="text-xs text-[#A5A2B4] mt-1">
                Select existing documents or project notes from your workspace for grounded retrieval.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#777487]">
              <span>Template Requirement: </span>
              <strong className="text-[#F4F2FA]">{template.knowledgeRequirements}</strong>
            </div>

            {availableKnowledge.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#09090D] border border-[#292936] space-y-2">
                <Database size={24} className="mx-auto text-[#777487]" />
                <div className="text-xs font-semibold text-[#F4F2FA]">No knowledge sources in workspace</div>
                <p className="text-xs text-[#777487]">
                  You can proceed without knowledge now and attach documents later from the Knowledge page.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableKnowledge.map((item) => {
                  const isSelected = selectedKnowledgeIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleKnowledge(item.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                          : 'bg-[#09090D] border-[#292936] text-[#A5A2B4] hover:border-[#3D3D4E]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[#F4F2FA]">{item.name}</div>
                        <div className="text-[11px] text-[#777487]">
                          {item.type} · Status: {item.status}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[#A78BFA] border-[#A78BFA] text-[#09090D]'
                            : 'border-[#292936]'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-4 border-t border-[#292936] flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />} onClick={() => setCurrentStep(4)}>
                Continue to Tools
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: TOOLS & INTEGRATIONS */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#F4F2FA]">Step 4: Tools & Connected Integrations</h2>
              <p className="text-xs text-[#A5A2B4] mt-1">
                Whitelist specific tools the agent is permitted to execute. Unchecked tools cannot be called.
              </p>
            </div>

            {/* Tools Whitelist Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#F4F2FA]">
                Whitelisted Tools ({selectedTools.length} enabled)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[...template.requiredTools, ...template.optionalTools].map((tool) => {
                  const isSelected = selectedTools.includes(tool);

                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                          : 'bg-[#09090D] border-[#292936] text-[#777487]'
                      }`}
                    >
                      <span className="truncate">{tool}</span>
                      {isSelected && <Check size={13} className="text-[#65D6A3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Integrations Connection Status */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[#F4F2FA]">
                External Integration Requirements
              </label>
              {template.requiredIntegrations.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#65D6A3]">
                  ✓ This agent runs entirely within the local sandbox; no external OAuth required.
                </div>
              ) : (
                <div className="space-y-2">
                  {template.requiredIntegrations.map((intReq) => {
                    const matchedInt = availableIntegrations.find((i) =>
                      intReq.toLowerCase().includes(i.name.toLowerCase())
                    );
                    const isConnected = matchedInt?.status === 'connected';

                    return (
                      <div
                        key={intReq}
                        className="p-3 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#F4F2FA]">{intReq}</div>
                          <div className="text-[11px] text-[#777487]">
                            {isConnected
                              ? 'Authorized in workspace.'
                              : 'Not connected. You can still save this agent as a draft.'}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isConnected
                              ? 'text-[#65D6A3] bg-[#65D6A3]/10 border-[#65D6A3]/20'
                              : 'text-[#F2C879] bg-[#F2C879]/10 border-[#F2C879]/20'
                          }`}
                        >
                          {isConnected ? 'Connected' : 'Setup Later'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#292936] flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />} onClick={() => setCurrentStep(5)}>
                Continue to Governance
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: PERMISSIONS & OPERATING MODE */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#F4F2FA]">Step 5: Governance & Review Barrier</h2>
              <p className="text-xs text-[#A5A2B4] mt-1">
                Configure execution boundaries and human authorization gates for consequential actions.
              </p>
            </div>

            {/* Operating Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#F4F2FA]">Operating Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOperatingMode('manual');
                    setHumanApprovalRequired(true);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    operatingMode === 'manual'
                      ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                      : 'bg-[#09090D] border-[#292936] text-[#777487]'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">Manual</div>
                  <div className="text-[11px] leading-relaxed">
                    Operates solely when triggered on-demand by the operator.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOperatingMode('approval_required');
                    setHumanApprovalRequired(true);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    operatingMode === 'approval_required'
                      ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                      : 'bg-[#09090D] border-[#292936] text-[#777487]'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">Approval Required</div>
                  <div className="text-[11px] leading-relaxed">
                    Automated analysis with hard pause on any external transmission.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOperatingMode('automated');
                    setHumanApprovalRequired(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    operatingMode === 'automated'
                      ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                      : 'bg-[#09090D] border-[#292936] text-[#777487]'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">Scheduled</div>
                  <div className="text-[11px] leading-relaxed">
                    Cron trigger: {template.suggestedSchedule}
                  </div>
                </button>
              </div>
            </div>

            {/* Consequential Action Barrier Switch */}
            <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-[#F2C879] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-[#F4F2FA]">
                    Consequential Action Authorization Barrier
                  </div>
                  <div className="text-[11px] text-[#777487] mt-0.5 leading-relaxed">
                    Require manual approval before dispatching emails, posting PR reviews, or modifying data.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHumanApprovalRequired(!humanApprovalRequired)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  humanApprovalRequired ? 'bg-[#A78BFA]' : 'bg-[#292936]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    humanApprovalRequired ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Initial Activation Status */}
            <div>
              <label className="block text-xs font-medium text-[#A5A2B4] mb-1.5">
                Initial Deployment Status
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInitialStatus('active')}
                  className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                    initialStatus === 'active'
                      ? 'bg-[#65D6A3]/15 text-[#65D6A3] border-[#65D6A3]/30 font-semibold'
                      : 'bg-[#09090D] text-[#777487] border-[#292936]'
                  }`}
                >
                  Active (Ready for triggers)
                </button>
                <button
                  type="button"
                  onClick={() => setInitialStatus('draft')}
                  className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                    initialStatus === 'draft'
                      ? 'bg-[#171720] text-[#F4F2FA] border-[#A78BFA] font-semibold'
                      : 'bg-[#09090D] text-[#777487] border-[#292936]'
                  }`}
                >
                  Draft (Staged for review)
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#292936] flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)}>
                Back
              </Button>
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />} onClick={() => setCurrentStep(6)}>
                Review Configuration
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & CREATE */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#F4F2FA]">Step 6: Review & Finalize Draft</h2>
              <p className="text-xs text-[#A5A2B4] mt-1">
                Verify the configured boundaries before saving your specialist agent to the workspace.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#777487]">Agent Name:</span>
                  <span className="font-semibold text-[#F4F2FA]">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777487]">Source Blueprint:</span>
                  <span className="font-mono text-[#A78BFA]">{template.name} (v{template.version})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777487]">Category:</span>
                  <span className="capitalize text-[#F4F2FA]">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777487]">Operating Mode:</span>
                  <span className="capitalize text-[#F4F2FA]">{operatingMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777487]">Consequential Approval Barrier:</span>
                  <span className={humanApprovalRequired ? 'text-[#65D6A3] font-semibold' : 'text-[#777487]'}>
                    {humanApprovalRequired ? 'Enforced' : 'Autonomous'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-1.5">
                <div className="font-semibold text-[#F4F2FA]">Whitelisted Tools ({selectedTools.length}):</div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedTools.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171720] border border-[#292936] text-[#A5A2B4]"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090D] border border-[#292936] space-y-1.5">
                <div className="font-semibold text-[#F4F2FA]">System Directives:</div>
                <p className="text-[11px] font-mono text-[#A5A2B4] line-clamp-3 leading-relaxed">
                  {instructions}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#292936] flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(5)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<CheckCircle2 size={15} />}
                isLoading={isSubmitting}
                onClick={handleFinalSubmit}
              >
                Create Agent
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
