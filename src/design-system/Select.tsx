import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#A5A2B4]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full bg-[#111118] text-[#F4F2FA] text-xs sm:text-sm rounded-xl border pl-3.5 pr-9 py-2.5 appearance-none cursor-pointer transition-all duration-150 focus:outline-none focus:ring-1 ${
              error
                ? 'border-[#F07885] focus:border-[#F07885] focus:ring-[#F07885]'
                : 'border-[#292936] hover:border-[#3D3D4E] focus:border-[#A78BFA] focus:ring-[#A78BFA]'
            } disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[#111118] text-[#F4F2FA]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#777487]">
            <ChevronDown size={14} />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#F07885]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#777487]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
