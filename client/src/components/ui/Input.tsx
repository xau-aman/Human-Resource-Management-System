import React, { type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, leftIcon, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-bold uppercase tracking-wider text-black/50">{label}</label>}
    <div className="relative">
      {leftIcon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30">{leftIcon}</span>}
      <input
        ref={ref}
        className={clsx(
          'input-neo w-full px-4 py-2.5 text-sm',
          leftIcon && 'pl-10',
          error && 'border-red-500 focus:border-red-500 focus:shadow-[3px_3px_0px_0px_rgba(220,38,38,0.3)]',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
  </div>
));
Input.displayName = 'Input';
