// src/components/ui/Badge.jsx
import React from 'react';

/**
 * Pílula / Badge do Design System Co.Nexo
 * Garante contraste semântico conforme WCAG 2.2 AA.
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  icon: Icon
}) {
  const variants = {
    senac:
      'bg-[#004A8D]/10 text-[#004A8D] border-[#004A8D]/20',
    senacSolid:
      'bg-[#004A8D] text-white border-transparent font-extrabold',
    accent:
      'bg-[#84BD00] text-slate-950 border-transparent font-black shadow-2xs',
    accentSubtle:
      'bg-[#84BD00]/15 text-[#4E7100] border-[#84BD00]/30 font-bold',
    success:
      'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning:
      'bg-amber-50 text-amber-900 border-amber-200/80',
    destructive:
      'bg-rose-50 text-rose-800 border-rose-200/80',
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200/70'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-full font-bold',
    md: 'text-xs px-2.5 py-0.5 rounded-full font-bold',
    lg: 'text-xs px-3 py-1 rounded-full font-extrabold'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border select-none tracking-tight
        ${variants[variant] || variants.neutral}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
