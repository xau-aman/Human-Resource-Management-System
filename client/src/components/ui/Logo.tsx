import React from 'react';
import { clsx } from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={clsx(
      'bg-[#C54B8C] rounded-xl border-2 border-black flex items-center justify-center font-black text-white select-none',
      sizes[size],
      size === 'sm' && 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      size === 'md' && 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
      size === 'lg' && 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      size === 'xl' && 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rounded-2xl border-3',
      className
    )}>
      W
    </div>
  );
}
