import React from 'react';
import { cn } from '@/lib/utils';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function TextField({
  label,
  error,
  helperText,
  className = '',
  fullWidth = false,
  ...props
}: TextFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;

  return (
    <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-full sm:w-auto', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium',
            hasError ? 'text-red-600' : 'text-gray-700'
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm',
            hasError
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            props.disabled ? 'bg-gray-100 opacity-70' : 'bg-white',
            className
          )}
          {...props}
        />
      </div>
      {hasError ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}
