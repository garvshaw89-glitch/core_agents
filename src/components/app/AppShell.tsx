import React, { useState, useEffect } from 'react';
import { CoreSymbol } from '../CoreSymbol';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';
import { CreateAgentModal } from './CreateAgentModal';
import { AgentDetailDrawer } from './AgentDetailDrawer';
import { TemplateDefinition } from '../../data/templates';
import { Agent, ActivityRecord, UserProfile } from '../../types/app';
import { appStateService } from '../../services/appStateService';
import { useToast } from '../../design-system/Toast';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  GitFork,
  History,
  Database,
  Blocks,
  Settings,
  Plus,
  Search,
  Bell,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  LogOut,
  Building,
  Check,
} from 'lucide-react';

export type AppNavPage =
  | 'overview'
  | 'agents'
  | 'templates'
  | 'workflows'
  | 'activity'
  | 'knowledge'
  | 'integrations'
  | 'settings';

interface AppShellProps {
  activePage: AppNavPage;
  onNavigate: (page: AppNavPage) => void;
  onSwitchToLanding: () => void;
  children: React.ReactNode;
  initialTemplateForCreation?: TemplateDefinition | null;
  onClearInitialTemplate?: () => void;
  onCreateAgentAction?: () => void;
}

import { AmbientBackground } from '../../design-system/AmbientBackground';

