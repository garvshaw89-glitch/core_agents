import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { SearchField } from '../design-system/SearchField';
import { ActivityItem } from '../design-system/ActivityItem';
import { EmptyState } from '../design-system/EmptyState';
import { ActivityDetailDrawer } from '../components/app/ActivityDetailDrawer';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { ActivityRecord, ActivityStatus } from '../types/app';
import {
  History,
  Filter,
  RefreshCw,
  Bot,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  X,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ActivityPageProps {
  onNavigateToAgents: () => void;
  initialStatusFilter?: string;
}

type DateRangePreset = 'all' | 'today' | 'yesterday' | '7d' | '30d' | 'custom';

export const ActivityPage: React.FC<ActivityPageProps> = ({ onNavigateToAgents, initialStatusFilter }) => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);

  // Date Range Filter States
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  const loadActivities = () => {
    setActivities(appStateService.getActivities());
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (initialStatusFilter !== undefined) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  // Synchronize date preset changes
  const handleDatePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset);
    // Simulated anchor date (2026-10-22)
    const baseDateStr = '2026-10-22';
    const baseDate = new Date(`${baseDateStr}T23:59:59Z`);

    if (preset === 'today') {
      setStartDate(baseDateStr);
      setEndDate(baseDateStr);
      setIsCustomDateOpen(false);
    } else if (preset === 'yesterday') {
      const yesterday = new Date(baseDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      setStartDate(yesterdayStr);
      setEndDate(yesterdayStr);
      setIsCustomDateOpen(false);
    } else if (preset === '7d') {
      const past7 = new Date(baseDate);
      past7.setDate(past7.getDate() - 7);
      setStartDate(past7.toISOString().split('T')[0]);
      setEndDate(baseDateStr);
      setIsCustomDateOpen(false);
    } else if (preset === '30d') {
      const past30 = new Date(baseDate);
      past30.setDate(past30.getDate() - 30);
      setStartDate(past30.toISOString().split('T')[0]);
      setEndDate(baseDateStr);
      setIsCustomDateOpen(false);
    } else if (preset === 'custom') {
      setIsCustomDateOpen(true);
    } else {
      // All time
      setStartDate('');
      setEndDate('');
      setIsCustomDateOpen(false);
    }
  };

  const handleApprove = (id: string) => {
    const updated = appStateService.approveActivity(id);
    if (updated) {
      loadActivities();
      showToast({
        type: 'success',
        title: 'Action Authorized',
        message: 'The consequential payload has been released to external targets.',
      });
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAgentFilter('all');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setIsCustomDateOpen(false);
  };

  // Unique agent names for dropdown filter
  const uniqueAgents = useMemo(() => {
    const map = new Map<string, string>();
    activities.forEach((act) => {
      if (act.agentId && act.agentName) {
        map.set(act.agentId, act.agentName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [activities]);

  // Overall counts for segmented filter bar
  const statusCounts = useMemo(() => {
    return {
      all: activities.length,
      completed: activities.filter((a) => a.status === 'completed').length,
      awaiting_approval: activities.filter((a) => a.status === 'awaiting_approval').length,
      failed: activities.filter((a) => a.status === 'failed').length,
      running: activities.filter((a) => a.status === 'running').length,
    };
  }, [activities]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // 1. Text Search Filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        act.runId.toLowerCase().includes(query) ||
        act.agentName.toLowerCase().includes(query) ||
        act.outputSummary.toLowerCase().includes(query) ||
        (act.errorDetails && act.errorDetails.toLowerCase().includes(query));

      // 2. Status / Activity Type Filter
      const matchesStatus = statusFilter === 'all' || act.status === statusFilter;

      // 3. Agent Filter
      const matchesAgent = agentFilter === 'all' || act.agentId === agentFilter;

      // 4. Date Range Filter
      const actDate = act.startTime ? act.startTime.split('T')[0] : '';
      const matchesStartDate = !startDate || (actDate !== '' && actDate >= startDate);
      const matchesEndDate = !endDate || (actDate !== '' && actDate <= endDate);

      return matchesSearch && matchesStatus && matchesAgent && matchesStartDate && matchesEndDate;
    });
  }, [activities, searchQuery, statusFilter, agentFilter, startDate, endDate]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    agentFilter !== 'all' ||
    datePreset !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  const activeDateLabel = useMemo(() => {
    if (datePreset === 'today') return 'Today (Oct 22)';
    if (datePreset === 'yesterday') return 'Yesterday (Oct 21)';
    if (datePreset === '7d') return 'Last 7 Days';
    if (datePreset === '30d') return 'Last 30 Days';
    if (startDate && endDate) return `${startDate} → ${endDate}`;
    if (startDate) return `Since ${startDate}`;
    if (endDate) return `Until ${endDate}`;
    return 'All Time';
  }, [datePreset, startDate, endDate]);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150 text-left">
      <PageHeader
        title="Activity"
        description="Inspect cryptographically verified execution traces, latency metrics, and human approval states."
        actions={
          <button
            type="button"
            onClick={loadActivities}
            className="px-3 py-1.5 rounded-xl bg-[#111827] border border-slate-700/60 text-[#9AA7BC] hover:text-[#F4F7FC] hover:border-[#38D9FF]/40 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Refresh activity logs"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Top Telemetry Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Matches */}
        <div className="p-3.5 rounded-xl bg-[#0D1220]/90 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>FILTERED LOGS</span>
            <History size={12} className="text-[#38D9FF]" />
          </div>
          <div className="text-xl font-bold text-[#F4F7FC] font-mono tabular-nums">
            {filteredActivities.length}
            <span className="text-xs text-[#64748B] font-normal ml-1">/ {activities.length} total</span>
          </div>
        </div>

        {/* Completed */}
        <div className="p-3.5 rounded-xl bg-[#0D1220]/90 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>COMPLETED</span>
            <CheckCircle2 size={12} className="text-[#34D399]" />
          </div>
          <div className="text-xl font-bold text-[#34D399] font-mono tabular-nums">
            {filteredActivities.filter((a) => a.status === 'completed').length}
          </div>
        </div>

        {/* Awaiting Approval */}
        <div className="p-3.5 rounded-xl bg-[#0D1220]/90 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>AWAITING APPROVAL</span>
            <ShieldCheck size={12} className="text-[#FBBF24]" />
          </div>
          <div className="text-xl font-bold text-[#FBBF24] font-mono tabular-nums">
            {filteredActivities.filter((a) => a.status === 'awaiting_approval').length}
          </div>
        </div>

        {/* Failed */}
        <div className="p-3.5 rounded-xl bg-[#0D1220]/90 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1 font-mono">
            <span>FAILED / RETRIED</span>
            <AlertTriangle size={12} className="text-[#FB7185]" />
          </div>
          <div className="text-xl font-bold text-[#FB7185] font-mono tabular-nums">
            {filteredActivities.filter((a) => a.status === 'failed').length}
          </div>
        </div>
      </div>

      {/* Filter & Drill-down Control Card */}
      <div className="p-4 rounded-2xl bg-[#0D1220]/90 border border-slate-800/80 shadow-sm space-y-4 backdrop-blur-md">
        {/* 1. Activity Type / Status Filter Bar (Dedicated Segmented Controls) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
              Activity Type Filter
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">
              {statusFilter === 'all' ? 'All Activity Types' : `Filtering by: ${statusFilter.replace('_', ' ')}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#111827] border border-slate-800/80">
            {/* All */}
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'all'
                  ? 'bg-[#151D2E] text-[#38D9FF] shadow-xs border border-[#38D9FF]/30 font-semibold'
                  : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
              }`}
            >
              <span>All Logs</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#080B16] text-[#64748B]">
                {statusCounts.all}
              </span>
            </button>

            {/* Completed */}
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'completed'
                  ? 'bg-[#34D399]/15 text-[#34D399] shadow-xs border border-[#34D399]/40 font-semibold'
                  : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span>Completed</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#080B16] text-[#34D399]">
                {statusCounts.completed}
              </span>
            </button>

            {/* Awaiting Approval */}
            <button
              type="button"
              onClick={() => setStatusFilter('awaiting_approval')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'awaiting_approval'
                  ? 'bg-[#FBBF24]/15 text-[#FBBF24] shadow-xs border border-[#FBBF24]/40 font-semibold'
                  : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
              }`}
            >
              <ShieldCheck size={12} className="text-[#FBBF24]" />
              <span>Awaiting Approval</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#080B16] text-[#FBBF24] font-bold">
                {statusCounts.awaiting_approval}
              </span>
            </button>

            {/* Failed */}
            <button
              type="button"
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'failed'
                  ? 'bg-[#FB7185]/15 text-[#FB7185] shadow-xs border border-[#FB7185]/40 font-semibold'
                  : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FB7185]" />
              <span>Failed</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#080B16] text-[#FB7185]">
                {statusCounts.failed}
              </span>
            </button>

            {/* Running */}
            <button
              type="button"
              onClick={() => setStatusFilter('running')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'running'
                  ? 'bg-[#38D9FF]/15 text-[#38D9FF] shadow-xs border border-[#38D9FF]/40 font-semibold'
                  : 'text-[#9AA7BC] hover:text-[#F4F7FC]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38D9FF] animate-pulse" />
              <span>Running</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#080B16] text-[#38D9FF]">
                {statusCounts.running}
              </span>
            </button>
          </div>
        </div>

        {/* 2. Date-Range Picker and Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Keyword Search */}
          <div className="flex-1 max-w-md">
            <SearchField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search by run ID, specialist name, or summary..."
            />
          </div>

          {/* Date Range Preset & Agent Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range Preset Selector */}
            <div className="flex items-center gap-1.5 bg-[#111827] border border-slate-700/60 rounded-xl px-2.5 py-1.5">
              <Calendar size={13} className="text-[#38D9FF] shrink-0" />
              <select
                value={datePreset}
                onChange={(e) => handleDatePresetChange(e.target.value as DateRangePreset)}
                className="bg-transparent text-[#F4F7FC] text-xs focus:outline-none cursor-pointer font-medium pr-1"
                aria-label="Filter by date range"
              >
                <option value="all" className="bg-[#111827]">All Time</option>
                <option value="today" className="bg-[#111827]">Today (Oct 22)</option>
                <option value="yesterday" className="bg-[#111827]">Yesterday (Oct 21)</option>
                <option value="7d" className="bg-[#111827]">Last 7 Days</option>
                <option value="30d" className="bg-[#111827]">Last 30 Days</option>
                <option value="custom" className="bg-[#111827]">Custom Range...</option>
              </select>
            </div>

            {/* Custom Date Range Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCustomDateOpen(!isCustomDateOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isCustomDateOpen || (startDate && endDate)
                  ? 'bg-[#151D2E] text-[#38D9FF] border-[#38D9FF]/40'
                  : 'bg-[#111827] text-[#9AA7BC] border-slate-700/60 hover:text-[#F4F7FC]'
              }`}
              title="Pick custom start and end date"
            >
              <span>{startDate && endDate ? `${startDate} → ${endDate}` : 'Custom Dates'}</span>
            </button>

            {/* Agent Specialist Dropdown Filter */}
            <div className="w-44">
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] cursor-pointer truncate font-medium"
                aria-label="Filter by specialist agent"
              >
                <option value="all">All Specialists ({uniqueAgents.length})</option>
                {uniqueAgents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Expandable Custom Date-Range Inputs Drawer */}
        {isCustomDateOpen && (
          <div className="p-3.5 rounded-xl bg-[#080B16] border border-slate-800 space-y-3 animate-in fade-in-0 duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#F4F7FC] flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#38D9FF]" />
                  <span>Custom Date Range Boundary:</span>
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">
                  Filter traces by ISO execution date
                </span>
              </div>

              {/* Quick shortcut presets */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDatePresetChange('today')}
                  className="px-2 py-0.5 rounded bg-[#111827] hover:bg-[#151D2E] border border-slate-800 text-[10px] text-[#9AA7BC] hover:text-[#F4F7FC] transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleDatePresetChange('7d')}
                  className="px-2 py-0.5 rounded bg-[#111827] hover:bg-[#151D2E] border border-slate-800 text-[10px] text-[#9AA7BC] hover:text-[#F4F7FC] transition-colors cursor-pointer"
                >
                  Past 7D
                </button>
                <button
                  type="button"
                  onClick={() => handleDatePresetChange('30d')}
                  className="px-2 py-0.5 rounded bg-[#111827] hover:bg-[#151D2E] border border-slate-800 text-[10px] text-[#9AA7BC] hover:text-[#F4F7FC] transition-colors cursor-pointer"
                >
                  Past 30D
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setDatePreset('all');
                  }}
                  className="px-2 py-0.5 rounded bg-[#111827] hover:bg-[#151D2E] border border-slate-800 text-[10px] text-[#FB7185] hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Start Date */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#9AA7BC]">Start Date (From)</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] cursor-pointer font-mono"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#9AA7BC]">End Date (To)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full bg-[#111827] text-[#F4F7FC] text-xs rounded-xl border border-slate-700/60 px-3 py-2 focus:outline-none focus:border-[#38D9FF] cursor-pointer font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#64748B] font-mono mr-1">Active Filters:</span>

              {/* Status Chip */}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#151D2E] border border-[#38D9FF]/40 text-[#38D9FF]">
                  <span>Status: {statusFilter.replace('_', ' ')}</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className="hover:text-white cursor-pointer ml-0.5"
                    aria-label="Remove status filter"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {/* Date Chip */}
              {(datePreset !== 'all' || startDate || endDate) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#151D2E] border border-[#38D9FF]/40 text-[#38D9FF]">
                  <Calendar size={10} />
                  <span>Date: {activeDateLabel}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDatePreset('all');
                      setStartDate('');
                      setEndDate('');
                      setIsCustomDateOpen(false);
                    }}
                    className="hover:text-white cursor-pointer ml-0.5"
                    aria-label="Remove date filter"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {/* Agent Chip */}
              {agentFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#151D2E] border border-[#38D9FF]/40 text-[#38D9FF]">
                  <span>Agent: {uniqueAgents.find((a) => a.id === agentFilter)?.name || agentFilter}</span>
                  <button
                    type="button"
                    onClick={() => setAgentFilter('all')}
                    className="hover:text-white cursor-pointer ml-0.5"
                    aria-label="Remove agent filter"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {/* Query Chip */}
              {searchQuery.trim() !== '' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#151D2E] border border-slate-700 text-[#F4F7FC]">
                  <span>Search: &quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white cursor-pointer ml-0.5"
                    aria-label="Clear search query"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>

            {/* Reset All Button */}
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#FB7185] transition-colors cursor-pointer font-mono"
            >
              <RotateCcw size={11} />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Activity Timeline List */}
      {activities.length === 0 ? (
        <EmptyState
          icon={<History size={24} />}
          title="No execution history found"
          description="Your activity will appear here when you start working with agents. Execution traces are cryptographically signed."
          primaryAction={{
            label: 'View configured agents',
            onClick: onNavigateToAgents,
            icon: <Bot size={14} />,
          }}
        />
      ) : filteredActivities.length === 0 ? (
        <EmptyState
          title="No matching activity records"
          description={`No activity logs match your filter criteria (${[
            statusFilter !== 'all' ? `Status: ${statusFilter}` : null,
            datePreset !== 'all' ? `Date: ${activeDateLabel}` : null,
            agentFilter !== 'all' ? 'Specific Specialist' : null,
            searchQuery ? `Search: "${searchQuery}"` : null,
          ]
            .filter(Boolean)
            .join(', ')}).`}
          secondaryAction={{
            label: 'Clear all filters',
            onClick: resetAllFilters,
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onOpenDetails={(act) => setSelectedActivity(act)}
              onApprove={handleApprove}
            />
          ))}
        </div>
      )}

      {/* Detailed Run Inspector Drawer */}
      <ActivityDetailDrawer
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        onApprove={handleApprove}
      />
    </div>
  );
};
