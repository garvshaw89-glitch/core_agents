import React, { useState, useEffect, useRef } from 'react';
import { Search, Bot, GitFork, BookOpen, Layers, Settings, X, ArrowRight, Plus } from 'lucide-react';
import { Agent, Workflow } from '../../types/app';
import { appStateService } from '../../services/appStateService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
  onCreateAgent: () => void;
  onCreateWorkflow: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onCreateAgent,
  onCreateWorkflow,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const agents = appStateService.getAgents();
  const workflows = appStateService.getWorkflows();

  const pages = [
    { id: 'overview', title: 'Overview Dashboard', category: 'Navigation', icon: Layers },
    { id: 'agents', title: 'My Agents', category: 'Navigation', icon: Bot },
    { id: 'templates', title: 'Specialist Templates', category: 'Navigation', icon: BookOpen },
    { id: 'workflows', title: 'Automated Workflows', category: 'Navigation', icon: GitFork },
    { id: 'activity', title: 'Activity & Trace Logs', category: 'Navigation', icon: Layers },
    { id: 'knowledge', title: 'Knowledge Base', category: 'Navigation', icon: BookOpen },
    { id: 'integrations', title: 'Integrations & Scopes', category: 'Navigation', icon: Layers },
    { id: 'settings', title: 'Workspace Settings', category: 'Navigation', icon: Settings },
  ];

  const filteredPages = pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  const filteredAgents = agents.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));
  const filteredWorkflows = workflows.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()));

  const allItems = [
    ...filteredPages.map((p) => ({ type: 'page', id: p.id, title: p.title, subtitle: 'Go to page', icon: p.icon })),
    ...filteredAgents.map((a) => ({ type: 'agent', id: a.id, title: a.name, subtitle: `Agent · ${a.status}`, icon: Bot })),
    ...filteredWorkflows.map((w) => ({ type: 'workflow', id: w.id, title: w.name, subtitle: `Workflow · ${w.status}`, icon: GitFork })),
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = allItems[selectedIndex];
        if (selected) {
          if (selected.type === 'page') onNavigate(selected.id);
          else if (selected.type === 'agent') onNavigate('agents');
          else if (selected.type === 'workflow') onNavigate('workflows');
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-28 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-100"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-[#111118] border border-[#292936] rounded-2xl shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#292936] gap-3">
          <Search size={16} className="text-[#A78BFA] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages, agents, workflows, or actions..."
            className="w-full bg-transparent text-[#F4F2FA] placeholder-[#777487] text-xs sm:text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#777487] hover:text-[#F4F2FA]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Quick Actions Row */}
        <div className="px-4 py-2 border-b border-[#292936]/60 bg-[#09090D] flex items-center gap-2 overflow-x-auto text-[11px] text-[#A5A2B4]">
          <span className="text-[#777487]">Quick:</span>
          <button
            type="button"
            onClick={() => {
              onCreateAgent();
              onClose();
            }}
            className="px-2 py-0.5 rounded bg-[#171720] hover:bg-[#20202C] text-[#F4F2FA] border border-[#292936] flex items-center gap-1 cursor-pointer"
          >
            <Plus size={11} />
            <span>New Agent</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onCreateWorkflow();
              onClose();
            }}
            className="px-2 py-0.5 rounded bg-[#171720] hover:bg-[#20202C] text-[#F4F2FA] border border-[#292936] flex items-center gap-1 cursor-pointer"
          >
            <Plus size={11} />
            <span>New Workflow</span>
          </button>
        </div>

        {/* Search results list */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#777487]">
              No results found for "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  onClick={() => {
                    if (item.type === 'page') onNavigate(item.id);
                    else if (item.type === 'agent') onNavigate('agents');
                    else if (item.type === 'workflow') onNavigate('workflows');
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#171720] text-[#F4F2FA]' : 'text-[#A5A2B4] hover:bg-[#171720]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#A78BFA]/20 text-[#C4B5FD]' : 'bg-[#171720] text-[#777487]'
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-[#F4F2FA] truncate">{item.title}</div>
                      <div className="text-[10px] text-[#777487] truncate">{item.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <ArrowRight size={13} className="text-[#A78BFA] shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>

        {/* Bottom hints */}
        <div className="px-4 py-2 bg-[#09090D] border-t border-[#292936] text-[10px] text-[#777487] flex items-center justify-between">
          <span>Navigate with &uarr; &darr;</span>
          <span>Press Enter to select · Esc to close</span>
        </div>
      </div>
    </div>
  );
};
