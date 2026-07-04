import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray' | 'orange';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  green: 'badge-neo-green',
  red: 'badge-neo-red',
  yellow: 'badge-neo-yellow',
  blue: 'badge-neo-blue',
  purple: 'badge-neo-purple',
  gray: 'badge-neo-gray',
  orange: 'badge-neo-yellow',
};

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  );
}
