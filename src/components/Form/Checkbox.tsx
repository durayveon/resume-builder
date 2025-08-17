import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Checkbox({
  label,
  error,
  helperText,
  className = '',
  fullWidth = false,
  ...props
}: CheckboxProps) {
  const checkboxId = React.useId();
  const hasError = !!error;

  return (
    <div className={cn('space-y-1', fullWidth ? 'w-full' : 'w-full sm:w-auto', className)}>
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={checkboxId}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
              hasError
                ? 'border-red-300 text-red-900 focus:ring-red-500'
                : 'border-gray-300',
              props.disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'
            )}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              htmlFor={checkboxId}
              className={cn(
                'font-medium',
                hasError ? 'text-red-600' : 'text-gray-700',
                props.disabled ? 'text-gray-400' : ''
              )}
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {helperText && !hasError && (
              <p className="text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
      {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
