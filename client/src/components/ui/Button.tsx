import React, { type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'btn-neo',
  secondary: 'btn-neo-secondary',
  ghost: 'btn-neo-ghost',
  danger: 'btn-neo-danger',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[11px]',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-6 py-3 text-sm',
};

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 font-bold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        variants[variant], sizes[size], className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
