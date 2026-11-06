// src/components/ui/Input.jsx
import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Campo de Entrada de Texto do Design System Co.Nexo
 * Bordas estritas entre 4px e 8px (rounded-md = 6px)
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = '',
    required = false,
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-slate-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`
            w-full text-xs rounded-md border transition-all duration-150
            py-2 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 font-medium
            focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004A8D] focus:border-[#004A8D]
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
            ${LeftIcon ? 'pl-9' : 'pl-3'}
            ${RightIcon || error ? 'pr-9' : 'pr-3'}
            ${error ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />

        {error ? (
          <div className="absolute right-3 text-rose-500 pointer-events-none flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        ) : RightIcon ? (
          <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center justify-center">
            <RightIcon className="w-4 h-4" />
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[11px] text-slate-500 font-medium">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
