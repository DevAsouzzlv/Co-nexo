// src/components/ui/Select.jsx
import React, { forwardRef, useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Seletor Dropdown do Design System Co.Nexo
 */
const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    options = [],
    children,
    className = '',
    required = false,
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-slate-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`
            w-full text-xs rounded-xl border transition-all duration-150 appearance-none
            py-2.5 pl-3.5 pr-10 bg-slate-50/70 text-slate-900 font-medium cursor-pointer
            focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A8D]/20 focus:border-[#004A8D]
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
            ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30' : 'border-slate-200'}
            ${className}
          `}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
        </select>

        <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
          {error ? (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-[11px] font-semibold text-rose-600">
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

export default Select;
