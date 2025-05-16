import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, leftIcon, rightIcon, helperText, label, ...props }, ref) => {
    const id = props.id || Math.random().toString(36).slice(2, 11);
    const validationState = error ? 'error' : success ? 'success' : 'default';
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            id={id}
            className={cn(
              // Base input styles with direct Tailwind utility classes
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
              'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-primary-400 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-gray-700 dark:bg-gray-950 dark:ring-offset-gray-950',
              'dark:placeholder:text-gray-400 dark:focus-visible:ring-primary-800',
              
              // Conditional styling
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              validationState === 'error' && 'border-red-500 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-500',
              validationState === 'success' && 'border-green-500 focus-visible:ring-green-500 dark:border-green-500 dark:focus-visible:ring-green-500',
              className
            )}
            
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={`${id}-description`}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p 
            id={`${id}-description`}
            className={cn(
              "text-xs",
              validationState === 'error' ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
