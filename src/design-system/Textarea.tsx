import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#A5A2B4]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-[#111118] text-[#F4F2FA] placeholder-[#777487] text-xs sm:text-sm rounded-xl border p-3 leading-relaxed transition-all duration-150 focus:outline-none focus:ring-1 resize-y min-h-[90px] ${
            error
              ? 'border-[#F07885] focus:border-[#F07885] focus:ring-[#F07885]'
              : 'border-[#292936] hover:border-[#3D3D4E] focus:border-[#A78BFA] focus:ring-[#A78BFA]'
          } disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#F07885]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#777487]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
