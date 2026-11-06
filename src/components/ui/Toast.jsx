// src/components/ui/Toast.jsx
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast de Feedback do Design System Co.Nexo
 * Notificação visual não-intrusiva que substitui alertas nativos do navegador.
 */
export default function Toast({
  isOpen,
  message,
  title,
  type = 'success', // 'success' | 'error' | 'info'
  onClose,
  actionLabel,
  onAction,
  duration = 4000
}) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-200',
      bg: 'bg-white',
      iconColor: 'text-emerald-700',
      headerColor: 'text-emerald-950'
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-200',
      bg: 'bg-white',
      iconColor: 'text-rose-600',
      headerColor: 'text-rose-950'
    },
    info: {
      icon: Info,
      border: 'border-[#004A8D]/20',
      bg: 'bg-white',
      iconColor: 'text-[#004A8D]',
      headerColor: 'text-slate-900'
    }
  };

  const currentConfig = typeConfig[type] || typeConfig.info;
  const Icon = currentConfig.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slide-up"
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-2xl border shadow-lg
          ${currentConfig.bg} ${currentConfig.border}
        `}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${currentConfig.iconColor}`} />

        <div className="flex-1 text-left">
          {title && (
            <h4 className={`text-xs font-black ${currentConfig.headerColor}`}>
              {title}
            </h4>
          )}
          <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
            {message}
          </p>

          {actionLabel && onAction && (
            <button
              onClick={() => {
                onAction();
                onClose();
              }}
              className="mt-2 text-xs font-black text-[#004A8D] hover:underline cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar notificação"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
