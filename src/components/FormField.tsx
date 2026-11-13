import React, { useId, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  rows = 4,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.trim().length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-150 pointer-events-none font-display font-medium ${
          isFloating
            ? 'top-2 text-[11px] text-[#0F4C5C]'
            : 'top-4 text-sm text-zinc-500'
        }`}
      >
        {label}
        {required ? ' *' : ''}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl bg-white text-[#18181B] border px-4 pt-7 pb-3 font-body text-base focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-600 bg-red-50/40 focus:ring-red-200'
              : 'border-zinc-300 hover:border-zinc-400 focus:border-[#C84B13] focus:ring-[#C84B13]/15'
          }`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl bg-white text-[#18181B] border px-4 pt-6 pb-2.5 font-body text-base focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-600 bg-red-50/40 focus:ring-red-200'
              : 'border-zinc-300 hover:border-zinc-400 focus:border-[#C84B13] focus:ring-[#C84B13]/15'
          }`}
        />
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  error?: string;
}

export function ConsentCheckbox({
  checked,
  onChange,
  label,
  error,
}: ConsentCheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded shrink-0 accent-[#C84B13] border-zinc-300 cursor-pointer"
        />
        <span className="font-body text-sm leading-relaxed text-zinc-600 group-hover:text-zinc-900">
          {label}
        </span>
      </label>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
