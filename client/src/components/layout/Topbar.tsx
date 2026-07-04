import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { Badge, Logo } from '../ui';
import { useAuth } from '../../context/AuthContext';

const roleBadge: Record<string, 'purple' | 'blue' | 'green' | 'orange'> = {
  ADMIN: 'purple', HR: 'blue', MANAGER: 'green', EMPLOYEE: 'orange',
};

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4">
      {/* Logo for mobile */}
      <div className="flex items-center gap-3 lg:hidden">
        <Logo size="sm" />
        <span className="font-black text-white text-sm uppercase">WorkZen</span>
      </div>

      <div className="hidden lg:block" />

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 bg-white text-black rounded-full border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all relative">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C54B8C] rounded-full border border-white" />
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-black bg-[#fce4ec] overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xs text-black">
              {(user.employee?.firstName?.[0] ?? user.email[0]).toUpperCase()}
              {(user.employee?.lastName?.[0] ?? '').toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">
                {user.employee?.firstName ? `${user.employee.firstName} ${user.employee.lastName}` : user.email.split('@')[0]}
              </p>
              <Badge variant={roleBadge[user.role] ?? 'gray'} className="mt-1">{user.role}</Badge>
            </div>
          </div>
        )}

        <button onClick={async () => { await logout(); navigate('/login'); }}
          className="w-10 h-10 bg-white text-black rounded-full border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:bg-red-50 hover:text-red-500" title="Logout">
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
