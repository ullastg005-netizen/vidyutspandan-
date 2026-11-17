import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '../types';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Demo users for prototype
const DEMO_USERS: Record<string, User> = {
  'admin@vidyutspandan.gov.in': {
    id: 'admin-001',
    email: 'admin@vidyutspandan.gov.in',
    full_name: 'Rajesh Kumar Sharma',
    role: 'admin',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    employee_id: 'BESCOM-ADM-001',
    phone: '+91-80-22222001',
  },
  'officer@vidyutspandan.gov.in': {
    id: 'officer-001',
    email: 'officer@vidyutspandan.gov.in',
    full_name: 'Priya Venkatesh',
    role: 'officer',
    department_id: 'dept-001',
    zone_id: 'zone-001',
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    employee_id: 'BESCOM-OFF-001',
    phone: '+91-80-22222002',
  },
  'worker@vidyutspandan.gov.in': {
    id: 'worker-001',
    email: 'worker@vidyutspandan.gov.in',
    full_name: 'Suresh Babu',
    role: 'worker',
    department_id: 'dept-001',
    zone_id: 'zone-001',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    employee_id: 'BESCOM-WRK-001',
    phone: '+91-80-22222003',
  },
  'supervisor@vidyutspandan.gov.in': {
    id: 'supervisor-001',
    email: 'supervisor@vidyutspandan.gov.in',
    full_name: 'Anitha Krishnamurthy',
    role: 'supervisor',
    department_id: 'dept-001',
    zone_id: 'zone-001',
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    employee_id: 'BESCOM-SUP-001',
    phone: '+91-80-22222004',
  },
};

const DEMO_PASSWORDS: Record<string, string> = {
  'admin@vidyutspandan.gov.in': 'Admin@1234',
  'officer@vidyutspandan.gov.in': 'Officer@1234',
  'worker@vidyutspandan.gov.in': 'Worker@1234',
  'supervisor@vidyutspandan.gov.in': 'Supervisor@1234',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = useCallback(() => {
    try {
      const stored = sessionStorage.getItem('vs_demo_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Try Supabase session first
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (data.session) {
        setSession(data.session);
        const demoUser = DEMO_USERS[data.session.user.email || ''];
        if (demoUser) setUser(demoUser);
      }
      loadUserFromStorage();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        if (!currentSession) {
          setUser(null);
          sessionStorage.removeItem('vs_demo_user');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserFromStorage]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const demoUser = DEMO_USERS[email.toLowerCase()];
    const demoPassword = DEMO_PASSWORDS[email.toLowerCase()];

    if (demoUser && demoPassword === password) {
      setUser(demoUser);
      sessionStorage.setItem('vs_demo_user', JSON.stringify(demoUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    sessionStorage.removeItem('vs_demo_user');
    await supabase.auth.signOut();
  };

  const refreshUser = async () => {
    const stored = sessionStorage.getItem('vs_demo_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
