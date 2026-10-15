import React, { useState, useEffect } from 'react';
import { Agent } from '../../types/app';
import { StatusBadge } from '../../design-system/StatusBadge';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Textarea } from '../../design-system/Textarea';
import { useToast } from '../../design-system/Toast';
import { appStateService } from '../../services/appStateService';
import {
  X,
  Compass,
  Code2,
  BookOpen,
  Server,
  Sparkles,
  ShieldCheck,
  Wrench,
  Clock,
  Play,
  Pause,
  Copy,
  Trash2,
  Save,
  Terminal,
  Sliders,
} from 'lucide-react';

interface AgentDetailDrawerProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onViewTemplate?: (templateId: string) => void;
  onOpenBuilder?: (agent: Agent) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Code2,
  BookOpen,
  Server,
  Sparkles,
};

export const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({
  agent,
  isOpen,
  onClose,
  onUpdate,
  onViewTemplate,
  onOpenBuilder,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setDescription(agent.description);
      setInstructions(agent.instructions);
    }
  }, [agent]);

  if (!isOpen || !agent) return null;

  const IconComponent = iconMap[agent.iconName] || Compass;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const updated: Agent = {
        ...agent,
        name: name.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        updatedAt: new Date().toISOString(),
      };
      appStateService.saveAgent(updated);
      setIsSaving(false);
      onUpdate();
      showToast({
        type: 'success',
        title: 'Agent Updated',
        message: `${updated.name} configuration saved.`,
      });
    }, 400);
  };

  const handleTogglePause = () => {
    appStateService.toggleAgentPause(agent.id);
    onUpdate();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-[#111118] border-l border-[#292936] h-full flex flex-col p-6 sm:p-8 overflow-y-auto shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#292936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center">
              <IconComponent size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-[#777487] bg-[#171720] px-2 py-0.5 rounded border border-[#292936]">
                  {agent.category}
                </span>
                <StatusBadge status={agent.status} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              leftIcon={agent.status === 'paused' ? <Play size={12} /> : <Pause size={12} />}
              onClick={handleTogglePause}
            >
              {agent.status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
              aria-label="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Source Template Reference Banner */}
        {agent.sourceTemplateId && (
          <div className="p-3 mb-5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BookOpen size={13} className="text-[#A78BFA]" />
              <span className="text-[#777487]">Source Blueprint:</span>
              <span className="font-semibold text-[#F4F2FA]">{agent.sourceTemplateName}</span>
              {agent.sourceTemplateVersion && (
                <span className="text-[10px] font-mono text-[#777487]">v{agent.sourceTemplateVersion}</span>
              )}
            </div>
            {onViewTemplate && (
              <button
                type="button"
                onClick={() => {
                  onViewTemplate(agent.sourceTemplateId!);
                  onClose();
                }}
                className="text-[11px] text-[#A78BFA] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View blueprint</span>
              </button>
            )}
          </div>
        )}

        {/* Form & Specs */}
        <form onSubmit={handleSave} className="space-y-5 text-xs flex-1">
          <Input
            label="Agent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <Textarea
            label="Directives & System Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
          />

          {/* Tools Whitelist */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#F4F2FA] flex items-center gap-1.5">
              <Wrench size={13} className="text-[#A78BFA]" />
              <span>Approved Tool Whitelist ({agent.tools.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#09090D] border border-[#292936]">
              {agent.tools.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#171720] border border-[#292936] text-[#A5A2B4]"
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>

          {/* Execution Cadence & Gate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
              <span className="text-[10px] text-[#777487] block uppercase font-mono">Trigger</span>
              <span className="text-xs font-semibold text-[#F4F2FA] block mt-0.5">
                {agent.triggerType === 'scheduled'
                  ? agent.schedule || 'Scheduled'
                  : agent.triggerType === 'webhook'
                  ? 'Inbound Webhook'
                  : 'Manual Trigger'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936]">
              <span className="text-[10px] text-[#777487] block uppercase font-mono">Review Gate</span>
              <span className="text-xs font-semibold text-[#65D6A3] block mt-0.5 flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>{agent.humanApprovalRequired ? 'Human Barrier Enforced' : 'Autonomous'}</span>
              </span>
            </div>
          </div>

          {agent.lastRunAt && (
            <div className="p-3 rounded-xl bg-[#09090D] border border-[#292936] text-[11px] text-[#777487] flex items-center justify-between">
              <span>Last Execution Run:</span>
              <span className="font-mono text-[#F4F2FA]">
                {new Date(agent.lastRunAt).toLocaleString()}
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-[#292936] flex items-center justify-between gap-2">
            <div>
              {onOpenBuilder && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBuilder(agent);
                  }}
                  leftIcon={<Sliders size={13} className="text-[#A78BFA]" />}
                >
                  Advanced Builder
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<Save size={13} />} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
