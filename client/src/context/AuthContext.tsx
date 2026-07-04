import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../config/firebase';
import { api, setToken, clearToken } from '../config/api';
import type { AuthUser, UserRole } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface ApiAuthResponse {
  data: { token: string; user: AuthUser };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from localStorage token
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
    try {
      // Try Firebase first
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      const fbUser = firebaseAuth.currentUser!;
      const fbToken = await fbUser.getIdToken();
      const res = await api.post<ApiAuthResponse>('/auth/firebase', { firebaseUid: fbUser.uid, email });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch {
      // Fallback to local JWT auth
      const res = await api.post<ApiAuthResponse>('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const fbToken = await result.user.getIdToken();
    const res = await api.post<ApiAuthResponse>('/auth/firebase', {
      firebaseUid: result.user.uid,
      email: result.user.email,
    });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    await signOut(firebaseAuth).catch(() => {});
    clearToken();
    setUser(null);
  };

  const hasRole = (...roles: UserRole[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, loginWithGoogle, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
