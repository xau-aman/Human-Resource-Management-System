import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { Avatar, Badge } from '../ui';
import { useAuth } from '../../context/AuthContext';

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/': { title: 'Dashboard', sub: 'Welcome back' },
  '/employees': { title: 'Employees', sub: 'Manage your team' },
  '/attendance': { title: 'Attendance', sub: 'Track daily presence' },
  '/leave': { title: 'Leave Management', sub: 'Requests & approvals' },
  '/performance': { title: 'Performance', sub: 'Reviews & scores' },
  '/skills': { title: 'Skills Matrix', sub: 'Team capabilities' },
  '/analytics': { title: 'Analytics', sub: 'Workforce insights' },
  '/ai-insights': { title: 'AI Insights', sub: 'Powered by Gemini 2.5' },
  '/settings': { title: 'Settings', sub: 'System configuration' },
};

const roleBadge: Record<string, 'blue' | 'purple' | 'green' | 'orange'> = {
  ADMIN: 'purple', HR: 'blue', MANAGER: 'green', EMPLOYEE: 'orange',
};

export function Topbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const page = pageTitles[pathname] ?? { title: 'WorkZen', sub: '' };

  return (
    <header className="h-14 topbar-bg flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="text-sm font-bold text-white leading-none">{page.title}</h2>
        <p className="text-[11px] text-slate-600 mt-0.5">{page.sub}</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-white/[0.06] text-slate-600 hover:text-slate-400 transition-all">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" style={{ boxShadow: '0 0 6px rgba(99,102,241,0.8)' }} />
        </button>

        {user && (
          <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-white/[0.06]">
            <Avatar name={user.email} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-300 leading-none capitalize">{user.email.split('@')[0]}</p>
              <Badge variant={roleBadge[user.role] ?? 'gray'} className="mt-0.5 text-[10px]">{user.role}</Badge>
            </div>
          </div>
        )}

        <button onClick={async () => { await logout(); navigate('/login'); }}
          className="ml-1 p-2 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all" title="Logout">
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
