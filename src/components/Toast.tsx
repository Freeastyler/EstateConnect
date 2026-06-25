import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' 
          ? CheckCircle2 
          : toast.type === 'error' 
            ? AlertCircle 
            : Info;

        const bgClass = toast.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : toast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-slate-50 border-slate-200 text-slate-800';

        const iconColor = toast.type === 'success'
          ? 'text-emerald-500'
          : toast.type === 'error'
            ? 'text-rose-500'
            : 'text-slate-500';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in ${bgClass}`}
            role="alert"
          >
            <Icon className={`h-5 w-5 shrink-0 ${iconColor} mt-0.5`} />
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => onClose(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
