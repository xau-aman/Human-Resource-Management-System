import React from 'react';
import { Card, PageHeader } from '../../components/ui';
import { Settings, Bell, Shield, Database, Palette } from 'lucide-react';

const settingsSections = [
  { icon: <Settings size={18} />, title: 'General Settings', description: 'Company name, timezone, and locale preferences', color: 'bg-gray-50 text-gray-600' },
  { icon: <Bell size={18} />, title: 'Notifications', description: 'Configure email and in-app notification preferences', color: 'bg-blue-50 text-blue-600' },
  { icon: <Shield size={18} />, title: 'Security & Access', description: 'Role permissions, password policies, and 2FA settings', color: 'bg-purple-50 text-purple-600' },
  { icon: <Database size={18} />, title: 'Data & Integrations', description: 'Export data, API keys, and third-party integrations', color: 'bg-emerald-50 text-emerald-600' },
  { icon: <Palette size={18} />, title: 'Appearance', description: 'Theme, branding, and display preferences', color: 'bg-pink-50 text-pink-600' },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your WorkZen HRMS configuration" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {settingsSections.map(s => (
          <Card key={s.title} className="flex items-start gap-4 cursor-pointer hover:border-indigo-200 transition-colors">
            <div className={`p-2.5 rounded-lg ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{s.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
