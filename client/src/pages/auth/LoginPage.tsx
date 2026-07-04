import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Logo } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const fillDemo = (role: 'admin' | 'hr' | 'emp') => {
    const creds = { admin: { email: 'admin@workzen.com', password: 'admin123' }, hr: { email: 'hr@workzen.com', password: 'admin123' }, emp: { email: 'priya.patel@workzen.com', password: 'emp123' } };
    setEmail(creds[role].email); setPassword(creds[role].password); setError('');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#880e4f] via-[#C54B8C] to-[#fce4ec] relative overflow-hidden rounded-l-[2.5rem] m-3 mr-0">
        <div className="relative z-10 text-center max-w-md px-8">
          <Logo size="xl" className="mx-auto mb-6 bg-white/20 border-white/30 backdrop-blur-sm" />
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.4)' }}>
            WorkZen
          </h2>
          <p className="text-white/60 text-base">
            AI-Powered Human Resource Management System. Manage attendance, performance, and get workforce insights.
          </p>
        </div>

        <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-3 z-10">
          {[{ label: 'Employees', value: '12' }, { label: 'Departments', value: '4' }, { label: 'AI Insights', value: '∞' }].map(s => (
            <div key={s.label} className="p-4 rounded-2xl border-2 border-black/30 bg-black/20 backdrop-blur-sm text-center">
              <p className="text-2xl font-black text-black">{s.value}</p>
              <p className="text-[10px] text-black/60 mt-1 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white rounded-[2.5rem] m-3 relative">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Logo size="md" />
            <span className="font-black text-black uppercase tracking-wide">WorkZen</span>
          </div>

          <div className="mb-8">
            <h1 className="font-black text-3xl text-black uppercase tracking-tight">Sign In</h1>
            <p className="text-sm text-black/40 mt-2 font-medium">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-5 p-3 bg-red-50 border-2 border-red-500 rounded-xl">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@workzen.com"
                  className="input-neo w-full pl-11 pr-4 py-3.5 text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="input-neo w-full pl-11 pr-11 py-3.5 text-sm font-medium" />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#C54B8C] transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-neo w-full py-4 text-sm mt-2 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-black/10">
            <p className="text-[10px] font-bold text-black/30 mb-3 text-center uppercase tracking-widest">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {[{ role: 'admin' as const, label: 'Admin' }, { role: 'hr' as const, label: 'HR' }, { role: 'emp' as const, label: 'Employee' }].map(({ role, label }) => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="btn-neo-secondary py-2.5 text-[10px]">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
