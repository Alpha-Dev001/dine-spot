import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let Icon = AlertCircle;
            let iconColor = 'text-orange-300';
            let borderColor = 'border-orange-300/30';
            let bgColor = 'bg-[#0f0d0c]';
            let title = 'SYS_MSG';

            if (t.type === 'success') {
              Icon = CheckCircle2;
              iconColor = 'text-emerald-400';
              borderColor = 'border-emerald-500/30';
              title = 'SYS_SUCCESS';
            } else if (t.type === 'error') {
              Icon = AlertTriangle;
              iconColor = 'text-rose-400';
              borderColor = 'border-rose-500/30';
              title = 'SYS_ERROR';
            } else if (t.type === 'warning') {
              Icon = AlertCircle;
              iconColor = 'text-orange-400';
              borderColor = 'border-orange-500/30';
              title = 'SYS_WARN';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className={`pointer-events-auto w-80 p-4 rounded-xl border ${borderColor} ${bgColor}/90 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-start gap-3`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
                <div className="flex flex-col">
                  <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${iconColor}`}>
                    {title}
                  </span>
                  <span className="font-sans text-xs text-neutral-200 mt-1.5 leading-relaxed font-light">
                    {t.message}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
