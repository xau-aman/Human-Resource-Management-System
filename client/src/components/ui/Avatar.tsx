import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };

const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500'];

function getColor(name: string) {
  return colors[name.charCodeAt(0) % colors.length];
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={clsx('rounded-full object-cover', sizes[size], className)} />;
  }
  return (
    <div className={clsx('rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0', sizes[size], getColor(name), className)}>
      {initials}
    </div>
  );
}
