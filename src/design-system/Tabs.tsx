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
      className={`flex items-center gap-1 p-1 bg-[#111118] border border-[#292936] rounded-xl overflow-x-auto no-scrollbar ${className}`}
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
                ? 'bg-[#171720] text-[#F4F2FA] shadow-sm border border-[#292936] font-semibold'
                : 'text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720]/40'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-[#A78BFA]/15 text-[#C4B5FD]' : 'bg-[#171720] text-[#777487]'
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
