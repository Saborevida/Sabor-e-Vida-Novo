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
    console.log('🔄 INITIALIZING AuthProvider - PRODUCTION VERSION');
    
    let mounted = true;
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 Checking initial session');
        const { user } = await getCurrentUser();
        
        if (!mounted) return;
        
        setUser(user);
        
        if (user) {
          console.log('👤 User found, fetching profile');
          await fetchUserProfile(user.id);
        } else {
          console.log('👤 No user logged in');
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('✅ AuthProvider initialization completed');
        }
      }
    };

    getSession();

    // Listen for auth changes
    console.log('👂 Setting up authentication listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 Authentication event:', event, session?.user?.email);
        
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching user profile:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        // If user doesn't exist in users table, create a basic profile
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          console.log('🆕 Creating basic profile for user');
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            const newProfile = {
              id: userData.user.id,
              email: userData.user.email || '',
              name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuário',
              date_of_birth: null,
              diabetes_type: 'type2',
              health_goals: [],
              dietary_preferences: [],
              subscription_plan: 'free',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('users')
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error('❌ Error creating profile:', createError);
              
              // Use mock profile if can't create
              const mockProfile = {
                id: userData.user.id,
                email: userData.user.email || '',
                name: userData.user.email?.split('@')[0] || 'Usuário',
                dateOfBirth: null,
                diabetesType: 'type2' as const,
                healthGoals: [],
                dietaryPreferences: [],
                subscriptionPlan: 'free' as const,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              console.log('🎭 Using mock profile:', mockProfile);
              setUserProfile(mockProfile);
            } else {
              console.log('✅ Profile created:', createdProfile);
              setUserProfile(createdProfile);
            }
          }
        } else {
          // For other errors, use mock profile
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const mockProfile = {
              id: userData.user.id,
              email: userData.user.email || '',
              name: userData.user.email?.split('@')[0] || 'Usuário',
              dateOfBirth: null,
              diabetesType: 'type2' as const,
              healthGoals: [],
              dietaryPreferences: [],
              subscriptionPlan: 'free' as const,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            console.log('🎭 Using mock profile due to error:', mockProfile);
            setUserProfile(mockProfile);
          }
        }
      } else {
        console.log('✅ Profile found:', data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
      
      // Fallback to mock profile
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const mockProfile = {
          id: userData.user.id,
          email: userData.user.email || '',
          name: userData.user.email?.split('@')[0] || 'Usuário',
          dateOfBirth: null,
          diabetesType: 'type2' as const,
          healthGoals: [],
          dietaryPreferences: [],
          subscriptionPlan: 'free' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        console.log('🎭 Using mock profile due to unexpected error:', mockProfile);
        setUserProfile(mockProfile);
      }
    }
  };

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
        console.log('✅ Signup successful, creating profile');
        
        // Create user profile
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          name: userData.name || data.user.email?.split('@')[0] || 'Usuário',
          date_of_birth: userData.dateOfBirth || null,
          diabetes_type: userData.diabetesType || 'type2',
          health_goals: userData.healthGoals || [],
          dietary_preferences: userData.dietaryPreferences || [],
          subscription_plan: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { error: profileError } = await supabase
          .from('users')
          .insert(profileData);

        if (profileError) {
          console.error('❌ Error creating profile:', profileError);
        } else {
          console.log('✅ Profile created successfully');
        }
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