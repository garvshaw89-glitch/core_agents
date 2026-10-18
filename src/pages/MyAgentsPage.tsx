import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Button } from '../design-system/Button';
import { SearchField } from '../design-system/SearchField';
import { Select } from '../design-system/Select';
import { AgentCard } from '../design-system/AgentCard';
import { EmptyState } from '../design-system/EmptyState';
import { ConfirmationDialog } from '../design-system/ConfirmationDialog';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { Agent, AgentStatus, AgentCategory } from '../types/app';
import { Plus, LayoutGrid, List, Bot, Filter, Sparkles } from 'lucide-react';

interface MyAgentsPageProps {
  onCreateAgent: () => void;
  onOpenAgent: (agent: Agent) => void;
  onEditAgentInBuilder?: (agent: Agent) => void;
  onExploreTemplates: () => void;
  onViewTemplate?: (templateId: string) => void;
}

export const MyAgentsPage: React.FC<MyAgentsPageProps> = ({
  onCreateAgent,
  onOpenAgent,
  onEditAgentInBuilder,
  onExploreTemplates,
  onViewTemplate,
}) => {
  const { showToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recently_updated');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [agentToArchive, setAgentToArchive] = useState<Agent | null>(null);

  const loadAgents = () => {
    setAgents(appStateService.getAgents());
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents
      .filter((agent) => {
        const matchesSearch =
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'created_date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [agents, searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleTogglePause = (agent: Agent) => {
    const updated = appStateService.toggleAgentPause(agent.id);
    if (updated) {
      loadAgents();
      showToast({
        type: 'info',
        title: updated.status === 'paused' ? 'Agent Paused' : 'Agent Resumed',
        message: `${agent.name} is now ${updated.status}.`,
      });
    }
  };

  const handleDuplicate = (agent: Agent) => {
    const duplicated = appStateService.duplicateAgent(agent.id);
    if (duplicated) {
      loadAgents();
      showToast({
        type: 'success',
        title: 'Agent Duplicated',
        message: `Created draft copy: ${duplicated.name}`,
      });
    }
  };

  const handleConfirmArchive = () => {
    if (agentToArchive) {
      appStateService.deleteAgent(agentToArchive.id);
      showToast({
        type: 'info',
        title: 'Agent Archived',
        message: `${agentToArchive.name} was removed from active workspace.`,
      });
      setAgentToArchive(null);
      loadAgents();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="My Agents"
        description="Configure, inspect, and supervise your specialized AI workforce."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={onCreateAgent}
          >
            Create agent
          </Button>
        }
      />

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0D1220]/90 border border-slate-800/70 shadow-sm backdrop-blur-md">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search agents by name, description, or tools..."
          />
        </div>

        {/* Filter Dropdowns and Layout Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="w-32">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="needs_attention">Needs Attention</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-32">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer"
            >
              <option value="all">All Domains</option>
              <option value="research">Research</option>
              <option value="coding">Coding</option>
              <option value="learning">Learning</option>
              <option value="operations">Operations</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="w-36">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer"
            >
              <option value="recently_updated">Recently Updated</option>
              <option value="name">Sort by Name</option>
              <option value="created_date">Created Date</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#111827] border border-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                layout === 'grid'
                  ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#F4F7FC]'
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                layout === 'list'
                  ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#F4F7FC]'
              }`}
              aria-label="List layout"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Agents Listing or Empty States */}
      {agents.length === 0 ? (
        <EmptyState
          icon={<Bot size={24} />}
          title="No agents yet."
          description="Create your first specialist agent or start from a template."
          primaryAction={{
            label: 'Create agent',
            onClick: onCreateAgent,
            icon: <Plus size={14} />,
          }}
          secondaryAction={{
            label: 'Explore templates',
            onClick: onExploreTemplates,
          }}
        />
      ) : filteredAgents.length === 0 ? (
        <EmptyState
          title="No matching agents found"
          description={`No agents match "${searchQuery}" with the selected filters.`}
          secondaryAction={{
            label: 'Clear filters',
            onClick: () => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            },
          }}
        />
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              layout={layout}
              onOpen={onOpenAgent}
              onEditInBuilder={onEditAgentInBuilder}
              onTogglePause={handleTogglePause}
              onDuplicate={handleDuplicate}
              onArchive={(a) => setAgentToArchive(a)}
              onViewTemplate={onViewTemplate}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Archiving */}
      <ConfirmationDialog
        isOpen={agentToArchive !== null}
        onClose={() => setAgentToArchive(null)}
        onConfirm={handleConfirmArchive}
        title="Archive Agent?"
        message={`Are you sure you want to archive "${agentToArchive?.name}"? Its assigned triggers will be deactivated, and its configuration preserved in the archive history.`}
        confirmLabel="Archive Agent"
        variant="danger"
      />
    </div>
  );
};
