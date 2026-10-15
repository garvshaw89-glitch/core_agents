import React, { useState, useMemo } from 'react';
import { Agent, AgentStructuredInstructions } from '../../types/app';
import { Button } from '../../design-system/Button';
import { ConfirmationDialog } from '../../design-system/ConfirmationDialog';
import { STARTER_INSTRUCTION_BLOCKS, StarterBlock } from '../../data/instructionBlocks';
import {
  Sparkles,
  BookOpen,
  FileCode,
  Shield,
  Layers,
  ArrowRight,
  Eye,
  Check,
  RotateCcw,
  Plus,
  HelpCircle,
  Copy,
  Terminal,
} from 'lucide-react';

interface BuilderInstructionsSectionProps {
  agent: Agent;
  onChange: (updates: Partial<Agent>) => void;
}

export const BuilderInstructionsSection: React.FC<BuilderInstructionsSectionProps> = ({
  agent,
  onChange,
}) => {
  // Mode: 'structured' | 'raw_unified'
  const [editorMode, setEditorMode] = useState<'structured' | 'raw_unified'>('structured');
  const [activeTab, setActiveTab] = useState<'role' | 'procedure' | 'constraints' | 'output'>('role');
  const [showStarterLibrary, setShowStarterLibrary] = useState(false);
  const [starterBlockToInsert, setStarterBlockToInsert] = useState<StarterBlock | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const structured: AgentStructuredInstructions = agent.structuredInstructions || {
    role: '',
    primaryObjective: '',
    context: '',
    operatingProcedure: '',
    constraints: '',
    expectedOutput: '',
  };

  // Compile structured fields into a coherent effective prompt
  const compiledInstructions = useMemo(() => {
    if (editorMode === 'raw_unified') {
      return agent.instructions || '';
    }

    const sections: string[] = [];

    if (structured.role?.trim()) {
      sections.push(`### ROLE & IDENTITY\n${structured.role.trim()}`);
    }
    if (structured.primaryObjective?.trim()) {
      sections.push(`### PRIMARY OBJECTIVE\n${structured.primaryObjective.trim()}`);
    }
    if (structured.context?.trim()) {
      sections.push(`### CONTEXT & SCOPE\n${structured.context.trim()}`);
    }
    if (structured.operatingProcedure?.trim()) {
      sections.push(`### OPERATING PROCEDURE\n${structured.operatingProcedure.trim()}`);
    }
    if (structured.constraints?.trim()) {
      sections.push(`### CONSTRAINTS & PROHIBITED ACTIONS\n${structured.constraints.trim()}`);
    }
    if (structured.expectedOutput?.trim()) {
      sections.push(`### EXPECTED OUTPUT FORMAT\n${structured.expectedOutput.trim()}`);
    }

    // If structured fields are all empty but agent.instructions has legacy text, fallback to agent.instructions
    if (sections.length === 0 && agent.instructions?.trim()) {
      return agent.instructions.trim();
    }

    return sections.join('\n\n');
  }, [structured, agent.instructions, editorMode]);

  // Handle updates to structured fields
  const handleUpdateStructured = (field: keyof AgentStructuredInstructions, value: string) => {
    const updatedStructured = {
      ...structured,
      [field]: value,
    };

    // Recompile into instructions
    const sections: string[] = [];
    if (updatedStructured.role?.trim()) sections.push(`### ROLE & IDENTITY\n${updatedStructured.role.trim()}`);
    if (updatedStructured.primaryObjective?.trim()) sections.push(`### PRIMARY OBJECTIVE\n${updatedStructured.primaryObjective.trim()}`);
    if (updatedStructured.context?.trim()) sections.push(`### CONTEXT & SCOPE\n${updatedStructured.context.trim()}`);
    if (updatedStructured.operatingProcedure?.trim()) sections.push(`### OPERATING PROCEDURE\n${updatedStructured.operatingProcedure.trim()}`);
    if (updatedStructured.constraints?.trim()) sections.push(`### CONSTRAINTS & PROHIBITED ACTIONS\n${updatedStructured.constraints.trim()}`);
    if (updatedStructured.expectedOutput?.trim()) sections.push(`### EXPECTED OUTPUT FORMAT\n${updatedStructured.expectedOutput.trim()}`);

    const newCompiled = sections.join('\n\n');

    onChange({
      structuredInstructions: updatedStructured,
      instructions: newCompiled,
    });
  };

  const handleUpdateRaw = (rawText: string) => {
    onChange({
      instructions: rawText,
    });
  };

  // Starter block insertion confirmation
  const handleConfirmInsertBlock = () => {
    if (!starterBlockToInsert) return;

    if (editorMode === 'structured') {
      const field = starterBlockToInsert.targetField;
      const existingVal = structured[field] || '';
      const newVal = existingVal.trim() ? `${existingVal.trim()}\n\n${starterBlockToInsert.content}` : starterBlockToInsert.content;
      handleUpdateStructured(field, newVal);
    } else {
      const current = agent.instructions || '';
      const newVal = current.trim() ? `${current.trim()}\n\n${starterBlockToInsert.content}` : starterBlockToInsert.content;
      handleUpdateRaw(newVal);
    }

    setStarterBlockToInsert(null);
    setShowStarterLibrary(false);
  };

  // Calculate metrics
  const activeText = editorMode === 'raw_unified' ? agent.instructions || '' : compiledInstructions;
  const wordCount = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
  const charCount = activeText.length;

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-0 duration-150">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-[#A78BFA] font-semibold">
            Section 02 · Instruction Architecture
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#F4F2FA] mt-1">
            System Instructions & Guardrails
          </h2>
          <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">
            Construct the prompt architecture that drives agent reasoning, operating protocol, and strict safety limits.
          </p>
        </div>

        {/* View Mode Toggle & Starter blocks action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#111118] border border-[#292936] rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setEditorMode('structured')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                editorMode === 'structured'
                  ? 'bg-[#171720] text-[#F4F2FA] shadow-xs'
                  : 'text-[#777487] hover:text-[#A5A2B4]'
              }`}
            >
              Structured Fields
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('raw_unified')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                editorMode === 'raw_unified'
                  ? 'bg-[#171720] text-[#F4F2FA] shadow-xs'
                  : 'text-[#777487] hover:text-[#A5A2B4]'
              }`}
            >
              Raw Prompt
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={13} className="text-[#A78BFA]" />}
            onClick={() => setShowStarterLibrary(!showStarterLibrary)}
          >
            <span>Starter Blocks</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Eye size={13} />}
            onClick={() => setShowPreviewModal(true)}
          >
            <span>Preview Prompt</span>
          </Button>
        </div>
      </div>

      {/* Insertable Starter Blocks Tray */}
      {showStarterLibrary && (
        <div className="p-5 rounded-2xl bg-[#111118] border border-[#A78BFA]/40 space-y-4 animate-in fade-in-0 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#A78BFA]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F2FA]">
                Insert Verified Instruction Block
              </h3>
            </div>
            <span className="text-[11px] text-[#777487]">Click any block to insert into editor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STARTER_INSTRUCTION_BLOCKS.map((block) => (
              <div
                key={block.id}
                onClick={() => setStarterBlockToInsert(block)}
                className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] hover:border-[#A78BFA] transition-all cursor-pointer group text-left space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#171720] text-[#A78BFA]">
                    {block.categoryLabel}
                  </span>
                  <Plus size={13} className="text-[#777487] group-hover:text-[#A78BFA] transition-colors" />
                </div>
                <div className="text-xs font-semibold text-[#F4F2FA] group-hover:text-white">
                  {block.title}
                </div>
                <div className="text-[11px] text-[#777487] line-clamp-2 leading-relaxed">
                  {block.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] space-y-6">
        {editorMode === 'structured' ? (
          <>
            {/* Structured Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#292936] pb-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'role', label: '1. Role & Identity', hasValue: Boolean(structured.role?.trim()) },
                { id: 'procedure', label: '2. Operating Procedure', hasValue: Boolean(structured.operatingProcedure?.trim()) },
                { id: 'constraints', label: '3. Constraints & Prohibitions', hasValue: Boolean(structured.constraints?.trim()) },
                { id: 'output', label: '4. Expected Output Format', hasValue: Boolean(structured.expectedOutput?.trim()) },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#171720] text-[#F4F2FA] border border-[#292936]'
                        : 'text-[#777487] hover:text-[#A5A2B4]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.hasValue && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#65D6A3]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Role & Identity */}
            {activeTab === 'role' && (
              <div className="space-y-4 animate-in fade-in-0 duration-150">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F2FA]">
                      Role & Persona Definition
                    </label>
                    <span className="text-[11px] text-[#777487]">
                      Who is this agent and what perspective does it adopt?
                    </span>
                  </div>
                  <textarea
                    value={structured.role || ''}
                    onChange={(e) => handleUpdateStructured('role', e.target.value)}
                    placeholder="e.g. You are a Senior Market Intelligence Specialist. You analyze competitor changelogs and identify feature additions with verifiable citations..."
                    rows={4}
                    className="w-full p-3.5 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-y font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F2FA]">
                      Primary Objective
                    </label>
                    <span className="text-[11px] text-[#777487]">Specific deliverable or key mission</span>
                  </div>
                  <textarea
                    value={structured.primaryObjective || ''}
                    onChange={(e) => handleUpdateStructured('primaryObjective', e.target.value)}
                    placeholder="e.g. Deliver an executive weekly digest clustering competitor capability updates into strategic product roadmap categories..."
                    rows={2}
                    className="w-full p-3 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-y font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F2FA]">
                      Operational Context (Optional)
                    </label>
                    <span className="text-[11px] text-[#777487]">Domain assumptions or business background</span>
                  </div>
                  <textarea
                    value={structured.context || ''}
                    onChange={(e) => handleUpdateStructured('context', e.target.value)}
                    placeholder="e.g. Target audience consists of engineering leads and product managers seeking to understand architectural trends..."
                    rows={2}
                    className="w-full p-3 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-y font-mono"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Operating Procedure */}
            {activeTab === 'procedure' && (
              <div className="space-y-4 animate-in fade-in-0 duration-150">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F2FA]">
                      Step-by-Step Execution Workflow
                    </label>
                    <span className="text-[11px] text-[#777487]">
                      Sequential execution steps to enforce deterministic agent behavior
                    </span>
                  </div>
                  <textarea
                    value={structured.operatingProcedure || ''}
                    onChange={(e) => handleUpdateStructured('operatingProcedure', e.target.value)}
                    placeholder="1. Ingest changelog entries from configured source URLs.&#10;2. Extract concrete functional updates and discard corporate promotional adjectives.&#10;3. Cross-verify quotes against original text using the Citation Verifier.&#10;4. Synthesize final brief."
                    rows={8}
                    className="w-full p-3.5 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-y font-mono"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Constraints & Guardrails */}
            {activeTab === 'constraints' && (
              <div className="space-y-4 animate-in fade-in-0 duration-150">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F2FA]">
                      Constraints & Prohibited Operations
                    </label>
                    <span className="text-[11px] text-[#F2C879]">
                      Defines hard boundaries to prevent unauthorized actions and hallucinations
                    </span>
                  </div>
                  <textarea
                    value={structured.constraints || ''}
                    onChange={(e) => handleUpdateStructured('constraints', e.target.value)}
                    placeholder="• You are strictly prohibited from pushing commits or merging PRs.&#10;• Do not speculate or invent unverified statistics. If an assertion lacks citation, mark it as 'unverified'.&#10;• Stage all external notifications for human review."
                    rows={8}
                    className="w-full p-3.5 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-y font-mono"
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Expected Output Format */}
            {activeTab === 'output' && (
              <div className="space-y-4 animate-in fade-in-0 duration-150">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F2FA]">
                      Expected Deliverable Schema
                    </label>
                    <span className="text-[11px] text-[#777487]">
                      Format contract (Markdown structure, JSON schema, or review template)
                    </span>
                  </div>
                  <textarea
                    value={structured.expectedOutput || ''}
                    onChange={(e) => handleUpdateStructured('expectedOutput', e.target.value)}
                    placeholder="# Executive Summary&#10;[Overview]&#10;&#10;## Verified Updates&#10;| Date | Feature | Citation URL |&#10;| --- | --- | --- |"
                    rows={8}
                    className="w-full p-3.5 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] leading-relaxed resize-y font-mono"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          /* Raw Unified Textarea Mode */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F4F2FA]">
                Unified Prompt Editor
              </label>
              <span className="text-[11px] text-[#777487]">Direct multiline instruction text</span>
            </div>
            <textarea
              value={agent.instructions || ''}
              onChange={(e) => handleUpdateRaw(e.target.value)}
              placeholder="Enter complete system instructions..."
              rows={14}
              className="w-full p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] placeholder-[#777487] focus:outline-none focus:border-[#A78BFA] font-mono leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Word and Character Count Strip */}
        <div className="pt-3 border-t border-[#292936]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#777487]">
          <div className="flex items-center gap-4">
            <span>Words: <strong className="text-[#F4F2FA] font-mono">{wordCount}</strong></span>
            <span>Characters: <strong className="text-[#F4F2FA] font-mono">{charCount}</strong></span>
            <span>Estimated Prompt Tokens: <strong className="text-[#A78BFA] font-mono">~{Math.round(charCount / 4)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#65D6A3]">✓ Auto-synchronized with agent schema</span>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Inserting Starter Block */}
      <ConfirmationDialog
        isOpen={starterBlockToInsert !== null}
        onClose={() => setStarterBlockToInsert(null)}
        onConfirm={handleConfirmInsertBlock}
        title={`Insert "${starterBlockToInsert?.title}"?`}
        message={`This will append the ${starterBlockToInsert?.categoryLabel.toLowerCase()} block into your agent configuration.`}
        confirmLabel="Insert Block"
        variant="primary"
      />

      {/* Compiled Prompt Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-150">
          <div className="bg-[#111118] border border-[#292936] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#292936] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-[#A78BFA]" />
                <h3 className="text-sm font-bold text-[#F4F2FA]">
                  Effective Prompt Compilation Preview
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="p-3 rounded-xl bg-[#171720] border border-[#292936] text-xs text-[#A5A2B4] space-y-1">
                <span className="font-semibold text-[#F4F2FA]">Compilation Contract:</span>
                <p>
                  This preview renders the combined instruction payload that will be delivered to the selected model provider during agent runtime execution.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#777487]">
                  <span className="font-mono">COMPILED SYSTEM PROMPT</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(compiledInstructions)}
                    className="text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#09090D] border border-[#292936] text-xs text-[#F4F2FA] font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {compiledInstructions || '// No instructions configured yet.'}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-[#292936] flex items-center justify-end">
              <Button variant="primary" size="sm" onClick={() => setShowPreviewModal(false)}>
                Done Reviewing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
