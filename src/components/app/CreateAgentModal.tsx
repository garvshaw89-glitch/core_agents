import React, { useState, useEffect } from 'react';
import { Agent, AgentCategory } from '../../types/app';
import { TemplateDefinition } from '../../data/templates';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Textarea } from '../../design-system/Textarea';
import { useToast } from '../../design-system/Toast';
import {
  X,
  Bot,
  Wrench,
  Check,
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  initialTemplate?: TemplateDefinition | null;
  initialPrompt?: string;
}

const AVAILABLE_TOOLS = [
  'Public Web Fetcher',
  'Citation Verifier',
  'Markdown Synthesizer',
  'Git Read-Only Client',
  'AST Code Parser',
  'Test Suite Runner',
  'Concept Map Engine',
  'Exercise Generator',
  'Progress Tracker',
  'Telemetry Query Tool',
  'Threshold Watcher',
  'HTTP Health Prober',
  'Incident Alert Staging',
];

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTemplate,
  initialPrompt,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AgentCategory>('research');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Public Web Fetcher',
    'Citation Verifier',
    'Markdown Synthesizer',
  ]);
  const [triggerType, setTriggerType] = useState<'scheduled' | 'webhook' | 'manual'>('scheduled');
  const [schedule, setSchedule] = useState('Every Monday @ 08:00 UTC');
  const [humanApprovalRequired, setHumanApprovalRequired] = useState(true);

  useEffect(() => {
    if (initialTemplate) {
      setName(initialTemplate.name);
      setCategory(initialTemplate.category);
      setDescription(initialTemplate.summary);
      setInstructions(`Execute ${initialTemplate.name} operations. Adhere strictly to verified sources and propose consequential actions for review.`);
      setSelectedTools(initialTemplate.defaultTools);
      setSchedule(initialTemplate.suggestedSchedule);
    } else if (initialPrompt) {
      setName('Custom Task Agent');
      setCategory('custom');
      setDescription(initialPrompt);
      setInstructions(`Objective: ${initialPrompt}\nExecute tasks deterministically and require review prior to external dispatch.`);
      setSelectedTools(['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer']);
    } else {
      setName('');
      setCategory('research');
      setDescription('');
      setInstructions('');
      setSelectedTools(['Public Web Fetcher', 'Citation Verifier', 'Markdown Synthesizer']);
      setSchedule('Every Monday @ 08:00 UTC');
    }
  }, [initialTemplate, initialPrompt, isOpen]);

  if (!isOpen) return null;

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
    if (!name.trim()) return;

    const newAgent: Agent = {
      id: `agent-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      description: description.trim() || 'Custom specialized agent.',
      category,
      status: 'active',
      iconName:
        category === 'research'
          ? 'Compass'
          : category === 'coding'
          ? 'Code2'
          : category === 'learning'
          ? 'BookOpen'
          : category === 'operations'
          ? 'Server'
          : 'Sparkles',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggerType,
      schedule: triggerType === 'scheduled' ? schedule : undefined,
      tools: selectedTools,
      instructions: instructions.trim() || 'Execute bounded tasks and require human approval for external actions.',
      humanApprovalRequired,
    };

    onSave(newAgent);
    showToast({
      type: 'success',
      title: 'Agent Configured',
      message: `${newAgent.name} has been added to your active workforce.`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#111118] border border-[#292936] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#292936] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F4F2FA]">Configure Specialist Agent</h3>
            <p className="text-xs text-[#777487]">Define bounded instructions, whitelisted tools, and human review gates.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Agent Name"
                placeholder="e.g. Competitive Intel Lead"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A5A2B4] mb-1.5">Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AgentCategory)}
                className="w-full bg-[#09090D] text-[#F4F2FA] text-xs rounded-xl border border-[#292936] px-3 py-2.5 focus:outline-none focus:border-[#A78BFA] cursor-pointer"
              >
                <option value="research">Research</option>
                <option value="coding">Coding</option>
                <option value="learning">Learning</option>
                <option value="operations">Operations</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Short Description"
            placeholder="Summarize what this agent does and what value it delivers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <Textarea
            label="Agent Directives & System Prompt"
            placeholder="Specify bounded rules, output formatting requirements, and citation standards..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
          />

          {/* Whitelisted Tools */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A5A2B4]">
              Whitelisted Tools ({selectedTools.length} selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_TOOLS.map((tool) => {
                const isSelected = selectedTools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left text-[11px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                        : 'bg-[#09090D] border-[#292936] text-[#777487]'
                    }`}
                  >
                    <span className="truncate">{tool}</span>
                    {isSelected && <Check size={12} className="text-[#65D6A3] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5A2B4] mb-1.5">Execution Cadence</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as any)}
                className="w-full bg-[#09090D] text-[#F4F2FA] text-xs rounded-xl border border-[#292936] px-3 py-2.5 focus:outline-none focus:border-[#A78BFA] cursor-pointer"
              >
                <option value="scheduled">Scheduled (Cron)</option>
                <option value="webhook">Inbound Webhook</option>
                <option value="manual">Manual On-Demand</option>
              </select>
            </div>

            {triggerType === 'scheduled' && (
              <div>
                <Input
                  label="Cron Recurrence"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. Every Monday @ 08:00 UTC"
                />
              </div>
            )}
          </div>

          {/* Human Review Gate Toggle */}
          <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Shield size={16} className="text-[#F2C879] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Consequential Action Barrier</div>
                <div className="text-[11px] text-[#777487]">
                  External actions (messages, code branches, email digests) pause for manual operator approval.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHumanApprovalRequired(!humanApprovalRequired)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
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

          <div className="pt-3 border-t border-[#292936] flex items-center justify-end gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" rightIcon={<ArrowRight size={14} />}>
              Save & Activate Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
