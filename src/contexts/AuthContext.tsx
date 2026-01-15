import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...');
        console.log('[AuthContext] Current URL:', window.location.href);

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthContext] Error getting session:', error);
        } else {
          console.log('[AuthContext] Session retrieved:', session ? 'Session found' : 'No session');
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event);
      console.log('[AuthContext] Session:', session ? 'Present' : 'None');
      console.log('[AuthContext] User:', session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        console.log('[AuthContext] User signed in successfully');
        setSession(session);
        setUser(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] User signed out');
        setSession(null);
        setUser(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('[AuthContext] Token refreshed');
        setSession(session);
        setUser(session.user);
        setLoading(false);
      } else {
        console.log('[AuthContext] Other auth event');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithOtp, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
