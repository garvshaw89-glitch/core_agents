import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#9AA7BC]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#64748B]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[#0D1220] text-[#F4F7FC] placeholder-[#64748B] text-xs sm:text-sm rounded-xl border transition-all duration-150 focus:outline-none focus:ring-1 ${
              error
                ? 'border-[#FB7185] focus:border-[#FB7185] focus:ring-[#FB7185]'
                : 'border-slate-800/70 hover:border-slate-700 focus:border-[#38D9FF] focus:ring-[#38D9FF]'
            } ${leftElement ? 'pl-9' : 'pl-3.5'} ${rightElement ? 'pr-9' : 'pr-3.5'} py-2.5 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-[#64748B]">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#FB7185]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#64748B]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
