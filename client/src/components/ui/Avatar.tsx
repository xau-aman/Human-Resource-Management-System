import React from 'react';
import { clsx } from 'clsx';

const colors = [
  'from-indigo-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
];

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colorIdx = name.charCodeAt(0) % colors.length;
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-11 h-11 text-sm' };

  return (
    <div className={clsx(`bg-gradient-to-br ${colors[colorIdx]} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg`, sizes[size], className)}>
      {initials}
    </div>
  );
}
