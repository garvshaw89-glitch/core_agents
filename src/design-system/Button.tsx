import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#38D9FF] text-[#080B16] hover:bg-[#80E5FF] active:bg-[#22B8DC] shadow-sm hover:shadow-[0_0_16px_rgba(56,217,255,0.25)] font-semibold',
  secondary:
    'bg-[#111827] text-[#F4F7FC] hover:bg-[#151D2E] border border-slate-700/40 hover:border-[#38D9FF]/40 font-medium',
  outline:
    'bg-transparent text-[#F4F7FC] hover:bg-[#111827] border border-slate-700/50 hover:border-slate-500 font-medium',
  ghost:
    'bg-transparent text-[#9AA7BC] hover:text-[#F4F7FC] hover:bg-[#111827]/80 font-medium',
  danger:
    'bg-[#FB7185]/10 text-[#FB7185] hover:bg-[#FB7185]/20 border border-[#FB7185]/30 font-semibold',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-md gap-1.5',
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'sm',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
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
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A78BFA] focus-visible:outline-offset-1 disabled:opacity-40 disabled:cursor-not-allowed select-none ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} className="animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
