import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray' | 'orange';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  green: 'badge-emerald',
  red: 'badge-red',
  yellow: 'badge-amber',
  blue: 'badge-indigo',
  purple: 'badge-violet',
  gray: 'badge-gray',
  orange: 'badge-amber',
};

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
