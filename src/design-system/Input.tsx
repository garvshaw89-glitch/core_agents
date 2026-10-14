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
          <label htmlFor={inputId} className="block text-xs font-medium text-[#A5A2B4]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#777487]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[#111118] text-[#F4F2FA] placeholder-[#777487] text-xs sm:text-sm rounded-xl border transition-all duration-150 focus:outline-none focus:ring-1 ${
              error
                ? 'border-[#F07885] focus:border-[#F07885] focus:ring-[#F07885]'
                : 'border-[#292936] hover:border-[#3D3D4E] focus:border-[#A78BFA] focus:ring-[#A78BFA]'
            } ${leftElement ? 'pl-9' : 'pl-3.5'} ${rightElement ? 'pr-9' : 'pr-3.5'} py-2.5 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-[#777487]">
              {rightElement}
            </div>
          )}
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

Input.displayName = 'Input';
