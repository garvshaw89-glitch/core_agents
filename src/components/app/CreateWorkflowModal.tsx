import React, { useState, useEffect } from 'react';
import { Workflow, Agent } from '../../types/app';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Textarea } from '../../design-system/Textarea';
import { X, GitFork, ArrowRight, Shield, Clock, Webhook, Play } from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: Workflow) => void;
  availableAgents: Agent[];
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableAgents,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'schedule' | 'webhook' | 'manual'>('schedule');
  const [schedule, setSchedule] = useState('Every Monday @ 08:00 UTC');
  const [selectedAgentId, setSelectedAgentId] = useState(availableAgents[0]?.id || '');
  const [approvalRequired, setApprovalRequired] = useState(true);

  useEffect(() => {
    if (availableAgents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(availableAgents[0].id);
    }
  }, [availableAgents, selectedAgentId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedAgent = availableAgents.find((a) => a.id === selectedAgentId);

    const newWorkflow: Workflow = {
      id: `wf-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      description: description.trim() || 'Custom automated agent pipeline.',
      status: 'active',
      triggerType,
      schedule: triggerType === 'schedule' ? schedule : undefined,
      agentId: selectedAgentId,
      agentName: selectedAgent ? selectedAgent.name : 'Unassigned Agent',
      stepsCount: 4,
      approvalRequired,
      createdAt: new Date().toISOString(),
    };

    onSave(newWorkflow);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-[#111118] border border-[#292936] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left"
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

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#171720] border border-[#292936] text-[#A78BFA] flex items-center justify-center">
            <GitFork size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F4F2FA]">Create New Workflow</h3>
            <p className="text-xs text-[#777487]">Connect an execution trigger, assigned agent, and review gate.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Workflow Name"
            placeholder="e.g. Weekly Security Advisory Digest"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Workflow Purpose & Objectives"
            placeholder="Describe what triggers this workflow and what output is expected..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          {/* Trigger selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A5A2B4]">Trigger Mechanism</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTriggerType('schedule')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  triggerType === 'schedule'
                    ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                    : 'bg-[#09090D] border-[#292936] text-[#777487]'
                }`}
              >
                <Clock size={14} className="mb-1 text-[#A78BFA]" />
                <div className="font-semibold">Scheduled</div>
                <div className="text-[10px]">Cron recurrence</div>
              </button>

              <button
                type="button"
                onClick={() => setTriggerType('webhook')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  triggerType === 'webhook'
                    ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                    : 'bg-[#09090D] border-[#292936] text-[#777487]'
                }`}
              >
                <Webhook size={14} className="mb-1 text-[#65D6A3]" />
                <div className="font-semibold">Webhook</div>
                <div className="text-[10px]">Event triggered</div>
              </button>

              <button
                type="button"
                onClick={() => setTriggerType('manual')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                  triggerType === 'manual'
                    ? 'bg-[#171720] border-[#A78BFA] text-[#F4F2FA]'
                    : 'bg-[#09090D] border-[#292936] text-[#777487]'
                }`}
              >
                <Play size={14} className="mb-1 text-[#F2C879]" />
                <div className="font-semibold">Manual</div>
                <div className="text-[10px]">On-demand run</div>
              </button>
            </div>
          </div>

          {triggerType === 'schedule' && (
            <Input
              label="Schedule Specification"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="e.g. Every Monday @ 08:00 UTC or Daily @ 00:00 UTC"
            />
          )}

          {/* Agent Assignment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A5A2B4]">Assigned Specialist Agent</label>
            {availableAgents.length === 0 ? (
              <p className="text-xs text-[#F2C879]">No agents found. Please create an agent first.</p>
            ) : (
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full bg-[#09090D] text-[#F4F2FA] text-xs rounded-xl border border-[#292936] p-2.5 focus:outline-none focus:border-[#A78BFA]"
              >
                {availableAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Approval Barrier */}
          <div className="p-3.5 rounded-xl bg-[#09090D] border border-[#292936] flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Shield size={16} className="text-[#F2C879] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-[#F4F2FA]">Consequential Action Barrier</div>
                <div className="text-[11px] text-[#777487]">Requires human authorization before external broadcast.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setApprovalRequired(!approvalRequired)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                approvalRequired ? 'bg-[#A78BFA]' : 'bg-[#292936]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  approvalRequired ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" rightIcon={<ArrowRight size={14} />}>
              Create Workflow
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
