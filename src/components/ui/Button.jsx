// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Componente de Botão do Design System Apple HIG & SENAC
 * Curvaturas suaves, feedback háptico visual (active:scale-95), transições fluidas.
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
      'bg-[#004A8D] text-white hover:bg-[#003B70] border-transparent shadow-sm shadow-[#004A8D]/20',
    accent:
      'bg-[#F29100] text-slate-950 font-bold hover:bg-[#D97D00] border-transparent shadow-sm shadow-[#F29100]/25',
    secondary:
      'bg-black/[0.04] text-[#1D1D1F] hover:bg-black/[0.08] border-black/[0.04]',
    outline:
      'bg-white/80 hover:bg-white text-[#1D1D1F] border-black/[0.08] shadow-xs',
    destructive:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200/60',
    ghost:
      'bg-transparent text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-black/[0.04] border-transparent',
    success:
      'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-200/60'
  };

  const sizes = {
    sm: 'text-[11px] px-3.5 py-1.5 rounded-full gap-1.5 font-semibold',
    md: 'text-xs px-4 py-2 rounded-full gap-2 font-semibold',
    lg: 'text-sm px-5 py-2.5 rounded-full gap-2.5 font-bold',
    icon: 'p-2 rounded-full'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold tracking-tight
        transition-all duration-150 cursor-pointer select-none active:scale-95
        border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004A8D] focus-visible:ring-offset-2
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : LeftIcon ? (
        <LeftIcon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      <span>{children}</span>
      {RightIcon && !isLoading && <RightIcon className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}
