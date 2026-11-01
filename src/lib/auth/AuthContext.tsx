import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { checkIsAdmin } from '@/lib/data/api';

export interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseMode: boolean;
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AUTH_KEY = 'kanholi_portfolio_demo_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted && session?.user) {
            setUser(session.user);
            const adminCheck = await checkIsAdmin(session.user.id);
            setIsAdmin(adminCheck);
          } else if (mounted) {
            setUser(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.warn('Auth initialization error:', err);
        }

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            setUser(session.user);
            const adminCheck = await checkIsAdmin(session.user.id);
            setIsAdmin(adminCheck);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setIsLoading(false);
        });

        if (mounted) setIsLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Fallback demo mode check
        const savedDemoAuth = localStorage.getItem(DEMO_AUTH_KEY);
        if (savedDemoAuth) {
          try {
            const parsed = JSON.parse(savedDemoAuth);
            setUser(parsed);
            setIsAdmin(true);
          } catch {
            localStorage.removeItem(DEMO_AUTH_KEY);
          }
        }
        if (mounted) setIsLoading(false);
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      if (!password) {
        setIsLoading(false);
        return { error: 'Password is required for Supabase authentication.' };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const adminCheck = await checkIsAdmin(data.user.id);
          if (!adminCheck) {
            await supabase.auth.signOut();
            setIsLoading(false);
            return { error: 'Your account is authenticated, but is not authorized in the admin_users table.' };
          }

          setUser(data.user);
          setIsAdmin(true);
          setIsLoading(false);
          return {};
        }
      } catch (err: any) {
        setIsLoading(false);
        return { error: err.message || 'An unexpected authentication error occurred.' };
      }
    }

    // Local / Offline demo authentication:
    // Allows testing admin panel when Supabase is not connected
    const mockUser = {
      id: 'demo-admin-id',
      email: email || 'admin@kanholi.dev',
      user_metadata: { name: 'Adithya S. Kanholi' },
    };
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAdmin(true);
    setIsLoading(false);
    return {};
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout error:', err);
      }
    }
    localStorage.removeItem(DEMO_AUTH_KEY);
    setUser(null);
    setIsAdmin(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        isSupabaseMode: isSupabaseConfigured,
        login,
        logout,
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

