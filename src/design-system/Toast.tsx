import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              role="alert"
              className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[#171720] border border-[#292936] shadow-2xl text-left animate-in slide-in-from-bottom-2 duration-150"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSuccess
                    ? 'bg-[#65D6A3]/15 text-[#65D6A3]'
                    : isError
                    ? 'bg-[#F07885]/15 text-[#F07885]'
                    : isWarning
                    ? 'bg-[#F2C879]/15 text-[#F2C879]'
                    : 'bg-[#A78BFA]/15 text-[#A78BFA]'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 size={14} />
                ) : isError ? (
                  <AlertCircle size={14} />
                ) : (
                  <Info size={14} />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="text-xs font-semibold text-[#F4F2FA]">{toast.title}</div>
                {toast.message && (
                  <div className="text-[11px] text-[#A5A2B4] mt-0.5 leading-relaxed">
                    {toast.message}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#777487] hover:text-[#F4F2FA] p-0.5 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
