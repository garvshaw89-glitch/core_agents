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
  primary: 'bg-[#F4F2FA] text-[#09090D] hover:bg-white active:bg-[#E2DEEE]',
  secondary: 'bg-[#171720] text-[#F4F2FA] hover:bg-[#20202C] border border-[#292936] hover:border-[#3D3D4E]',
  outline: 'bg-transparent text-[#F4F2FA] hover:bg-[#171720] border border-[#292936] hover:border-[#3D3D4E]',
  ghost: 'bg-transparent text-[#A5A2B4] hover:text-[#F4F2FA] hover:bg-[#171720]',
  danger: 'bg-[#F07885]/10 text-[#F07885] hover:bg-[#F07885]/20 border border-[#F07885]/30',
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
