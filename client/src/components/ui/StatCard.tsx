import React, { type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  iconColor?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, iconColor = 'bg-indigo-50 text-indigo-600', className }: StatCardProps) {
  return (
    <Card className={clsx('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={clsx('p-2 rounded-lg', iconColor)}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className={clsx('text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </Card>
  );
}
