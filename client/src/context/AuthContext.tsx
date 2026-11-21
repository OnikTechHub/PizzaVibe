'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize to null to guarantee 100% server-client hydration match
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session safely on client mount without hydration mismatch
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('pizzavibe_token');
      const storedUser = localStorage.getItem('pizzavibe_user');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.warn('Failed to restore auth session from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem('pizzavibe_token', newToken);
      localStorage.setItem('pizzavibe_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to persist auth session to localStorage:', e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('pizzavibe_token');
      localStorage.removeItem('pizzavibe_user');
    } catch (e) {
      console.warn('Failed to clear auth session:', e);
    }
    toast.success('You have been logged out.');
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      try {
        localStorage.setItem('pizzavibe_user', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update user in localStorage:', e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
