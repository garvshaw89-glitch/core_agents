import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidthMap[maxWidth]} bg-[#111118] border border-[#292936] rounded-2xl shadow-2xl p-6 my-8 text-left animate-in fade-in-0 zoom-in-95 duration-150`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#777487] hover:text-[#F4F2FA] hover:bg-[#171720] transition-colors"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        {(title || description) && (
          <div className="mb-5 pr-8">
            {title && <h3 className="text-base sm:text-lg font-bold text-[#F4F2FA]">{title}</h3>}
            {description && <p className="text-xs text-[#A5A2B4] mt-1 leading-relaxed">{description}</p>}
          </div>
        )}

        <div className="text-xs sm:text-sm text-[#A5A2B4]">{children}</div>

        {footer && <div className="mt-6 pt-4 border-t border-[#292936] flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};
