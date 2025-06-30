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
import SubscriptionStatus from '../components/subscription/SubscriptionStatus';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'example'>('supabase');

  useEffect(() => {
    console.log('📊 Carregando dados do dashboard com timeout');
    
    const fetchDashboardData = async () => {
      if (!userProfile) {
        console.log('👤 Aguardando perfil do usuário...');
        return;
      }

      // Timeout para carregamento
      const loadingTimeout = setTimeout(() => {
        if (loading) {
          console.log('⏰ Timeout no carregamento do dashboard');
          setLoading(false);
          setDataSource('example');
        }
      }, 10000); // 10 segundos máximo

      try {
        console.log('🔄 Buscando dados do dashboard para:', userProfile.email);
        
        // Buscar receitas com timeout
        const { data: recipes, error: recipesError } = await getRecipes();
        if (recipes && !recipesError) {
          console.log('✅ Receitas carregadas:', recipes.length);
          
          // Verificar se são dados reais ou de exemplo
          const isExample = recipes.some(recipe => recipe.id?.startsWith('example-'));
          setDataSource(isExample ? 'example' : 'supabase');
          
          // Converter dados para o formato esperado
          const formattedRecipes: Recipe[] = recipes.slice(0, 4).map(recipe => ({
            id: recipe.id,
            name: recipe.name,
            category: recipe.category,
            ingredients: recipe.ingredients || [],
            instructions: recipe.instructions || [],
            nutritionInfo: recipe.nutrition_info || {
              calories: 0,
              carbohydrates: 0,
              protein: 0,
              fat: 0,
              fiber: 0,
              sugar: 0,
              glycemicIndex: 0,
              servings: 1
            },
            prepTime: recipe.prep_time || 0,
            difficulty: recipe.difficulty || 'easy',
            tags: recipe.tags || [],
            imageUrl: recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(recipe.created_at),
            updatedAt: new Date(recipe.updated_at)
          }));
          
          setRecentRecipes(formattedRecipes);
        } else {
          console.log('⚠️ Erro ao carregar receitas:', recipesError);
          setRecentRecipes([]);
          setDataSource('example');
        }

        // Buscar favoritos com timeout (apenas se não for dados de exemplo)
        if (dataSource === 'supabase') {
          try {
            const { data: favorites, error: favoritesError } = await getFavorites(userProfile.id);
            if (favorites && !favoritesError) {
              console.log('✅ Favoritos carregados:', favorites.length);
              
              // Converter favoritos para receitas
              const favoriteRecipesList: Recipe[] = favorites
                .filter(fav => fav.recipes)
                .slice(0, 4)
                .map(fav => {
                  const recipe = fav.recipes;
                  return {
                    id: recipe.id,
                    name: recipe.name,
                    category: recipe.category,
                    ingredients: recipe.ingredients || [],
                    instructions: recipe.instructions || [],
                    nutritionInfo: recipe.nutrition_info || {
                      calories: 0,
                      carbohydrates: 0,
                      protein: 0,
                      fat: 0,
                      fiber: 0,
                      sugar: 0,
                      glycemicIndex: 0,
                      servings: 1
                    },
                    prepTime: recipe.prep_time || 0,
                    difficulty: recipe.difficulty || 'easy',
                    tags: recipe.tags || [],
                    imageUrl: recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
                    createdAt: new Date(recipe.created_at),
                    updatedAt: new Date(recipe.updated_at)
                  };
                });
              
              setFavoriteRecipes(favoriteRecipesList);
            } else {
              console.log('ℹ️ Nenhum favorito encontrado');
              setFavoriteRecipes([]);
            }
          } catch (favError) {
            console.log('⚠️ Erro ao carregar favoritos (continuando):', favError);
            setFavoriteRecipes([]);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do dashboard:', error);
        setDataSource('example');
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
        console.log('✅ Carregamento do dashboard concluído');
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
      value: 0,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Receitas Disponíveis',
      value: recentRecipes.length,
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
          <p className="text-neutral-600">Carregando dashboard...</p>
          <p className="text-sm text-neutral-500 mt-2">Máximo 10 segundos</p>
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
          
          {/* Status de conexão */}
          <div className={`mt-4 p-3 border rounded-lg text-sm ${
            dataSource === 'supabase' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p>
              <strong>
                {dataSource === 'supabase' ? '✅ Conectado ao Supabase' : '📝 Dados de Exemplo'}
              </strong>
            </p>
            <p><strong>👤 Usuário:</strong> {userProfile?.email}</p>
            <p><strong>🍽️ Receitas:</strong> {recentRecipes.length}</p>
            <p><strong>❤️ Favoritos:</strong> {favoriteRecipes.length}</p>
          </div>
        </motion.div>

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SubscriptionStatus />
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
              {recentRecipes.length > 0 ? (
                recentRecipes.map((recipe) => (
                  <Card key={recipe.id} hover padding="sm">
                    <div className="flex items-center space-x-4">
                      <img
                        src={recipe.imageUrl}
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
                ))
              ) : (
                <Card className="text-center py-8">
                  <ChefHat className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">
                    Nenhuma receita encontrada
                  </p>
                  <p className="text-sm text-neutral-500">
                    {dataSource === 'supabase' 
                      ? 'Adicione receitas ao banco de dados'
                      : 'Conecte ao Supabase para ver dados reais'
                    }
                  </p>
                </Card>
              )}
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
                        src={recipe.imageUrl}
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