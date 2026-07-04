import React from 'react';
import { clsx } from 'clsx';

const colors = ['bg-[#fce4ec]', 'bg-[#e8f5e9]', 'bg-[#e3f2fd]', 'bg-[#fff3e0]', 'bg-[#f3e5f5]'];

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colorIdx = name.charCodeAt(0) % colors.length;
  const sizes = { sm: 'w-8 h-8 text-[10px]', md: 'w-10 h-10 text-xs', lg: 'w-12 h-12 text-sm' };

  return (
    <div className={clsx(`${colors[colorIdx]} rounded-full border-2 border-black flex items-center justify-center font-black text-black flex-shrink-0`, sizes[size], className)}>
      {initials}
    </div>
  );
}
