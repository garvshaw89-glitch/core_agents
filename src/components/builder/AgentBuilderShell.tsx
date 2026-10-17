import React, { useState } from 'react';
import { Agent, AgentStatus } from '../../types/app';
import { Button } from '../../design-system/Button';
import { StatusBadge } from '../../design-system/StatusBadge';
import { BuilderSectionKey } from './BuilderValidationPanel';
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Clock,
  Compass,
  Code2,
  BookOpen,
  Server,
  Sparkles,
  Bot,
  Terminal,
  FileText,
  Activity,
  Shield,
  Sliders,
  Wrench,
  Database,
  Lock,
  Play,
  PanelRightClose,
  PanelRightOpen,
  Edit2,
} from 'lucide-react';

interface AgentBuilderShellProps {
  agent: Agent;
  onUpdateAgent: (updates: Partial<Agent>) => void;
  activeSection: BuilderSectionKey;
  onSelectSection: (section: BuilderSectionKey) => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  saveStatus: 'unsaved' | 'saving' | 'saved' | 'error';
  lastSavedAt?: string;
  errorsCount: number;
  warningsCount: number;
  readinessLabel: string;
  isValidationOpen: boolean;
  onToggleValidation: () => void;
  children: React.ReactNode;
  validationPanelNode: React.ReactNode;
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Code2,
  BookOpen,
  Server,
  Bot,
  Sparkles,
  Terminal,
  FileText,
  Activity,
  Shield,
};

