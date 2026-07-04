import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboard, Users, Clock, CalendarOff, TrendingUp, Layers, BarChart2, Sparkles, Settings } from 'lucide-react';
import { Logo } from '../ui';
import { useAuth } from '../../context/AuthContext';

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', icon: Users, label: 'Employees', roles: ['ADMIN', 'HR'] },
  { to: '/attendance', icon: Clock, label: 'Attendance', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/leave', icon: CalendarOff, label: 'Leave', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/performance', icon: TrendingUp, label: 'Performance', roles: ['ADMIN', 'HR', 'MANAGER'] },
  { to: '/skills', icon: Layers, label: 'Skills', roles: ['ADMIN', 'HR', 'MANAGER'] },
  { to: '/analytics', icon: BarChart2, label: 'Analytics', roles: ['ADMIN', 'HR'] },
  { to: '/ai-insights', icon: Sparkles, label: 'AI Insights', roles: ['ADMIN', 'HR'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
];

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role ?? 'EMPLOYEE';
  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-[#fce4ec] rounded-[2rem] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sticky top-20 h-fit">
      <div className="flex items-center gap-3 px-3 pb-4 mb-3 border-b-2 border-black/10">
        <Logo size="sm" />
        <div>
          <p className="text-sm font-black text-black uppercase tracking-wide">WorkZen</p>
          <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">HRMS</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all',
              isActive
                ? 'bg-white text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'text-black/50 hover:text-black hover:bg-white/50'
            )}>
            <Icon size={15} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
