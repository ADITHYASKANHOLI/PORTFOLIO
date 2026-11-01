import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseMode: boolean;
  serverConfigured: boolean | null;
  loginWithKey: (key: string) => Promise<{ error?: string }>;
  login: (keyOrEmail: string, password?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAdmin(true);
          setUser({ role: 'admin', email: 'admin' });
        } else {
          setIsAdmin(false);
          setUser(null);
        }
        if (typeof data.configured === 'boolean') {
          setServerConfigured(data.configured);
        }
      } else {
        setIsAdmin(false);
        setUser(null);
      }
    } catch {
      setIsAdmin(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const loginWithKey = async (key: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ key }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { error: data.error || 'Authentication failed' };
      }

      if (data.success) {
        setIsAdmin(true);
        setUser({ role: 'admin', email: 'admin' });
        setServerConfigured(true);
        setIsLoading(false);
        return {};
      }

      setIsLoading(false);
      return { error: 'Authentication failed' };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Network error connecting to authentication server' };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network error on logout
    } finally {
      setIsAdmin(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Backwards-compatible alias for any legacy forms
  const login = async (keyOrEmail: string, _password?: string): Promise<{ error?: string }> => {
    return loginWithKey(keyOrEmail);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        isSupabaseMode: Boolean(isSupabaseConfigured),
        serverConfigured,
        loginWithKey,
        login,
        logout,
        refreshSession: checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
