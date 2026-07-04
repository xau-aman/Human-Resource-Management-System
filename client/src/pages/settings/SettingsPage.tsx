import React, { useState } from 'react';
import { Bell, Shield, Database, Palette, Save, Check, Building2, Clock, Globe } from 'lucide-react';
import { Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Export', icon: Database },
];

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick} className={clsx('btn-neo px-4 py-2 text-[11px] flex items-center gap-2', saved && 'bg-green-500')}>
      {saved ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save</>}
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
        <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Company Info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ label: 'Company', key: 'company', icon: Building2 }, { label: 'Fiscal Year', key: 'fiscalYear', icon: Clock }].map(({ label, key, icon: Icon }) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">{label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-neo w-full pl-10 pr-4 py-2.5 text-sm" />
              </div>
            </div>
          ))}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">Timezone</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
              <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))} className="input-neo w-full pl-10 pr-4 py-2.5 text-sm appearance-none">
                <option>Asia/Kolkata</option><option>America/New_York</option><option>Europe/London</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t-2 border-black/10"><SaveButton onClick={save} saved={saved} /></div>
      </Card>

      <Card>
        <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Leave Policy</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ type: 'Casual', days: 12 }, { type: 'Sick', days: 10 }, { type: 'Paid', days: 15 }, { type: 'Unpaid', days: '∞' }].map(l => (
            <div key={l.type} className="neo-card-sm p-4 text-center">
              <p className="text-2xl font-black text-[#C54B8C]">{l.days}</p>
              <p className="text-[10px] text-black/40 mt-1 font-bold uppercase tracking-wider">{l.type}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({ leaveApproval: true, attendanceAlert: true, performanceReview: false, newEmployee: true, aiInsights: true, weeklyReport: false });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: 'leaveApproval', label: 'Leave Approvals', desc: 'When a leave request needs approval' },
    { key: 'attendanceAlert', label: 'Attendance Alerts', desc: 'When attendance drops below threshold' },
    { key: 'performanceReview', label: 'Performance Reviews', desc: 'When reviews are pending' },
    { key: 'newEmployee', label: 'New Employees', desc: 'When someone joins' },
    { key: 'aiInsights', label: 'AI Insights', desc: 'New workforce insights available' },
    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary every Monday' },
  ];

  return (
    <Card>
      <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Notifications</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between p-3.5 border-2 border-black/10 rounded-xl">
            <div>
              <p className="text-sm font-bold text-black">{item.label}</p>
              <p className="text-[11px] text-black/40 mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => toggle(item.key as keyof typeof settings)}
              className={clsx('relative w-12 h-6 rounded-full border-2 border-black transition-all', settings[item.key as keyof typeof settings] ? 'bg-[#C54B8C]' : 'bg-gray-200')}>
              <span className={clsx('absolute top-0.5 w-4 h-4 bg-white rounded-full border border-black transition-all', settings[item.key as keyof typeof settings] ? 'left-6' : 'left-0.5')} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4 pt-4 border-t-2 border-black/10"><SaveButton onClick={save} saved={saved} /></div>
    </Card>
  );
}

function SecurityTab() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const save = () => { if (!pw.new || pw.new !== pw.confirm) return; setSaved(true); setPw({ current: '', new: '', confirm: '' }); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Account</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ label: 'Email', value: user?.email ?? '—' }, { label: 'Role', value: user?.role ?? '—' }, { label: 'Session', value: 'Active' }, { label: 'Auth', value: 'JWT' }].map(item => (
            <div key={item.label} className="neo-card-sm p-3">
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-bold text-black mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Change Password</p>
        <div className="space-y-3 max-w-sm">
          {[{ label: 'Current', key: 'current' }, { label: 'New', key: 'new' }, { label: 'Confirm', key: 'confirm' }].map(({ label, key }) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-1.5">{label}</label>
              <input type="password" value={pw[key as keyof typeof pw]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} className="input-neo w-full px-3.5 py-2.5 text-sm" />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t-2 border-black/10"><SaveButton onClick={save} saved={saved} /></div>
      </Card>
    </div>
  );
}

function DataTab() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState<string | null>(null);
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const token = localStorage.getItem('workzen_token');
      const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const res = await fetch(`${baseUrl}/export/${type}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${type}.csv`; a.click();
    } catch { /* ignore */ }
    setTimeout(() => setExporting(null), 1000);
  };

  const exports = [
    { id: 'employees', label: 'Employees', desc: 'All profiles & salary data' },
    { id: 'attendance', label: 'Attendance', desc: 'Full attendance history' },
    { id: 'performance', label: 'Performance', desc: 'All reviews & scores' },
    { id: 'leaves', label: 'Leaves', desc: 'All leave requests' },
  ];

  if (!isAdminOrHR) {
    return (
      <Card>
        <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Export Data</p>
        <p className="text-sm text-black/50">You can download your payslip from the <span className="font-bold text-[#C54B8C]">Payslip</span> page.</p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-xs font-black text-black uppercase tracking-widest mb-4">Export Data (CSV)</p>
      <div className="space-y-3">
        {exports.map(e => (
          <div key={e.id} className="flex items-center justify-between p-4 border-2 border-black/10 rounded-xl">
            <div>
              <p className="text-sm font-bold text-black">{e.label}</p>
              <p className="text-[11px] text-black/40">{e.desc}</p>
            </div>
            <button onClick={() => handleExport(e.id)} className={clsx('btn-neo-secondary px-3 py-1.5 text-[10px]', exporting === e.id && 'bg-green-100')}>
              {exporting === e.id ? '✓ Done' : 'Export CSV'}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const renderTab = () => { switch (activeTab) { case 'general': return <GeneralTab />; case 'notifications': return <NotificationsTab />; case 'security': return <SecurityTab />; case 'data': return <DataTab />; default: return null; } };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-black uppercase tracking-tight">Settings</h1>
        <p className="text-sm text-black/40 mt-0.5 font-medium">System configuration</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2',
              activeTab === id ? 'bg-white text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent text-black/40 border-transparent hover:text-black hover:bg-[#fce4ec]'
            )}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
