import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    const demoEmail = localStorage.getItem('demo_email');
    
    // Check for demo email FIRST to avoid waiting for potentially slow Supabase connection
    if (demoEmail || !supabase) {
      const email = demoEmail || 'admin@clinic.com';
      setUser({ email, id: 'mock-id' } as any);
      fetchProfile('mock-id', email);
      
      // If supabase exists, still listen for changes but don't block
      if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            localStorage.removeItem('demo_email');
            setUser(session.user);
            fetchProfile(session.user.id, session.user.email);
          }
        });
        return () => subscription.unsubscribe();
      }
      return;
    }

    // Standard path if no demo_email
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth session check timed out, falling back to guest');
        setLoading(false);
      }
    }, 5000);

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email);
      } else {
        const localEmail = localStorage.getItem('demo_email');
        if (localEmail) {
          setUser({ email: localEmail, id: 'mock-id' } as any);
          fetchProfile('mock-id', localEmail);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string, overrideEmail?: string) {
    const supabase = getSupabase();
    const demoEmail = localStorage.getItem('demo_email');
    const effectiveEmail = (overrideEmail || demoEmail || user?.email || 'admin@clinic.com').toLowerCase();
    
    // DEMO/MOCK LOGIC: If no supabase OR we are in a demo scenario OR manually set email
    if (!supabase || import.meta.env.DEV || demoEmail) {
      let role: UserRole = 'ADMIN';
      let name = 'Super Admin';

      if (effectiveEmail.includes('doctor') || effectiveEmail.includes('dokter')) {
        role = 'DOCTOR';
        name = 'dr. Sarah Johnson';
      } else if (effectiveEmail.includes('pharma') || effectiveEmail.includes('apoteker') || effectiveEmail.includes('obat')) {
        role = 'PHARMACIST';
        name = 'Budi Apoteker';
      } else {
        role = 'ADMIN';
        name = 'Administrator';
      }

      setProfile({
        id: userId || 'mock-id',
        email: effectiveEmail,
        full_name: name,
        role: role,
        created_at: new Date().toISOString()
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Fallback to mock if profile doesn't exist in DB but user is logged in
        console.warn('Profile not found, using mock data');
        const role: UserRole = effectiveEmail.includes('doctor') ? 'DOCTOR' : 
                            (effectiveEmail.includes('pharma') ? 'PHARMACIST' : 'ADMIN');
        setProfile({
          id: userId,
          email: effectiveEmail,
          full_name: 'User',
          role: role,
          created_at: new Date().toISOString()
        });
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    localStorage.removeItem('demo_email');
    const supabase = getSupabase();
    
    // Always clear local state immediately for responsiveness
    setUser(null);
    setProfile(null);
    
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during Supabase signOut:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
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
