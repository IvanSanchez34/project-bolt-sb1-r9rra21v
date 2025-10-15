import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { full_name: string; phone: string; role: UserRole }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check localStorage for demo session
        const demoSession = localStorage.getItem('demoSession');
        if (demoSession) {
          const sessionData = JSON.parse(demoSession);
          setUser(sessionData.user);
          setSession(sessionData.session);
          setLoading(false);
          return;
        }

        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem('demoSession');
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      // For demo purposes
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        // Obtener usuario real desde demoSession
        const demoSession = localStorage.getItem('demoSession');
        if (demoSession) {
          const sessionData = JSON.parse(demoSession);
          setUser(sessionData.user);
        } else {
          setUser(null);
        }
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; phone: string; role: UserRole }) => {
    try {
      setLoading(true);
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      // Demo registration for development
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        const userId = `user-${Date.now()}`;
        
        const newUser: User = {
          id: userId,
          email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        
        const userExists = existingUsers.find((u: User) => u.email === email);
        if (userExists) {
          throw new Error('Ya existe un usuario con este email');
        }
        
        existingUsers.push(newUser);
        localStorage.setItem('demoUsers', JSON.stringify(existingUsers));
        
        const demoSession = {
          user: newUser,
          session: {
            access_token: `demo-token-${userId}`,
            refresh_token: 'demo-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: userId,
              email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        };
        
        localStorage.setItem('demoSession', JSON.stringify(demoSession));
        setUser(newUser);
        setSession(demoSession.session as any);
        return;
      }

      // ✅ REGISTRO REAL CON SUPABASE
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role,
            parish_id: '550e8400-e29b-41d4-a716-446655440000' // ID de tu parroquia
          }
        }
      });

      if (error) throw error;

      // ✅ El trigger automáticamente crea el perfil en la tabla users
      // Solo esperamos un momento y luego cargamos el perfil
      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchUserProfile(data.user.id);
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check demo users first
      const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const demoUser = demoUsers.find((u: User) => u.email === email);
      
      // Demo login
      if ((email === 'demo@parish.com' && password === 'demo123') || demoUser) {
        const user = demoUser || {
          id: 'demo-user-id',
          email: 'demo@parish.com',
          full_name: 'Usuario Demo',
          role: 'parish_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const demoSession = {
          user,
          session: {
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        };

        localStorage.setItem('demoSession', JSON.stringify(demoSession));
        setUser(user);
        setSession(demoSession.session as any);
        return;
      }

      // Real Supabase login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('demoSession');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};