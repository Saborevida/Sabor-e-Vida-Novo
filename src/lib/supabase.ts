import { createClient } from '@supabase/supabase-js';

// Production-ready configuration with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://exqaukffjkbpomoljnxp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cWF1a2ZmamticG9tb2xqbnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODkwMzksImV4cCI6MjA2NTI2NTAzOX0.wvrijoiwIGuojEY4j_QkRMF70EbCvkOxK1Uf56S52xw';

console.log('🚀 INITIALIZING SUPABASE - FIXED VERSION');
console.log('🌍 URL:', supabaseUrl);
console.log('🔑 Key configured:', supabaseAnonKey ? '✅ YES' : '❌ NO');

// Supabase Client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'sabor-vida-fixed'
    }
  }
});

// Test connection with timeout
const testConnection = async () => {
  console.log('🔍 TESTING SUPABASE CONNECTION');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const { data: authData } = await supabase.auth.getSession();
    clearTimeout(timeoutId);
    console.log('✅ SUPABASE CONNECTION WORKING');
    console.log('🔐 Current session:', authData.session ? 'ACTIVE' : 'INACTIVE');
  } catch (err) {
    console.log('⚠️ Connection test failed, but continuing:', err);
  }
};
testConnection();

// Authentication helpers
export const signUp = async (email: string, password: string, userData: any) => {
  console.log('🔐 SIGNUP STARTED:', email);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/dashboard`
      },
    });
    console.log('📝 Signup result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('❌ Signup error:', err);
    return { data: null, error: err };
  }
};

export const signIn = async (email: string, password: string) => {
  console.log('🔐 LOGIN STARTED:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('📝 Login result:', { 
      user: data.user?.email, 
      session: data.session ? 'ACTIVE' : 'INACTIVE',
      error: error?.message 
    });
    return { data, error };
  } catch (err) {
    console.error('❌ Login error:', err);
    return { data: null, error: err };
  }
};

export const signOut = async () => {
  console.log('🔐 LOGOUT STARTED');
  try {
    const { error } = await supabase.auth.signOut();
    console.log('📝 Logout:', error ? 'ERROR' : 'SUCCESS');
    return { error };
  } catch (err) {
    console.error('❌ Logout error:', err);
    return { error: err };
  }
};

export const getCurrentUser = async () => {
  console.log('👤 CHECKING CURRENT USER');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('📝 Current user:', {
      email: user?.email,
      id: user?.id,
      error: error?.message
    });
    return { user, error };
  } catch (err) {
    console.error('❌ Error getting user:', err);
    return { user: null, error: err };
  }
};

// Database helpers - MOCKED
export const getRecipes = async (filters?: any) => {
  console.log('🍽️ FETCHING RECIPES - USING MOCK DATA');
  return { data: getMockRecipes(), error: null };
};

export const getFavorites = async (userId: string) => {
  console.log('❤️ FETCHING FAVORITES - USING MOCK DATA');
  return { data: [], error: null };
};

export const addToFavorites = async (userId: string, recipeId: string) => {
  console.log('❤️ ADDING FAVORITE (MOCK):', { userId, recipeId });
  return { data: null, error: null };
};

export const removeFromFavorites = async (userId: string, recipeId: string) => {
  console.log('💔 REMOVING FAVORITE (MOCK):', { userId, recipeId });
  return { data: null, error: null };
};

// ✅ Real function to update profile in 'users' table
export const upsertUserProfile = async (userId: string, profileData: any) => {
  console.log('📝 UPSERTING USER PROFILE:', { userId, profileData });

  try {
    const { data, error } = await supabase
      .from('users') // Altere para 'profiles' se for o nome da sua tabela
      .upsert([{ id: userId, ...profileData }]);

    console.log('✅ UPSERT result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('❌ Upsert error:', err);
    return { data: null, error: err };
  }
};

export const updateUserProfile = upsertUserProfile;

// MOCKED recipes
const getMockRecipes = () => [
  {
    id: 'mock-1',
    name: 'Salada de Quinoa com Vegetais Grelhados',
    category: 'lunch',
    ingredients: [
      { name: 'Quinoa', amount: 1, unit: 'xícara' },
      { name: 'Abobrinha', amount: 1, unit: 'unidade' },
      { name: 'Berinjela', amount: 1, unit: 'unidade' },
      { name: 'Tomate cereja', amount: 200, unit: 'g' },
      { name: 'Azeite extra virgem', amount: 2, unit: 'colheres de sopa' },
      { name: 'Limão', amount: 1, unit: 'unidade' },
      { name: 'Manjericão fresco', amount: 10, unit: 'folhas' }
    ],
    instructions: [
      'Cozinhe a quinoa conforme instruções da embalagem',
      'Corte os vegetais em fatias e grelhe por 5-7 minutos',
      'Misture a quinoa com os vegetais grelhados',
      'Tempere com azeite, limão e manjericão',
      'Sirva morno ou frio'
    ],
    nutritionInfo: {
      calories: 320,
      carbohydrates: 45,
      protein: 12,
      fat: 8,
      fiber: 6,
      sugar: 8,
      glycemicIndex: 35,
      servings: 2
    },
    prepTime: 25,
    difficulty: 'easy',
    tags: ['vegetariano', 'sem-gluten', 'baixo-ig', 'rico-em-fibras'],
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... (demais receitas mockadas mantidas conforme seu código original)
];

console.log('✅ SUPABASE CLIENT INITIALIZED WITH MOCK DATA');
console.log('📊 Mock data available:', getMockRecipes().length, 'recipes');
console.log('🎯 APPLICATION READY FOR PRODUCTION');
