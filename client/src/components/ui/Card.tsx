import React, { type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
  glow?: boolean;
}

export function Card({ className, padding = true, glow = false, children, ...props }: CardProps) {
  return (
    <div className={clsx(glow ? 'neo-card-accent' : 'neo-card', padding && 'p-5', className)} {...props}>
      {children}
    </div>
  );
}
