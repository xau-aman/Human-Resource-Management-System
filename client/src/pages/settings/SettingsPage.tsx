import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Palette, Save, Check, Building2, Clock, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Export', icon: Database },
];

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick}
      className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
        saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
      )}>
      {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
    </button>
  );
}

function GeneralTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ company: 'WorkZen Technologies', timezone: 'Asia/Kolkata', language: 'English', fiscalYear: 'April - March' });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm font-bold text-gray-800 mb-4">Company Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Company Name', key: 'company', icon: Building2 },
            { label: 'Fiscal Year', key: 'fiscalYear', icon: Clock },
          ].map(({ label, key, icon: Icon }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
              </div>
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Timezone</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 appearance-none">
                <option>Asia/Kolkata</option>
                <option>Asia/Dubai</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Language</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 appearance-none">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <SaveButton onClick={save} saved={saved} />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-bold text-gray-800 mb-1">Leave Policy</p>
        <p className="text-xs text-gray-400 mb-4">Annual leave allocations per employee</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ type: 'Casual', days: 12 }, { type: 'Sick', days: 10 }, { type: 'Paid', days: 15 }, { type: 'Unpaid', days: '∞' }].map(l => (
            <div key={l.type} className="p-4 bg-white/60 rounded-xl border border-white/80 text-center">
              <p className="text-2xl font-bold text-indigo-600">{l.days}</p>
              <p className="text-xs text-gray-500 mt-1">{l.type} Leave</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    leaveApproval: true, attendanceAlert: true, performanceReview: false,
    newEmployee: true, aiInsights: true, weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: 'leaveApproval', label: 'Leave Approval Requests', desc: 'Notify when a leave request needs approval' },
    { key: 'attendanceAlert', label: 'Attendance Alerts', desc: 'Alert when attendance drops below threshold' },
    { key: 'performanceReview', label: 'Performance Reviews Due', desc: 'Remind when reviews are pending' },
    { key: 'newEmployee', label: 'New Employee Onboarding', desc: 'Notify when a new employee joins' },
    { key: 'aiInsights', label: 'AI Insights Generated', desc: 'Alert when new workforce insights are available' },
    { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Receive weekly workforce summary every Monday' },
  ];

  return (
    <Card>
      <p className="text-sm font-bold text-gray-800 mb-4">Notification Preferences</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between p-3.5 bg-white/60 rounded-xl border border-white/80">
            <div>
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => toggle(item.key as keyof typeof settings)}
              className={clsx('relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0',
                settings[item.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-gray-200'
              )}>
              <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200',
                settings[item.key as keyof typeof settings] ? 'left-5' : 'left-0.5'
              )} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
        <SaveButton onClick={save} saved={saved} />
      </div>
    </Card>
  );
}

function SecurityTab() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const save = () => {
    if (!pw.new || pw.new !== pw.confirm) return;
    setSaved(true);
    setPw({ current: '', new: '', confirm: '' });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm font-bold text-gray-800 mb-1">Account Info</p>
        <p className="text-xs text-gray-400 mb-4">Your current session details</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Email', value: user?.email ?? '—' },
            { label: 'Role', value: user?.role ?? '—' },
            { label: 'Session', value: 'Active' },
            { label: 'Auth', value: 'Firebase + JWT' },
          ].map(item => (
            <div key={item.label} className="p-3 bg-white/60 rounded-xl border border-white/80">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-bold text-gray-800 mb-4">Change Password</p>
        <div className="space-y-3 max-w-sm">
          {[
            { label: 'Current Password', key: 'current' },
            { label: 'New Password', key: 'new' },
            { label: 'Confirm New Password', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
              <input type="password" value={pw[key as keyof typeof pw]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <SaveButton onClick={save} saved={saved} />
        </div>
      </Card>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [accent, setAccent] = useState('indigo');
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const accents = [
    { name: 'indigo', color: 'bg-indigo-500' },
    { name: 'violet', color: 'bg-violet-500' },
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'emerald', color: 'bg-emerald-500' },
    { name: 'rose', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm font-bold text-gray-800 mb-4">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTheme(id as any)}
              className={clsx('flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                theme === id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white/60 hover:border-gray-300'
              )}>
              <Icon size={20} className={theme === id ? 'text-indigo-600' : 'text-gray-400'} />
              <span className={clsx('text-xs font-medium', theme === id ? 'text-indigo-700' : 'text-gray-600')}>{label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-bold text-gray-800 mb-4">Accent Color</p>
        <div className="flex gap-3">
          {accents.map(a => (
            <button key={a.name} onClick={() => setAccent(a.name)}
              className={clsx('w-9 h-9 rounded-xl transition-all', a.color,
                accent === a.name ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
              )} />
          ))}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <SaveButton onClick={save} saved={saved} />
        </div>
      </Card>
    </div>
  );
}

function DataTab() {
  const [exporting, setExporting] = useState<string | null>(null);
  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => setExporting(null), 1500);
  };

  const exports = [
    { id: 'employees', label: 'Employee Data', desc: 'All employee profiles and details', format: 'CSV' },
    { id: 'attendance', label: 'Attendance Records', desc: 'Full attendance history', format: 'CSV' },
    { id: 'performance', label: 'Performance Reviews', desc: 'All performance review data', format: 'CSV' },
    { id: 'leaves', label: 'Leave Records', desc: 'All leave requests and approvals', format: 'CSV' },
  ];

  return (
    <Card>
      <p className="text-sm font-bold text-gray-800 mb-1">Export Data</p>
      <p className="text-xs text-gray-400 mb-4">Download your HRMS data as CSV files</p>
      <div className="space-y-3">
        {exports.map(e => (
          <div key={e.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white/80">
            <div>
              <p className="text-sm font-medium text-gray-800">{e.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{e.desc}</p>
            </div>
            <button onClick={() => handleExport(e.id)}
              className={clsx('flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                exporting === e.id ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              )}>
              {exporting === e.id ? <><Check size={12} /> Exported!</> : `Export ${e.format}`}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const renderTab = () => {
    switch (activeTab) {
      case 'general': return <GeneralTab />;
      case 'notifications': return <NotificationsTab />;
      case 'security': return <SecurityTab />;
      case 'appearance': return <AppearanceTab />;
      case 'data': return <DataTab />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your WorkZen HRMS configuration</p>
      </div>

      {/* Tabs */}
      <div className="glass-card p-1.5 flex gap-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all',
              activeTab === id
                ? 'bg-white shadow-sm text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            )}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
