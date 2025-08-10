'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Toast = { id: string; message: string; type?: 'info' | 'success' | 'error' };

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, message, type }]);
      // auto dismiss
      setTimeout(() => remove(id), 2500);
    },
    [remove],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'pointer-events-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-lg backdrop-blur ' +
              (t.type === 'success'
                ? 'border-emerald-200'
                : t.type === 'error'
                ? 'border-red-200'
                : '')
            }
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full '"
              style={{
                backgroundColor:
                  t.type === 'success' ? '#10B981' : t.type === 'error' ? '#EF4444' : '#6366F1',
              }}
            />
            <span className="text-slate-800">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
