import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = '' }) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 p-1 bg-[#0D1220] border border-slate-800/60 rounded-xl overflow-x-auto no-scrollbar ${className}`}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-[#151D2E] text-[#F4F7FC] shadow-sm border border-slate-700/50 font-semibold'
                : 'text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#111827]'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  isActive ? 'bg-[#38D9FF]/15 text-[#38D9FF]' : 'bg-[#111827] text-[#64748B]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