export const AgentBuilderShell: React.FC<AgentBuilderShellProps> = ({
  agent,
  onUpdateAgent,
  activeSection,
  onSelectSection,
  onBack,
  onSave,
  isSaving,
  saveStatus,
  lastSavedAt,
  errorsCount,
  warningsCount,
  readinessLabel,
  isValidationOpen,
  onToggleValidation,
  children,
  validationPanelNode,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(agent.name);

  const IconComponent = iconMap[agent.iconName] || Bot;

  const handleTitleSubmit = () => {
    const trimmed = tempTitle.trim();
    if (trimmed) {
      onUpdateAgent({ name: trimmed });
    } else {
      setTempTitle(agent.name);
    }
    setIsEditingTitle(false);
  };

  const navItems: { id: BuilderSectionKey; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview & Identity', icon: Bot },
    { id: 'instructions', label: 'Instructions & Prompt', icon: FileText },
    { id: 'model', label: 'Model & Generation', icon: Sliders },
    { id: 'tools', label: 'Approved Tools', icon: Wrench },
    { id: 'knowledge', label: 'Knowledge Sources', icon: Database },
    { id: 'permissions', label: 'Permissions & Policy', icon: Lock },
    { id: 'testing', label: 'Testing & Sandbox', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[#09090D] text-[#F4F2FA] flex flex-col selection:bg-[#A78BFA]/30 selection:text-white">
      {/* =========================================================================
          TOP BUILDER NAVIGATION BAR
      ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#09090D]/95 backdrop-blur-md border-b border-[#292936] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Back Action + Agent Icon + Inline Title Editor */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors cursor-pointer shrink-0"
            title="Return to My Agents"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Agent Avatar Icon */}
          <div className="w-8 h-8 rounded-xl bg-[#171720] border border-[#292936] flex items-center justify-center text-[#A78BFA] shrink-0">
            <IconComponent size={16} />
          </div>

          {/* Editable Title */}
          <div className="min-w-0 flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTempTitle(agent.name);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="bg-[#171720] border border-[#A78BFA] rounded-lg px-2.5 py-1 text-sm font-bold text-[#F4F2FA] focus:outline-none max-w-xs sm:max-w-md"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempTitle(agent.name);
                  setIsEditingTitle(true);
                }}
                className="group flex items-center gap-2 text-left cursor-pointer truncate"
                title="Click to rename agent"
              >
                <span className="text-sm font-bold text-[#F4F2FA] truncate group-hover:text-white">
                  {agent.name || 'Untitled Agent'}
                </span>
                <Edit2 size={12} className="text-[#777487] group-hover:text-[#A78BFA] transition-colors shrink-0" />
              </button>
            )}

            <div className="hidden lg:block">
              <StatusBadge status={agent.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Right: Save Status, Audit Pill, Test Trigger, Primary Save */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Save Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#777487]">
            {saveStatus === 'saving' ? (
              <span className="flex items-center gap-1.5 text-[#A78BFA]">
                <Clock size={12} className="animate-spin" /> Saving...
              </span>
            ) : saveStatus === 'unsaved' ? (
              <span className="flex items-center gap-1 text-[#F2C879]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2C879]" /> Unsaved changes
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="flex items-center gap-1 text-[#65D6A3]">
                <Check size={12} /> Saved
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#F07885]">
                <AlertCircle size={12} /> Save failed
              </span>
            )}
          </div>

          {/* Audit & Readiness Pill Trigger */}
          <button
            type="button"
            onClick={onToggleValidation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
              errorsCount > 0
                ? 'bg-[#F07885]/10 border-[#F07885]/30 text-[#F07885] hover:bg-[#F07885]/20'
                : warningsCount > 0
                ? 'bg-[#F2C879]/10 border-[#F2C879]/30 text-[#F2C879] hover:bg-[#F2C879]/20'
                : 'bg-[#171720] border-[#292936] text-[#65D6A3] hover:border-[#3D3D4E]'
            }`}
            title="Toggle Audit & Validation Panel"
          >
            <span className="hidden sm:inline">Audit:</span>
            <span className="font-bold truncate max-w-[110px] sm:max-w-none">
              {errorsCount > 0 ? `${errorsCount} Err` : readinessLabel}
            </span>
          </button>

          {/* Quick Test Tab Switcher */}
          <Button
            variant={activeSection === 'testing' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onSelectSection('testing')}
            leftIcon={<Play size={13} />}
          >
            <span className="hidden sm:inline">Test Agent</span>
            <span className="sm:hidden">Test</span>
          </Button>

          {/* Primary Save Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            disabled={isSaving}
            leftIcon={<Save size={13} />}
          >
            <span className="hidden sm:inline">Save Agent</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </header>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="md:hidden bg-[#111118] border-b border-[#292936] px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {navItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#171720] text-[#F4F2FA] border border-[#292936]'
                  : 'text-[#777487] hover:text-[#A5A2B4]'
              }`}
            >
              <ItemIcon size={13} className={isActive ? 'text-[#A78BFA]' : 'text-[#777487]'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          MAIN WORKSPACE (Balanced Two-Column with Sub-Nav & Config Area)
      ========================================================================= */}
      <div className="flex-1 flex min-w-0 relative">
        {/* Left: Compact Builder Navigation Sidebar (~240px on desktop) */}
        <nav
          className="hidden md:flex flex-col w-60 shrink-0 bg-[#0D0D13] border-r border-[#292936] p-4 select-none sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto"
          aria-label="Agent Builder Sections"
        >
          <div className="text-[10px] font-mono uppercase text-[#777487] px-3 mb-2 font-semibold">
            Builder Navigation
          </div>

          <div className="space-y-1">
            {navItems.map((item, idx) => {
              const ItemIcon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                    isActive
                      ? 'bg-[#171720] text-[#F4F2FA] border border-[#292936] shadow-xs'
                      : 'text-[#A5A2B4] hover:bg-[#111118] hover:text-[#F4F2FA]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ItemIcon
                      size={15}
                      className={isActive ? 'text-[#A78BFA]' : 'text-[#777487] group-hover:text-[#A5A2B4]'}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <span className="text-[10px] font-mono text-[#777487]">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Agent Metadata Snapshot */}
          <div className="mt-auto pt-4 border-t border-[#292936] space-y-2 text-[11px] text-[#777487]">
            <div className="flex justify-between font-mono">
              <span>Category:</span>
              <span className="text-[#A5A2B4] capitalize">{agent.category}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Tools:</span>
              <span className="text-[#A5A2B4]">{agent.tools.length} active</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Review Gate:</span>
              <span className="text-[#65D6A3]">
                {agent.humanApprovalRequired !== false ? 'Enforced' : 'Disabled'}
              </span>
            </div>
          </div>
        </nav>

        {/* Center: Active Configuration Editor */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Right: Collapsible Validation Summary Panel (~320px on desktop) */}
        {isValidationOpen && (
          <>
            {/* Desktop fixed sidebar */}
            <aside className="hidden xl:block w-80 shrink-0 border-l border-[#292936] p-4 bg-[#0D0D13]/50 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
              {validationPanelNode}
            </aside>

            {/* Mobile / Tablet slide-over modal drawer */}
            <div className="xl:hidden fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
              <div
                className="w-full max-w-sm h-full bg-[#0D0D13] border-l border-[#292936] p-4 overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Agent Configuration Audit"
              >
                {validationPanelNode}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
