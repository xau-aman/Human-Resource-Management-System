import React, { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  iconBg?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, iconBg = 'bg-indigo-500/20 text-indigo-400', className }: StatCardProps) {
  return (
    <div className={clsx('stat-card p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {trend && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.06]">
          <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded-md', trend.value >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
