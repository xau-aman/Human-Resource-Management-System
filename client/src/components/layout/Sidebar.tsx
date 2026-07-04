import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboard, Users, Clock, CalendarOff, TrendingUp, Layers, BarChart2, Sparkles, Settings, Zap } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/attendance', icon: Clock, label: 'Attendance' },
  { to: '/leave', icon: CalendarOff, label: 'Leave' },
  { to: '/performance', icon: TrendingUp, label: 'Performance' },
  { to: '/skills', icon: Layers, label: 'Skills Matrix' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen sidebar-bg flex flex-col flex-shrink-0">
      <div className="flex items-center gap-3 px-5 h-14 border-b border-indigo-500/10 flex-shrink-0">
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center" style={{ boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">WorkZen</p>
          <p className="text-[10px] text-indigo-400/50 mt-0.5">HRMS Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
              isActive
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
            )}>
            {({ isActive }) => (
              <>
                <Icon size={14} className={isActive ? 'text-indigo-400' : ''} />
                {label}
                {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 6px rgba(99,102,241,0.8)' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-indigo-500/10">
        <p className="text-[10px] text-slate-700 text-center">WorkZen v1.0 · Hackathon</p>
      </div>
    </aside>
  );
}
