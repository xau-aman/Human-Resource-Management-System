import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, _password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// TODO[CORE]: Replace mock auth with real API call
const MOCK_USER: AuthUser = { id: 'mock-1', email: 'admin@workzen.com', role: 'ADMIN' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);
  const [token, setToken] = useState<string | null>('mock-token');

  const login = async (_email: string, _password: string) => {
    // TODO[CORE]: Call POST /api/v1/auth/login
    setUser(MOCK_USER);
    setToken('mock-token');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const hasRole = (...roles: UserRole[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
