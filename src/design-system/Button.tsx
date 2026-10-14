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
    'bg-[#F4F2FA] text-[#09090D] hover:bg-white active:bg-[#E2DEEE] shadow-sm hover:shadow-[#A78BFA]/10 font-semibold',
  secondary:
    'bg-[#171720] text-[#F4F2FA] hover:bg-[#20202C] border border-[#292936] hover:border-[#3D3D4E] font-medium',
  outline:
    'bg-transparent text-[#F4F2FA] hover:bg-[#171720] border border-[#292936] hover:border-[#3D3D4E] font-medium',
  ghost:
    'bg-transparent text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720] font-medium',
  danger:
    'bg-[#F07885]/10 text-[#F07885] hover:bg-[#F07885]/20 border border-[#F07885]/30 font-semibold',
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
