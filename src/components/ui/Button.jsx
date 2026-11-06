// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Componente de Botão do Design System Co.Nexo SENAC
 * Bordas estritas entre 4px e 8px (rounded-md = 6px)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'button',
  ...props
}) {
  const variants = {
    primary:
      'bg-[#004A8D] text-white hover:bg-[#003B70] active:scale-[0.99] border-transparent shadow-xs',
    accent:
      'bg-[#F29100] text-slate-950 font-black hover:bg-[#D97D00] active:scale-[0.99] border-transparent shadow-xs',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:scale-[0.99] border-slate-200/60',
    outline:
      'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300 active:scale-[0.99] shadow-2xs',
    destructive:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 active:scale-[0.99]',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent',
    success:
      'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-200 active:scale-[0.99]'
  };

  const sizes = {
    sm: 'text-[11px] px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs px-4 py-2.5 rounded-2xl gap-2 font-bold',
    lg: 'text-sm px-5 py-3 rounded-2xl gap-2.5 font-bold',
    icon: 'p-2.5 rounded-xl'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-bold tracking-tight
        transition-all duration-150 cursor-pointer select-none
        border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004A8D] focus-visible:ring-offset-2
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />
      )}
      
      <span>{children}</span>

      {!isLoading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
