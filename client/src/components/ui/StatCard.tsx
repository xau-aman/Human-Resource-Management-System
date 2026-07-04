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

export function StatCard({ title, value, icon, trend, iconBg = 'bg-[#fce4ec] text-[#C54B8C]', className }: StatCardProps) {
  return (
    <div className={clsx('stat-neo p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{title}</p>
        <div className={clsx('w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-black tracking-tight">{value}</p>
      {trend && (
        <div className="flex items-center gap-1.5 pt-2 border-t-2 border-black/10">
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border', trend.value >= 0 ? 'bg-green-100 text-green-800 border-green-800' : 'bg-red-100 text-red-800 border-red-800')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-[10px] text-black/40 font-medium">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
