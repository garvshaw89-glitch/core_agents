import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this view. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-8 rounded-2xl bg-[#F07885]/5 border border-[#F07885]/20 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-[#F07885]/15 text-[#F07885] flex items-center justify-center mb-3">
        <AlertCircle size={20} />
      </div>
      <h3 className="text-base font-bold text-[#F4F2FA] mb-1">{title}</h3>
      <p className="text-xs text-[#A5A2B4] max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={13} />}
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
};
