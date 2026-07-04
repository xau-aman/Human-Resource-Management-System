import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen page-bg flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 glass-dark flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">WorkZen</span>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs text-indigo-300 font-medium">AI-Powered HRMS</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Smarter people.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Better decisions.</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Manage attendance, performance, skills, and get AI-powered workforce insights — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'Employees', value: '12' }, { label: 'Departments', value: '4' }, { label: 'AI Insights', value: '∞' }].map(s => (
            <div key={s.label} className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/30 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">WorkZen</span>
          </div>

          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-400 mb-6">Sign in to your workspace</p>

            {error && (
              <div className="flex items-center gap-2 mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-300" />
              </div>

              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-300" />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 mt-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3 text-center">Quick demo access</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ role: 'admin' as const, label: 'Admin' }, { role: 'hr' as const, label: 'HR' }, { role: 'emp' as const, label: 'Employee' }].map(({ role, label }) => (
                  <button key={role} onClick={() => fillDemo(role)}
                    className="py-2 text-xs font-medium text-gray-600 bg-white/70 border border-gray-200 rounded-xl hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
