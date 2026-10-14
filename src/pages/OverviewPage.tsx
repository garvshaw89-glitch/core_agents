import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Button } from '../design-system/Button';
import { AgentCard } from '../design-system/AgentCard';
import { ActivityItem } from '../design-system/ActivityItem';
import { EmptyState } from '../design-system/EmptyState';
import { appStateService } from '../services/appStateService';
import { Agent, ActivityRecord } from '../types/app';
import {
  Plus,
  ArrowRight,
  Layers,
  Activity as ActivityIcon,
  GitFork,
  CheckCircle2,
  Sparkles,
  Bot,
  SlidersHorizontal,
  History,
} from 'lucide-react';

interface OverviewPageProps {
  onCreateAgent: (initialPrompt?: string) => void;
  onExploreTemplates: () => void;
  onOpenAgent: (agent: Agent) => void;
  onOpenActivity: (activity: ActivityRecord) => void;
  onNavigateToAgents: () => void;
  onNavigateToWorkflows: () => void;
  onNavigateToActivity: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onCreateAgent,
  onExploreTemplates,
  onOpenAgent,
  onOpenActivity,
  onNavigateToAgents,
  onNavigateToWorkflows,
  onNavigateToActivity,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [workflowsCount, setWorkflowsCount] = useState<number>(0);
  const [isZeroMode, setIsZeroMode] = useState<boolean>(appStateService.isZeroState());

  const loadData = () => {
    setAgents(appStateService.getAgents());
    setActivities(appStateService.getActivities());
    setWorkflowsCount(appStateService.getWorkflows().length);
    setIsZeroMode(appStateService.isZeroState());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onCreateAgent(promptInput.trim());
    } else {
      onCreateAgent();
    }
  };

  const handleToggleZeroState = () => {
    const next = !isZeroMode;
    appStateService.setZeroStateMode(next);
    setIsZeroMode(next);
    loadData();
  };

  const activeAgentsCount = agents.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-150">
      {/* Header */}
      <PageHeader
        title="Overview"
        description="Your workspace for building and managing AI agents."
        actions={
          <div className="flex items-center gap-2">
            {/* Zero state preview toggle */}
            <button
              type="button"
              onClick={handleToggleZeroState}
              className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isZeroMode
                  ? 'bg-[#A78BFA]/15 text-[#C4B5FD] border-[#A78BFA]/30'
                  : 'bg-[#171720] text-[#777487] border-[#292936] hover:text-[#A5A2B4]'
              }`}
              title="Toggle between populated test fixtures and honest zero-state"
            >
              <SlidersHorizontal size={12} />
              <span>{isZeroMode ? 'Viewing Zero State' : 'Populated Fixtures'}</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => onCreateAgent()}
            >
              Create agent
            </Button>
          </div>
        }
      />

      {/* Welcome Area: Prominent Input-Style Interaction */}
      <div className="p-6 rounded-2xl bg-[#111118] border border-[#292936] shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A78BFA]">
            <Sparkles size={13} />
            <span>START A NEW AGENT WORKFLOW</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F4F2FA]">
            What would you like your agents to help you accomplish?
          </h2>
          <p className="text-xs text-[#A5A2B4]">
            Describe an objective, or select a bounded specialist blueprint to configure tools and human review gates.
          </p>

          <form onSubmit={handlePromptSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. Audit competitor changelogs every Monday and draft a cited brief..."
                className="flex-1 bg-[#09090D] text-[#F4F2FA] placeholder-[#777487] text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#292936] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] focus:outline-none transition-all"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight size={14} />}
              >
                Configure agent
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Summary Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={onNavigateToAgents}
          className="p-4 rounded-xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#777487] mb-2">
            <span>Total agents</span>
            <Bot size={15} className="text-[#A78BFA]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F2FA] font-mono tabular-nums">
            {agents.length}
          </div>
          <div className="text-[11px] text-[#777487] mt-1">Configured in workspace</div>
        </div>

        <div
          onClick={onNavigateToAgents}
          className="p-4 rounded-xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#777487] mb-2">
            <span>Active agents</span>
            <CheckCircle2 size={15} className="text-[#65D6A3]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F2FA] font-mono tabular-nums">
            {activeAgentsCount}
          </div>
          <div className="text-[11px] text-[#777487] mt-1">
            {activeAgentsCount === 1 ? '1 agent running' : `${activeAgentsCount} agents running`}
          </div>
        </div>

        <div
          onClick={onNavigateToWorkflows}
          className="p-4 rounded-xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#777487] mb-2">
            <span>Workflow count</span>
            <GitFork size={15} className="text-[#A78BFA]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F2FA] font-mono tabular-nums">
            {workflowsCount}
          </div>
          <div className="text-[11px] text-[#777487] mt-1">Multi-stage pipelines</div>
        </div>

        <div
          onClick={onNavigateToActivity}
          className="p-4 rounded-xl bg-[#111118] border border-[#292936] hover:border-[#3D3D4E] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#777487] mb-2">
            <span>Recent executions</span>
            <ActivityIcon size={15} className="text-[#F2C879]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F2FA] font-mono tabular-nums">
            {activities.length}
          </div>
          <div className="text-[11px] text-[#777487] mt-1">Logged trace runs</div>
        </div>
      </div>

      {/* My Agents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F4F2FA]">My Agents</h2>
            <p className="text-xs text-[#777487]">Recently configured and running specialists</p>
          </div>
          {agents.length > 0 && (
            <button
              type="button"
              onClick={onNavigateToAgents}
              className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors cursor-pointer"
            >
              View all agents &rarr;
            </button>
          )}
        </div>

        {agents.length === 0 ? (
          <EmptyState
            icon={<Bot size={24} />}
            title="No agents yet."
            description="Create your first specialist agent or start from a pre-configured template."
            primaryAction={{
              label: 'Create agent',
              onClick: () => onCreateAgent(),
              icon: <Plus size={14} />,
            }}
            secondaryAction={{
              label: 'Explore templates',
              onClick: onExploreTemplates,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.slice(0, 3).map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onOpen={onOpenAgent}
                onTogglePause={() => {
                  appStateService.toggleAgentPause(agent.id);
                  loadData();
                }}
                onDuplicate={() => {
                  appStateService.duplicateAgent(agent.id);
                  loadData();
                }}
                onArchive={() => {
                  appStateService.deleteAgent(agent.id);
                  loadData();
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F4F2FA]">Recent Activity</h2>
            <p className="text-xs text-[#777487]">Trace logs, approval requests, and trigger events</p>
          </div>
          {activities.length > 0 && (
            <button
              type="button"
              onClick={onNavigateToActivity}
              className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors cursor-pointer"
            >
              View full activity trace &rarr;
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <EmptyState
            icon={<History size={24} />}
            title="No activity recorded"
            description="Your activity will appear here when you start working with agents."
          />
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onOpenDetails={onOpenActivity}
                onApprove={(id) => {
                  appStateService.approveActivity(id);
                  loadData();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
