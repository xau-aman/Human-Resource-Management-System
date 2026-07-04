import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { Avatar, Badge } from '../ui';
import { useAuth } from '../../context/AuthContext';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
  '/leave': 'Leave Management',
  '/performance': 'Performance',
  '/skills': 'Skills Matrix',
  '/analytics': 'Analytics',
  '/ai-insights': 'AI Insights',
  '/settings': 'Settings',
};

const roleBadgeVariant: Record<string, 'blue' | 'purple' | 'green' | 'orange'> = {
  ADMIN: 'purple',
  HR: 'blue',
  MANAGER: 'green',
  EMPLOYEE: 'orange',
};

export function Topbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = pageTitles[pathname] ?? 'WorkZen';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <Avatar name={user.email} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-700 leading-none">{user.email.split('@')[0]}</p>
              <Badge variant={roleBadgeVariant[user.role] ?? 'gray'} className="mt-0.5">{user.role}</Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
