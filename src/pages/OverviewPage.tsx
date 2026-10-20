import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Button } from '../design-system/Button';
import { AgentCard } from '../design-system/AgentCard';
import { ActivityItem } from '../design-system/ActivityItem';
import { EmptyState } from '../design-system/EmptyState';
import { WorkflowRoutingMap } from '../components/app/WorkflowRoutingMap';
import { ActivityVolumeChart } from '../components/app/ActivityVolumeChart';
import { MetricCard } from '../design-system/MetricCard';
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
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface OverviewPageProps {
  onCreateAgent: (initialPrompt?: string) => void;
  onExploreTemplates: () => void;
  onOpenAgent: (agent: Agent) => void;
  onOpenActivity: (activity: ActivityRecord) => void;
  onNavigateToAgents: (filter?: { status?: string; category?: string; query?: string }) => void;
  onNavigateToWorkflows: (filter?: { status?: string }) => void;
  onNavigateToActivity: (filter?: { status?: string }) => void;
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

  const quickPrompts = [
    'Audit competitor changelogs and generate cited brief',
    'Triage high-priority GitHub issues with code repro',
    'Reconcile multi-channel customer webhook payloads',
    'Draft weekly executive research digest',
  ];

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
  const needsAttentionCount = agents.filter((a) => a.status === 'needs_attention').length;
  const pendingApprovals = activities.filter((a) => a.status === 'awaiting_approval').length;

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header */}
      <PageHeader
        title="AI Workflow Command Center"
        description="Monitor routing, execution telemetry, approvals, and autonomous agent fleet health in one unified workspace."
        actions={
          <div className="flex items-center gap-2">
            {/* Zero state preview toggle */}
            <button
              type="button"
              onClick={handleToggleZeroState}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isZeroMode
                  ? 'bg-[#38D9FF]/15 text-[#38D9FF] border-[#38D9FF]/40 font-semibold'
                  : 'bg-[#111827] text-[#9AA7BC] border-slate-800 hover:text-[#F4F7FC]'
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

      {/* Summary KPI Metrics Section - Refactored to dedicated semantic MetricCard components */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Agents */}
        <MetricCard
          label="Total Agents"
          value={agents.length}
          status={agents.length > 0 ? 'active' : 'default'}
          icon={<Bot size={15} />}
          trend={{ value: '+18.2%', positive: true }}
          subtext="Specialists configured in fleet"
          filterNotice="All agents"
          onClick={() => onNavigateToAgents({ status: 'all' })}
          ariaLabel={`Total Agents: ${agents.length}. Click to view all agents.`}
        />

        {/* Metric 2: Active Agents / Workflow Health */}
        <MetricCard
          label="Active Specialists"
          value={activeAgentsCount}
          status="success"
          icon={<CheckCircle2 size={15} />}
          trend={{ value: '98.6% SLA', positive: true }}
          subtext={`${activeAgentsCount} active · 0 SLA violations`}
          filterNotice="Filter active"
          onClick={() => onNavigateToAgents({ status: 'active' })}
          ariaLabel={`Active Specialists: ${activeAgentsCount}. Click to filter active agents.`}
        />

        {/* Metric 3: Multi-Stage Pipelines */}
        <MetricCard
          label="Active Pipelines"
          value={workflowsCount}
          status="info"
          icon={<GitFork size={15} />}
          trend={{ value: 'Live', positive: true }}
          subtext="Deterministic orchestration chains"
          filterNotice="Filter workflows"
          onClick={() => onNavigateToWorkflows({ status: 'active' })}
          ariaLabel={`Active Pipelines: ${workflowsCount}. Click to view workflows.`}
        />

        {/* Metric 4: Trace Logs & Approvals */}
        <MetricCard
          label="Approval Gate"
          value={pendingApprovals > 0 ? `${pendingApprovals} Pending` : 'All Cleared'}
          status={pendingApprovals > 0 ? 'warning' : 'success'}
          icon={pendingApprovals > 0 ? <AlertTriangle size={15} /> : <ShieldCheck size={15} />}
          trend={
            pendingApprovals > 0
              ? { value: 'Action Required', positive: false }
              : { value: '99.8% Passed', positive: true }
          }
          subtext={
            pendingApprovals > 0
              ? `${pendingApprovals} action(s) awaiting sign-off`
              : 'Zero blocked external executions'
          }
          filterNotice={pendingApprovals > 0 ? 'Review approvals' : 'View activity'}
          onClick={() => onNavigateToActivity(pendingApprovals > 0 ? { status: 'awaiting_approval' } : undefined)}
          ariaLabel={`Approval Gate: ${pendingApprovals > 0 ? `${pendingApprovals} Pending` : 'All Cleared'}. Click to inspect activity.`}
        />
      </div>

      {/* Interactive Workflow Routing Matrix Map (Inspired by Reference Image 4) */}
      <WorkflowRoutingMap />

      {/* 30-Day Activity Volume & Peak Usage Visualization (Recharts) */}
      <ActivityVolumeChart
        activities={activities}
        agents={agents}
        isZeroState={isZeroMode}
        onNavigateToActivity={onNavigateToActivity}
      />

      {/* Welcome Objective Bar */}
      <div className="p-6 rounded-2xl bg-[#0D1220]/80 border border-slate-800/70 backdrop-blur-md shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#38D9FF]">
            <Sparkles size={13} />
            <span className="tracking-wide">START A NEW AGENT WORKFLOW</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F4F7FC]">
            What would you like your agents to help you accomplish?
          </h2>
          <p className="text-xs text-[#9AA7BC]">
            Describe an objective, or select a bounded specialist blueprint to configure tools, permissions, and review gates.
          </p>

          <form onSubmit={handlePromptSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. Audit competitor changelogs every Monday and draft a cited brief..."
                className="flex-1 bg-[#080B16] text-[#F4F7FC] placeholder-[#64748B] text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-800 focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] focus:outline-none transition-all shadow-inner"
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

          {/* Quick starter suggestions */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-[#64748B]">Suggestions:</span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptInput(p)}
                className="text-[11px] text-[#9AA7BC] hover:text-[#38D9FF] bg-[#111827] border border-slate-800/80 hover:border-[#38D9FF]/40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My Agents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F4F7FC]">My Agents</h2>
            <p className="text-xs text-[#9AA7BC]">Recently configured and running specialists</p>
          </div>
          {agents.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateToAgents()}
              className="text-xs text-[#38D9FF] hover:text-[#80E5FF] font-medium transition-colors cursor-pointer"
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
            <h2 className="text-base font-bold text-[#F4F7FC]">Recent Activity</h2>
            <p className="text-xs text-[#9AA7BC]">Trace logs, approval requests, and trigger events</p>
          </div>
          {activities.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateToActivity()}
              className="text-xs text-[#38D9FF] hover:text-[#80E5FF] font-medium transition-colors cursor-pointer"
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

