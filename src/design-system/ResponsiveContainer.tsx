import React from 'react';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const maxWidthMap = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1600px]',
  full: 'max-w-full',
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  className = '',
}) => {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthMap[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};
