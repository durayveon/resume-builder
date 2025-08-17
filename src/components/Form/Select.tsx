import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

export default function Select({
  label,
  error,
  helperText,
  className = '',
  fullWidth = false,
  options,
  ...props
}: SelectProps) {
  const selectId = React.useId();
  const hasError = !!error;

  return (
    <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-full sm:w-auto', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            'block text-sm font-medium',
            hasError ? 'text-red-600' : 'text-gray-700'
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm',
            hasError
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            props.disabled ? 'bg-gray-100 opacity-70' : 'bg-white',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {hasError ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}
