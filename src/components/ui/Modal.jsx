// src/components/ui/Modal.jsx
import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

/**
 * Componente Modal Base Acessível do Design System Co.Nexo
 * Atende WCAG 2.2 AA e padrão estético oficial SENAC (rounded-3xl, azul SENAC #004A8D).
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
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
          bg-white rounded-3xl shadow-2xl w-full border border-slate-200/90 overflow-hidden
          transition-all duration-150 outline-none
          ${maxWidth}
          ${className}
        `}
      >
        {/* Cabeçalho Oficial Co.Nexo SENAC */}
        <div className="bg-gradient-to-r from-[#00386C] via-[#004A8D] to-[#00264A] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-10 w-10 bg-[#F29100] text-slate-950 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 id={titleId} className="text-base font-black tracking-tight text-white">
                  {title}
                </h3>
                {badge && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
