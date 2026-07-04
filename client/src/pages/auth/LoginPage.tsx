import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

type UITheme = 'clay' | 'minimal' | 'brutal';

// ─── Claymorphism ──────────────────────────────────────────────────────────
function ClayLogin({ onEmail, onGoogle, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <div className="w-full max-w-md p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.7)' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 20px rgba(99,102,241,0.4)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">WorkZen</h1>
          <p className="text-sm text-gray-500 mt-1">Smarter People. Better Decisions.</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-2xl bg-red-100 text-red-700 text-sm text-center">{error}</div>}

        <div className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.7)', border: '2px solid rgba(99,102,241,0.2)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)' }}
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.7)', border: '2px solid rgba(99,102,241,0.2)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)' }}
            />
          </div>
          <button onClick={() => onEmail(email, password)} disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <button onClick={onGoogle} disabled={loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(99,102,241,0.2)', color: '#374151' }}>
            <GoogleIcon /> Continue with Google
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">Demo: admin@workzen.com / admin123</p>
      </div>
    </div>
  );
}

// ─── Minimalism ────────────────────────────────────────────────────────────
function MinimalLogin({ onEmail, onGoogle, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-8">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-widest uppercase text-gray-900">WorkZen</span>
          </div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-2">Sign in to your workspace</p>
        </div>

        {error && <p className="text-sm text-red-500 mb-6">{error}</p>}

        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
              className="w-full mt-1.5 pb-2 text-sm text-gray-900 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
              className="w-full mt-1.5 pb-2 text-sm text-gray-900 border-b border-gray-200 outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300" />
          </div>
          <div className="pt-4 space-y-3">
            <button onClick={() => onEmail(email, password)} disabled={loading}
              className="w-full py-3 bg-gray-900 text-white text-sm font-medium tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button onClick={onGoogle} disabled={loading}
              className="w-full py-3 border border-gray-200 text-gray-600 text-sm font-medium flex items-center justify-center gap-2 hover:border-gray-400 transition-colors">
              <GoogleIcon /> Google
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-300 mt-10">admin@workzen.com / admin123</p>
      </div>
    </div>
  );
}

// ─── Brutalism ─────────────────────────────────────────────────────────────
function BrutalLogin({ onEmail, onGoogle, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-300">
      <div className="w-full max-w-md p-8 bg-white border-4 border-black" style={{ boxShadow: '8px 8px 0px #000' }}>
        <div className="flex items-center gap-3 mb-8 border-b-4 border-black pb-6">
          <div className="w-12 h-12 bg-black flex items-center justify-center">
            <Zap size={22} className="text-yellow-300" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">WorkZen</h1>
            <p className="text-xs font-bold uppercase text-gray-500">HRMS Platform</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 border-2 border-red-600 bg-red-100 text-red-700 text-sm font-bold">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-1">Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
              className="w-full px-4 py-3 border-2 border-black text-sm font-medium outline-none focus:bg-yellow-50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest block mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-black text-sm font-medium outline-none focus:bg-yellow-50 transition-colors" />
          </div>
          <button onClick={() => onEmail(email, password)} disabled={loading}
            className="w-full py-3.5 bg-black text-yellow-300 font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
            style={{ boxShadow: '4px 4px 0px #ca8a04' }}>
            {loading ? 'SIGNING IN...' : 'SIGN IN →'}
          </button>
          <button onClick={onGoogle} disabled={loading}
            className="w-full py-3.5 bg-white border-2 border-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-yellow-50 transition-colors"
            style={{ boxShadow: '4px 4px 0px #000' }}>
            <GoogleIcon /> GOOGLE LOGIN
          </button>
        </div>
        <p className="text-xs font-bold text-gray-400 mt-6 uppercase">Demo: admin@workzen.com / admin123</p>
      </div>
    </div>
  );
}

// ─── Main Login Page ───────────────────────────────────────────────────────
interface LoginFormProps {
  onEmail: (email: string, password: string) => void;
  onGoogle: () => void;
  loading: boolean;
  error: string;
}

export default function LoginPage() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<UITheme>('clay');

  const handleEmail = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const props: LoginFormProps = { onEmail: handleEmail, onGoogle: handleGoogle, loading, error };

  return (
    <div className="relative">
      {/* Theme switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-gray-200">
        {(['clay', 'minimal', 'brutal'] as UITheme[]).map(t => (
          <button key={t} onClick={() => setTheme(t)}
            className={clsx('px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all',
              theme === t ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
            )}>
            {t}
          </button>
        ))}
      </div>

      {theme === 'clay' && <ClayLogin {...props} />}
      {theme === 'minimal' && <MinimalLogin {...props} />}
      {theme === 'brutal' && <BrutalLogin {...props} />}
    </div>
  );
}
