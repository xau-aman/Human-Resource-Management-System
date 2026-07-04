import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, setToken, clearToken } from '../config/api';
import type { AuthUser, UserRole } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
interface ApiAuthResponse { data: { token: string; user: AuthUser } }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('workzen_token');
    if (token) {
      api.get<{ data: AuthUser }>('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    const res = await api.post<ApiAuthResponse>('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    clearToken();
    setUser(null);
  };

  const hasRole = (...roles: UserRole[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
