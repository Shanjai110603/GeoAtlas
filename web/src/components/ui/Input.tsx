import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-slate-300">{label}</label>}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2 text-sm bg-slate-900/80 border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/30',
              className
            )
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
