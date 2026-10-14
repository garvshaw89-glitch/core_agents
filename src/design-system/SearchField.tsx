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
        <Search size={14} className="absolute left-3 text-[#777487] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-[#111118] text-[#F4F2FA] placeholder-[#777487] text-xs sm:text-sm pl-9 pr-9 py-2 rounded-xl border border-[#292936] hover:border-[#3D3D4E] focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] focus:outline-none transition-all duration-150"
          {...props}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 text-[#777487] hover:text-[#F4F2FA] rounded-md transition-colors"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        ) : shortcut ? (
          <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#171720] border border-[#292936] text-[10px] font-mono text-[#777487]">
            {shortcut}
          </div>
        ) : null}
      </div>
    );
  }
);

SearchField.displayName = 'SearchField';
