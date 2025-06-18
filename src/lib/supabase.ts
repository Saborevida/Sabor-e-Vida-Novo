import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://exqaukffjkbpomoljnxp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cWF1a2ZmamticG9tb2xqbnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODkwMzksImV4cCI6MjA2NTI2NTAzOX0.wvrijoiwIGuojEY4j_QkRMF70EbCvkOxK1Uf56S52xw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const getRecipes = async (filters?: any) => {
  let query = supabase.from('recipes').select('*');
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  
  if (filters?.maxPrepTime) {
    query = query.lte('prep_time', filters.maxPrepTime);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      recipes (*)
    `)
    .eq('user_id', userId);
  return { data, error };
};

export const addToFavorites = async (userId: string, recipeId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, recipe_id: recipeId });
  return { data, error };
};

export const removeFromFavorites = async (userId: string, recipeId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);
  return { data, error };
};