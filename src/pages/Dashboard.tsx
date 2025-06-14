import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Calendar, 
  BookOpen, 
  Star, 
  TrendingUp,
  Clock,
  Users,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getRecipes, getFavorites } from '../lib/supabase';
import { Recipe } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RecipeCard from '../components/recipes/RecipeCard';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userProfile) return;

      try {
        // Fetch recent recipes
        const { data: recipes } = await getRecipes();
        if (recipes) {
          setRecentRecipes(recipes.slice(0, 4));
        }

        // Fetch favorite recipes
        const { data: favorites } = await getFavorites(userProfile.id);
        if (favorites) {
          setFavoriteRecipes(favorites.map(f => f.recipes).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userProfile]);

  const stats = [
    {
      title: 'Receitas Favoritas',
      value: favoriteRecipes.length,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Planos Criados',
      value: 3,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Artigos Lidos',
      value: 12,
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pontuação Saúde',
      value: 85,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
  ];

  const quickActions = [
    {
      title: 'Nova Receita',
      description: 'Descubra receitas personalizadas',
      icon: ChefHat,
      color: 'bg-primary-500',
      href: '/recipes',
    },
    {
      title: 'Planejar Semana',
      description: 'Crie seu plano de refeições',
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/meal-plans',
    },
    {
      title: 'Aprender',
      description: 'Conteúdo educativo',
      icon: BookOpen,
      color: 'bg-green-500',
      href: '/education',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-dark-800 mb-2">
            Olá, {userProfile?.name || 'Usuário'}! 👋
          </h1>
          <p className="text-neutral-600">
            Bem-vindo de volta ao seu painel de controle nutricional
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark-800">{stat.value}</p>
                    <p className="text-sm text-neutral-600">{stat.title}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-heading font-semibold text-dark-800 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} hover className="text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-dark-800 mb-2">{action.title}</h3>
                <p className="text-sm text-neutral-600 mb-4">{action.description}</p>
                <Button variant="outline" size="sm" fullWidth>
                  Acessar
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Recipes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-dark-800">
                Receitas Recentes
              </h2>
              <Button variant="ghost" size="sm">
                Ver Todas
              </Button>
            </div>
            <div className="space-y-4">
              {recentRecipes.map((recipe) => (
                <Card key={recipe.id} hover padding="sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={recipe.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={recipe.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-dark-800">{recipe.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{recipe.prepTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{recipe.nutritionInfo.servings}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp size={14} />
                          <span>IG: {recipe.nutritionInfo.glycemicIndex}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Favorite Recipes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-dark-800">
                Seus Favoritos
              </h2>
              <Button variant="ghost" size="sm">
                Ver Todos
              </Button>
            </div>
            <div className="space-y-4">
              {favoriteRecipes.length > 0 ? (
                favoriteRecipes.map((recipe) => (
                  <Card key={recipe.id} hover padding="sm">
                    <div className="flex items-center space-x-4">
                      <img
                        src={recipe.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={recipe.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-dark-800">{recipe.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{recipe.prepTime} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart size={14} className="text-red-500" />
                            <span>Favorito</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-8">
                  <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">
                    Você ainda não tem receitas favoritas
                  </p>
                  <Button variant="outline" size="sm">
                    Explorar Receitas
                  </Button>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;