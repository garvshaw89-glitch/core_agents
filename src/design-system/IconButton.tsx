import React, { forwardRef } from 'react';
import { ButtonVariant, ButtonSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'p-1 rounded-md',
  sm: 'p-1.5 rounded-lg',
  md: 'p-2 rounded-xl',
  lg: 'p-2.5 rounded-xl',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#38D9FF] text-[#080B16] hover:bg-[#80E5FF] active:bg-[#22B8DC] shadow-sm',
  secondary: 'bg-[#111827] text-[#F4F7FC] hover:bg-[#151D2E] border border-slate-700/40 hover:border-[#38D9FF]/40',
  outline: 'bg-transparent text-[#F4F7FC] hover:bg-[#111827] border border-slate-700/50 hover:border-slate-500',
  ghost: 'bg-transparent text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#111827]/80',
  danger: 'bg-[#FB7185]/10 text-[#FB7185] hover:bg-[#FB7185]/20 border border-[#FB7185]/30',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'sm',
      isLoading = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A78BFA] focus-visible:outline-offset-1 disabled:opacity-40 disabled:cursor-not-allowed ${
          variantStyles[variant]
        } ${iconSizeStyles[size]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
