import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getUserProfile, upsertUserProfile } from '../lib/supabase';
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
    console.log('🔄 INICIALIZANDO AuthProvider - VERSÃO COM TIMEOUT CORRIGIDA');
    
    let mounted = true;
    
    // Timeout para inicialização
    const initTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('⏰ Timeout na inicialização, continuando sem autenticação');
        setLoading(false);
      }
    }, 8000);
    
    // Obter sessão inicial com timeout
    const getSession = async () => {
      try {
        console.log('🔍 Verificando sessão inicial com timeout');
        
        const { user } = await getCurrentUser();
        
        if (!mounted) return;
        
        setUser(user);
        
        if (user) {
          console.log('👤 Usuário encontrado, carregando perfil');
          
          try {
            // Buscar perfil com timeout
            const { data: profile, error } = await getUserProfile(user.id);
            
            if (profile && !error) {
              console.log('✅ Perfil carregado:', profile.email);
              setUserProfile({
                id: profile.id,
                email: profile.email,
                name: profile.name || user.email?.split('@')[0] || 'Usuário',
                dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
                diabetesType: profile.diabetes_type || 'type2',
                healthGoals: profile.health_goals || [],
                dietaryPreferences: profile.dietary_preferences || [],
                subscriptionPlan: profile.subscription_plan || 'free',
                createdAt: new Date(profile.created_at),
                updatedAt: new Date(profile.updated_at)
              });
            } else {
              console.log('⚠️ Perfil não encontrado, criando perfil básico');
              
              // Criar perfil básico sem aguardar
              const basicProfile = {
                id: user.id,
                email: user.email || '',
                name: user.email?.split('@')[0] || 'Usuário',
                dateOfBirth: undefined,
                diabetesType: 'type2' as const,
                healthGoals: [],
                dietaryPreferences: [],
                subscriptionPlan: 'free' as const,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              setUserProfile(basicProfile);
              
              // Tentar criar no banco em background
              upsertUserProfile(user.id, {
                email: user.email || '',
                name: user.email?.split('@')[0] || 'Usuário',
                diabetes_type: 'type2',
                health_goals: [],
                dietary_preferences: [],
                subscription_plan: 'free'
              }).catch(err => console.log('⚠️ Erro ao criar perfil (continuando):', err));
            }
          } catch (profileError) {
            console.log('⚠️ Erro ao carregar perfil, usando dados básicos:', profileError);
            
            // Usar dados básicos do usuário
            setUserProfile({
              id: user.id,
              email: user.email || '',
              name: user.email?.split('@')[0] || 'Usuário',
              dateOfBirth: undefined,
              diabetesType: 'type2',
              healthGoals: [],
              dietaryPreferences: [],
              subscriptionPlan: 'free',
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        } else {
          console.log('👤 Nenhum usuário logado');
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ Erro na verificação de sessão (continuando):', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        if (mounted) {
          clearTimeout(initTimeout);
          setLoading(false);
          console.log('✅ Inicialização concluída');
        }
      }
    };

    getSession();

    // Escutar mudanças de autenticação com timeout
    console.log('👂 Configurando listener de autenticação');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (!mounted) return;
        
        console.log('🔔 Evento de autenticação:', event, session?.user?.email);
        
        try {
          setUser(session?.user || null);
          
          if (session?.user) {
            // Tentar carregar perfil, mas não travar se der erro
            try {
              const { data: profile } = await getUserProfile(session.user.id);
              
              if (profile) {
                setUserProfile({
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
                  diabetesType: profile.diabetes_type,
                  healthGoals: profile.health_goals || [],
                  dietaryPreferences: profile.dietary_preferences || [],
                  subscriptionPlan: profile.subscription_plan,
                  createdAt: new Date(profile.created_at),
                  updatedAt: new Date(profile.updated_at)
                });
              } else {
                // Perfil básico
                setUserProfile({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.email?.split('@')[0] || 'Usuário',
                  dateOfBirth: undefined,
                  diabetesType: 'type2',
                  healthGoals: [],
                  dietaryPreferences: [],
                  subscriptionPlan: 'free',
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
              }
            } catch (profileError) {
              console.log('⚠️ Erro ao carregar perfil no evento (usando básico):', profileError);
              setUserProfile({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || 'Usuário',
                dateOfBirth: undefined,
                diabetesType: 'type2',
                healthGoals: [],
                dietaryPreferences: [],
                subscriptionPlan: 'free',
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('❌ Erro no evento de autenticação (continuando):', error);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      console.log('🔇 Removendo listener de autenticação');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Iniciando processo de login');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erro no login:', error);
      } else {
        console.log('✅ Login realizado com sucesso');
      }
      
      return { data, error };
    } catch (err) {
      console.error('❌ Erro inesperado no login:', err);
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('🔐 Iniciando processo de cadastro');
    
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
        console.log('✅ Cadastro realizado com sucesso');
      }

      return { data, error };
    } catch (err) {
      console.error('❌ Erro inesperado no cadastro:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    console.log('🔐 Fazendo logout');
    
    try {
      await supabase.auth.signOut();
      console.log('✅ Logout concluído');
    } catch (err) {
      console.error('❌ Erro no logout:', err);
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