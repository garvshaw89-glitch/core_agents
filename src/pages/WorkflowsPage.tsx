import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Button } from '../design-system/Button';
import { SearchField } from '../design-system/SearchField';
import { StatusBadge } from '../design-system/StatusBadge';
import { EmptyState } from '../design-system/EmptyState';
import { CreateWorkflowModal } from '../components/app/CreateWorkflowModal';
import { ConfirmationDialog } from '../design-system/ConfirmationDialog';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { Workflow, Agent } from '../types/app';
import {
  Plus,
  GitFork,
  Clock,
  Play,
  Pause,
  Trash2,
  ShieldCheck,
  Bot,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface WorkflowsPageProps {
  onCreateAgent: () => void;
  initialStatusFilter?: string;
}

export const WorkflowsPage: React.FC<WorkflowsPageProps> = ({ onCreateAgent, initialStatusFilter }) => {
  const { showToast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter || 'all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);

  const loadData = () => {
    setWorkflows(appStateService.getWorkflows());
    setAgents(appStateService.getAgents());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialStatusFilter !== undefined) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTogglePause = (wf: Workflow) => {
    const updated = appStateService.toggleWorkflow(wf.id);
    if (updated) {
      loadData();
      showToast({
        type: 'info',
        title: updated.status === 'paused' ? 'Workflow Paused' : 'Workflow Resumed',
        message: `${wf.name} schedule is now ${updated.status}.`,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (workflowToDelete) {
      appStateService.deleteWorkflow(workflowToDelete.id);
      showToast({
        type: 'info',
        title: 'Workflow Removed',
        message: `${workflowToDelete.name} was deleted.`,
      });
      setWorkflowToDelete(null);
      loadData();
    }
  };

  const handleSaveWorkflow = (newWf: Workflow) => {
    appStateService.saveWorkflow(newWf);
    loadData();
    showToast({
      type: 'success',
      title: 'Workflow Created',
      message: `${newWf.name} is now active with ${newWf.agentName}.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="Workflows"
        description="Automate multi-stage agent execution chains with scheduled triggers and review gates."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsCreateOpen(true)}
          >
            Create workflow
          </Button>
        }
      />

      {/* Educational Banner for Workflow Orchestration */}
      <div className="p-4 rounded-xl bg-[#0D1220]/90 border border-slate-800/70 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#38D9FF]/15 text-[#38D9FF] shrink-0 border border-[#38D9FF]/20">
            <Zap size={16} />
          </div>
          <div>
            <div className="font-semibold text-[#F4F7FC]">How Workflows Connect Work</div>
            <div className="text-[#9AA7BC]">
              Trigger (Schedule / Webhook) &rarr; Specialized Agent Execution &rarr; Consequential Approval &rarr; External Action
            </div>
          </div>
        </div>
        <div className="text-[#64748B] text-[11px] shrink-0 font-mono">
          Deterministic execution · Zero hallucinations
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search workflows by title or agent..."
          />
        </div>

        <div className="w-36">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="failed">Failed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Workflows List or Empty State */}
      {workflows.length === 0 ? (
        <EmptyState
          icon={<GitFork size={24} />}
          title="No workflows created yet"
          description="Connect an execution trigger (cron or webhook), an approved agent, and a human approval barrier to automate recurring tasks."
          primaryAction={{
            label: 'Create first workflow',
            onClick: () => setIsCreateOpen(true),
            icon: <Plus size={14} />,
          }}
        />
      ) : filteredWorkflows.length === 0 ? (
        <EmptyState
          title="No matching workflows"
          description={`No workflows match "${searchQuery}".`}
          secondaryAction={{
            label: 'Clear search',
            onClick: () => setSearchQuery(''),
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              className="p-5 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 hover:border-[#38D9FF]/40 hover:bg-[#111827] transition-all text-left flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-semibold text-[#F4F7FC] group-hover:text-white">{wf.name}</h3>
                  <StatusBadge status={wf.status} size="sm" />
                  {wf.approvalRequired && (
                    <span className="flex items-center gap-1 text-[10px] text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-0.5 rounded-full border border-[#FBBF24]/20 font-mono">
                      <ShieldCheck size={11} />
                      <span>Review Gate</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#9AA7BC] line-clamp-1">{wf.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-1">
                  <span className="flex items-center gap-1 text-[#38D9FF] font-medium">
                    <Bot size={12} />
                    <span>{wf.agentName}</span>
                  </span>
                  {wf.schedule && (
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock size={11} />
                      <span>{wf.schedule}</span>
                    </span>
                  )}
                  {wf.lastExecutionAt && (
                    <span className="text-[11px] font-mono">
                      Last executed:{' '}
                      {new Date(wf.lastExecutionAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                <Button
                  variant="secondary"
                  size="xs"
                  leftIcon={wf.status === 'paused' ? <Play size={12} /> : <Pause size={12} />}
                  onClick={() => handleTogglePause(wf)}
                >
                  {wf.status === 'paused' ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<Trash2 size={12} />}
                  onClick={() => setWorkflowToDelete(wf)}
                  className="hover:text-[#FB7185] hover:border-[#FB7185]/40"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CreateWorkflowModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveWorkflow}
        availableAgents={agents}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={workflowToDelete !== null}
        onClose={() => setWorkflowToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Workflow?"
        message={`Are you sure you want to delete "${workflowToDelete?.name}"? Its automated trigger schedule will be removed.`}
        confirmLabel="Delete Workflow"
        variant="danger"
      />
    </div>
  );
};
