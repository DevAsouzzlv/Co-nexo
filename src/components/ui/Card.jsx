// src/components/ui/Card.jsx
import React from 'react';

/**
 * Cartão de Superfície Padronizado do Design System Co.Nexo
 * Borda estrita entre 4px e 8px (rounded-lg = 8px)
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'p-5',
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`
        bg-white rounded-lg border border-slate-200/90 shadow-2xs
        ${hoverable ? 'hover:shadow-sm hover:border-slate-300 transition-all duration-150' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}
