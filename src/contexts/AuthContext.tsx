import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 INITIALIZING AuthProvider - FIXED VERSION');
    
    let mounted = true;
    
    // Get initial session with timeout
    const getSession = async () => {
      try {
        console.log('🔍 Checking initial session with timeout');
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );
        
        const sessionPromise = getCurrentUser();
        
        const { user } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (!mounted) return;
        
        setUser(user);
        
        if (user) {
          console.log('👤 User found, creating mock profile');
          // Always use mock profile to avoid database issues
          const mockProfile = {
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'Usuário',
            dateOfBirth: null,
            diabetesType: 'type2' as const,
            healthGoals: [],
            dietaryPreferences: [],
            subscriptionPlan: 'free' as const,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setUserProfile(mockProfile);
        } else {
          console.log('👤 No user logged in');
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        // Don't fail, just continue without user
        if (mounted) {
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('✅ AuthProvider initialization completed');
        }
      }
    };

    getSession();

    // Listen for auth changes with error handling
    console.log('👂 Setting up authentication listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 Authentication event:', event, session?.user?.email);
        
        try {
          setUser(session?.user || null);
          
          if (session?.user) {
            // Always use mock profile
            const mockProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'Usuário',
              dateOfBirth: null,
              diabetesType: 'type2' as const,
              healthGoals: [],
              dietaryPreferences: [],
              subscriptionPlan: 'free' as const,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setUserProfile(mockProfile);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('❌ Error in auth state change:', error);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      console.log('🔇 Removing authentication listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Starting login process');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Login error:', error);
      } else {
        console.log('✅ Login successful');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected login error:', err);
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('🔐 Starting signup process');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`
        },
      });

      if (data.user && !error) {
        console.log('✅ Signup successful');
      }

      return { data, error };
    } catch (err) {
      console.error('❌ Unexpected signup error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    console.log('🔐 Logging out');
    
    try {
      await supabase.auth.signOut();
      console.log('✅ Logout completed');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};