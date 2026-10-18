import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  shortcut?: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ value, onChange, onClear, placeholder = 'Search agents, tools, workflows...', shortcut, className = '', ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <Search size={14} className="absolute left-3 text-[#64748B] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-[#0D1220] text-[#F4F7FC] placeholder-[#64748B] text-xs sm:text-sm pl-9 pr-9 py-2 rounded-xl border border-slate-800/70 hover:border-slate-700 focus:border-[#38D9FF] focus:ring-1 focus:ring-[#38D9FF] focus:outline-none transition-all duration-150"
          {...props}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 text-[#64748B] hover:text-[#F4F7FC] rounded-md transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        ) : shortcut ? (
          <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#151D2E] border border-slate-700/50 text-[10px] font-mono text-[#9AA7BC]">
            {shortcut}
          </div>
        ) : null}
      </div>
    );
  }
);

SearchField.displayName = 'SearchField';
