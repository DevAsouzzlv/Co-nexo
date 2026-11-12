// src/components/ui/Modal.jsx
import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

/**
 * Componente Modal Base com Design Apple HIG & Identidade SENAC
 * Continuous curves (rounded-[28px]), frosted glass backdrop, micro-interactions.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
  maxWidth = 'max-w-lg',
  className = ''
}) {
  const modalRef = useRef(null);
  const reactId = useId();
  const titleId = `modal-title-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-md transition-opacity duration-200 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`
          bg-white rounded-2xl sm:rounded-[28px] shadow-2xl w-full border border-black/[0.08] overflow-hidden
          transition-all duration-200 outline-none max-h-[92dvh] flex flex-col
          ${maxWidth}
          ${className}
        `}
      >
        {/* Cabeçalho Apple / SENAC */}
        <div className="bg-gradient-to-r from-[#00386C] via-[#004A8D] to-[#00264A] px-4 sm:px-6 py-3.5 sm:py-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#84BD00]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 min-w-0 pr-2">
            {Icon && (
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-br from-[#FFAE33] to-[#84BD00] text-slate-950 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </div>
            )}
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 id={titleId} className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                  {title}
                </h3>
                {badge && (
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-blue-100 font-normal mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white/90 hover:text-white flex items-center justify-center transition cursor-pointer relative z-10 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-4 sm:p-6 max-h-[calc(92dvh-4.5rem)] overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
