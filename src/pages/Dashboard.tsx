import React, { useEffect, useState } from 'react';
import { getRecipes, getFavorites } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types';
import RecipeCard from '../components/recipes/RecipeCard';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import Card from '@/components/ui/Card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: recipesData, error: recipesError } = await getRecipes();
      const { data: favsData, error: favsError } = await getFavorites(user.id);

      if (recipesError) console.error('Erro ao buscar receitas:', recipesError);
      if (favsError) console.error('Erro ao buscar favoritos:', favsError);

      if (recipesData) setRecipes(recipesData);
      if (favsData) {
        const favIds = favsData.map(f => f.recipe_id);
        setFavorites(favIds);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteChange = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-800">
              Receitas Recomendadas
            </h1>
          </div>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Descubra sugestões saudáveis personalizadas com base nos seus gostos e favoritos.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando receitas...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <RecipeCard
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.id)}
                  onFavoriteChange={handleFavoriteChange}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
