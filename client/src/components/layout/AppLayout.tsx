import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Topbar />
      <div className="flex flex-1 p-3 gap-3">
        <Sidebar />
        <main className="flex-1 bg-white rounded-[2rem] p-6 md:p-8 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
