import React, { useState, useEffect } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { SearchField } from '../design-system/SearchField';
import { ActivityItem } from '../design-system/ActivityItem';
import { EmptyState } from '../design-system/EmptyState';
import { ActivityDetailDrawer } from '../components/app/ActivityDetailDrawer';
import { useToast } from '../design-system/Toast';
import { appStateService } from '../services/appStateService';
import { ActivityRecord } from '../types/app';
import { History, Filter, RefreshCw, Bot } from 'lucide-react';

interface ActivityPageProps {
  onNavigateToAgents: () => void;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({ onNavigateToAgents }) => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);

  const loadActivities = () => {
    setActivities(appStateService.getActivities());
  };

  useEffect(() => {
    loadActivities();
  }, []);

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

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.runId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.outputSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150">
      <PageHeader
        title="Activity"
        description="Inspect cryptographically verified execution traces, latency metrics, and human approval states."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search activity by run ID, agent name, or summary..."
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#111118] text-[#F4F2FA] text-xs rounded-xl border border-[#292936] px-3 py-2 focus:outline-none focus:border-[#A78BFA] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="awaiting_approval">Awaiting Approval</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
            </select>
          </div>

          <button
            type="button"
            onClick={loadActivities}
            className="p-2 rounded-xl bg-[#111118] border border-[#292936] text-[#777487] hover:text-[#F4F2FA] hover:border-[#3D3D4E] transition-colors cursor-pointer"
            aria-label="Refresh activity"
          >
            <RefreshCw size={14} />
          </button>
        </div>
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
          description={`No activity matches "${searchQuery}" with the current filters.`}
          secondaryAction={{
            label: 'Clear search & filters',
            onClick: () => {
              setSearchQuery('');
              setStatusFilter('all');
            },
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