export const AppShell: React.FC<AppShellProps> = ({
  activePage,
  onNavigate,
  onSwitchToLanding,
  children,
  initialTemplateForCreation = null,
  onClearInitialTemplate,
  onCreateAgentAction,
}) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(appStateService.getUserProfile());
  const [activities, setActivities] = useState<ActivityRecord[]>(appStateService.getActivities());

  // Command palette & drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [initialPromptForAgent, setInitialPromptForAgent] = useState<string | undefined>(undefined);
  const [templateForCreation, setTemplateForCreation] = useState<TemplateDefinition | null>(null);

  // Inspector drawer
  const [inspectedAgent, setInspectedAgent] = useState<Agent | null>(null);

  // Workspace selector dropdown
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const workspaces = ['Acme Research Labs', 'Core Intelligence Fleet', 'Personal Sandbox'];

  useEffect(() => {
    if (initialTemplateForCreation) {
      setTemplateForCreation(initialTemplateForCreation);
      setIsCreateAgentOpen(true);
      if (onClearInitialTemplate) onClearInitialTemplate();
    }
  }, [initialTemplateForCreation, onClearInitialTemplate]);

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'overview' as AppNavPage, label: 'Overview', icon: LayoutDashboard },
    { id: 'agents' as AppNavPage, label: 'My Agents', icon: Bot },
    { id: 'templates' as AppNavPage, label: 'Templates', icon: BookOpen },
    { id: 'workflows' as AppNavPage, label: 'Workflows', icon: GitFork },
    { id: 'activity' as AppNavPage, label: 'Activity', icon: History },
    { id: 'knowledge' as AppNavPage, label: 'Knowledge', icon: Database },
    { id: 'integrations' as AppNavPage, label: 'Integrations', icon: Blocks },
    { id: 'settings' as AppNavPage, label: 'Settings', icon: Settings },
  ];

  const pendingApprovalsCount = activities.filter((a) => a.status === 'awaiting_approval').length;

  const handleApproveActivity = (id: string) => {
    const updated = appStateService.approveActivity(id);
    if (updated) {
      setActivities(appStateService.getActivities());
      showToast({
        type: 'success',
        title: 'Action Authorized',
        message: 'The consequential operation has been released to external targets.',
      });
    }
  };

  const handleOpenCreateWithPrompt = (prompt?: string) => {
    setInitialPromptForAgent(prompt);
    setTemplateForCreation(null);
    setIsCreateAgentOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F4F7FC] flex flex-col md:flex-row antialiased selection:bg-[#38D9FF]/20 selection:text-white relative">
      {/* Ambient background light field */}
      <AmbientBackground variant="standard" />

      {/* =========================================================================
          DESKTOP PERSISTENT SIDEBAR (~248px)
      ========================================================================= */}
      <aside
        className="hidden md:flex flex-col w-[248px] shrink-0 bg-[#0D1220]/95 backdrop-blur-md border-r border-slate-800/70 h-screen sticky top-0 z-30 select-none"
        aria-label="Sidebar navigation"
      >
        {/* Brand & Wordmark */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2.5 hover:opacity-95 transition-opacity text-left cursor-pointer group"
          >
            <CoreSymbol size={26} />
            <span className="text-base font-semibold tracking-tight text-[#F4F7FC]">
              CORE <span className="text-[#38D9FF] font-normal">Agents</span>
            </span>
          </button>
        </div>

        {/* Workspace Selector */}
        <div className="p-3 border-b border-slate-800/60 relative">
          <button
            type="button"
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[#111827] border border-slate-700/50 hover:border-[#38D9FF]/40 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-[#38D9FF]/15 text-[#38D9FF] flex items-center justify-center shrink-0">
                <Building size={12} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#F4F7FC] truncate">
                  {profile.workspaceName}
                </div>
                <div className="text-[10px] text-[#64748B] truncate">Team Tier · Active</div>
              </div>
            </div>
            <ChevronDown size={14} className="text-[#64748B] shrink-0" />
          </button>

          {/* Workspace dropdown menu */}
          {isWorkspaceDropdownOpen && (
            <div className="absolute top-full left-3 right-3 z-50 mt-1 rounded-xl bg-[#151D2E] border border-slate-700/60 p-1.5 shadow-2xl space-y-1">
              <div className="text-[10px] font-mono text-[#64748B] px-2 py-1">SWITCH WORKSPACE</div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  type="button"
                  onClick={() => {
                    setProfile({ ...profile, workspaceName: ws });
                    setIsWorkspaceDropdownOpen(false);
                    showToast({
                      type: 'info',
                      title: 'Workspace Switched',
                      message: `Switched context to ${ws}.`,
                    });
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                    profile.workspaceName === ws
                      ? 'bg-[#38D9FF]/15 text-[#38D9FF] font-semibold'
                      : 'text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#111827]'
                  }`}
                >
                  <span className="truncate">{ws}</span>
                  {profile.workspaceName === ws && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#151D2E] text-[#F4F7FC] font-semibold border border-[#38D9FF]/40 shadow-xs'
                    : 'text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#111827]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={16}
                    className={`shrink-0 ${isActive ? 'text-[#38D9FF]' : 'text-[#64748B]'}`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {/* Badges for pending activity approvals */}
                {item.id === 'activity' && pendingApprovalsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FBBF24] text-[#080B16] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Platform Status Indicator (Enterprise telemetry) */}
        <div className="px-3 py-2 border-t border-slate-800/60">
          <div className="p-2.5 rounded-xl bg-[#111827]/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#9AA7BC] font-medium">Platform status</span>
              <span className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_6px_rgba(52,211,153,0.5)] animate-pulse" />
            </div>
            <div className="text-xs font-semibold text-[#F4F7FC]">All systems operational</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Uptime: 99.98% · SLA Met</div>
          </div>
        </div>

        {/* Switch to Public Landing Page Quick Link */}
        <div className="px-3 py-2 border-t border-slate-800/60">
          <button
            type="button"
            onClick={onSwitchToLanding}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#111827] transition-colors cursor-pointer"
            title="Preview public landing page"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#38D9FF]" />
              <span>Public Landing Page</span>
            </div>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* User Profile & Account Footer */}
        <div className="p-3 border-t border-slate-800/60 bg-[#0D1220]/70">
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#111827] transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#38D9FF]/15 text-[#38D9FF] border border-[#38D9FF]/30 font-semibold text-xs flex items-center justify-center shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#F4F7FC] truncate group-hover:text-white">
                {profile.name}
              </div>
              <div className="text-[10px] text-[#9AA7BC] truncate">{profile.email}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN APPLICATION WORKSPACE & TOP BAR
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar Navigation */}
        <header className="sticky top-0 z-20 bg-[#0D1220]/90 backdrop-blur-md border-b border-slate-800/70 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger + Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#151D2E] md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span className="text-[#38D9FF] font-semibold">CORE</span>
              <span>/</span>
              <span className="text-[#F4F7FC] capitalize font-semibold">
                {activePage === 'overview'
                  ? 'Overview'
                  : activePage === 'agents'
                  ? 'My Agents'
                  : activePage}
              </span>
            </div>
          </div>

          {/* Right: Global Search, Notifications, Primary Action */}
          <div className="flex items-center gap-2.5">
            {/* Global Search / Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-slate-700/60 hover:border-[#38D9FF]/50 text-[#9AA7BC] hover:text-[#F4F7FC] text-xs transition-colors cursor-pointer shadow-xs"
              title="Search and commands (⌘K)"
            >
              <Search size={14} className="text-[#38D9FF]" />
              <span className="hidden sm:inline">Search workspace...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-[#151D2E] border border-slate-700/80 px-1.5 py-0.5 rounded text-[#9AA7BC]">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Entry */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl bg-[#111827] border border-slate-700/60 hover:border-[#38D9FF]/50 text-[#9AA7BC] hover:text-[#F4F7FC] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {pendingApprovalsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FBBF24] text-[#080B16] font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => (onCreateAgentAction ? onCreateAgentAction() : handleOpenCreateWithPrompt())}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#080B16] bg-[#38D9FF] hover:bg-[#80E5FF] active:bg-[#22B8DC] transition-all rounded-xl shadow-[0_0_12px_rgba(56,217,255,0.25)] cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Create agent</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Workspace Central Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* =========================================================================
            MOBILE BOTTOM NAVIGATION BAR
        ========================================================================= */}
        <nav
          aria-label="Mobile bottom navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0D1220]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around"
        >
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              activePage === 'overview' ? 'text-[#38D9FF]' : 'text-[#64748B]'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="mt-1">Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('agents')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              activePage === 'agents' ? 'text-[#38D9FF]' : 'text-[#64748B]'
            }`}
          >
            <Bot size={18} />
            <span className="mt-1">Agents</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('templates')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              activePage === 'templates' ? 'text-[#38D9FF]' : 'text-[#64748B]'
            }`}
          >
            <BookOpen size={18} />
            <span className="mt-1">Templates</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workflows')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              activePage === 'workflows' ? 'text-[#38D9FF]' : 'text-[#64748B]'
            }`}
          >
            <GitFork size={18} />
            <span className="mt-1">Workflows</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center py-1 px-2 text-[10px] font-medium text-[#64748B] hover:text-[#F4F7FC]"
          >
            <Menu size={18} />
            <span className="mt-1">More</span>
          </button>
        </nav>

        {/* Mobile Full-Screen Sheet for Secondary Pages */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex justify-end animate-in fade-in-0 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-4/5 max-w-xs bg-[#0D1220] border-l border-slate-800/80 h-full p-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <CoreSymbol size={22} />
                    <span className="font-semibold text-sm text-[#F4F7FC]">Navigation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-[#64748B] hover:text-[#F4F7FC]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onNavigate(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer ${
                          isActive
                            ? 'bg-[#151D2E] text-[#38D9FF] font-semibold border border-[#38D9FF]/40'
                            : 'text-[#9AA7BC] hover:bg-[#111827] hover:text-[#F4F7FC]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/70 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSwitchToLanding();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-[#38D9FF] bg-[#111827] hover:bg-[#151D2E] transition-colors cursor-pointer"
                >
                  <span>Public Landing Page</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(p) => onNavigate(p as AppNavPage)}
        onCreateAgent={() => handleOpenCreateWithPrompt()}
        onCreateWorkflow={() => onNavigate('workflows')}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        activities={activities}
        onApprove={handleApproveActivity}
        onOpenActivity={(act) => {
          onNavigate('activity');
        }}
      />

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateAgentOpen}
        onClose={() => {
          setIsCreateAgentOpen(false);
          setInitialPromptForAgent(undefined);
          setTemplateForCreation(null);
        }}
        initialTemplate={templateForCreation}
        initialPrompt={initialPromptForAgent}
        onSave={(newAgent) => {
          appStateService.saveAgent(newAgent);
          onNavigate('agents');
        }}
      />

      {/* Inspected Agent Detail Drawer */}
      <AgentDetailDrawer
        agent={inspectedAgent}
        isOpen={inspectedAgent !== null}
        onClose={() => setInspectedAgent(null)}
        onUpdate={() => {
          setInspectedAgent(null);
        }}
      />
    </div>
  );
};
