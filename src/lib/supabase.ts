// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { GlossaryItem, Recipe, Favorite } from '@/types';

// Configuração de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://exqaukffjkbpomoljnxp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'chave-pública-aqui';

const isDev = import.meta.env.DEV;

console.log('🚀 INITIALIZING SUPABASE');
console.log('🌍 URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey ? '✅ PRESENT' : '❌ MISSING');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'sabor-vida'
    }
  }
});

const testConnection = async () => {
  console.log('🔍 TESTING CONNECTION');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const { data } = await supabase.auth.getSession();
    clearTimeout(timeoutId);

    console.log('✅ SESSION STATUS:', data.session ? 'ACTIVE' : 'INACTIVE');
  } catch (err) {
    console.log('⚠️ TEST FAILED:', err);
  }
};

testConnection();

// Autenticação
export const signUp = async (email: string, password: string, userData: any) => {
  console.log('🔐 SIGN UP:', email);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const signIn = async (email: string, password: string) => {
  console.log('🔐 SIGN IN:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const signOut = async () => {
  console.log('🔐 SIGN OUT');
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    return { error: err };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (err) {
    return { user: null, error: err };
  }
};

// Receitas
export const getRecipes = async (): Promise<{ data: Recipe[] | null; error: any }> => {
  if (isDev) {
    console.log('🍽️ DEV - MOCK RECIPES');
    return { data: getMockRecipes(), error: null };
  }
  console.log('🍽️ FETCHING REAL RECIPES FROM SUPABASE');
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('❌ Error:', error.message);
      return { data: null, error };
    }
    return { data: data as Recipe[], error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Favoritos
export const getFavorites = async (userId: string): Promise<{ data: Favorite[] | null; error: any }> => {
  if (isDev) {
    console.log('❤️ DEV - EMPTY FAVORITES');
    return { data: [], error: null };
  }
  console.log('❤️ FETCHING FAVORITES FROM SUPABASE');
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, recipes(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('❌ Error:', error.message);
      return { data: null, error };
    }
    return { data: data as Favorite[], error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const addToFavorites = async (userId: string, recipeId: string) => {
  console.log('❤️ ADDING FAVORITE');
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, recipe_id: recipeId }]);
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const removeFromFavorites = async (userId: string, recipeId: string) => {
  console.log('💔 REMOVING FAVORITE');
  try {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Glossário
export const getGlossaryItems = async (): Promise<{ data: GlossaryItem[] | null; error: any }> => {
  console.log('📘 FETCHING GLOSSARY ITEMS FROM SUPABASE');
  try {
    const { data, error } = await supabase
      .from('glossary')
      .select('id, term, definition, category, tags');
    if (error) {
      console.error('❌ Glossary fetch error:', error.message);
      return { data: null, error };
    }
    return { data: data as GlossaryItem[], error: null };
  } catch (err) {
    console.error('❌ Unexpected error in getGlossaryItems:', err);
    return { data: null, error: err };
  }
};

// Mock
const getMockRecipes = (): Recipe[] => [
  {
    id: 'mock-1',
    name: 'Salada de Quinoa com Vegetais',
    category: 'lunch',
    ingredients: [],
    instructions: [],
    nutritionInfo: {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      glycemicIndex: 0,
      servings: 1,
    },
    prepTime: 25,
    difficulty: 'easy',
    tags: ['vegetariano'],
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
