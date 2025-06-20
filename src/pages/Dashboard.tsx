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
import { useAuth } from '@/contexts/AuthContext'; // CORREÇÃO: Usa alias @/
import { getRecipes, getFavorites } from '@/lib/supabase'; // CORREÇÃO: Usa alias @/
import { Recipe } from '@/types'; // CORREÇÃO: Usa alias @/
import { Card } from '@/components/ui/card';   // CORREÇÃO: Usa named import e alias @/
import { Button } from '@/components/ui/button'; // CORREÇÃO: Usa named import e alias @/

const Dashboard: React.FC = () => {
  const { userProfile, user } = useAuth(); // CORREÇÃO: userProfile pode vir de user ou ser um estado separado, adicionado 'user' para usar user.id
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📊 Carregando dados do dashboard');
    
    const fetchDashboardData = async () => {
      // CORREÇÃO: userProfile pode não estar imediatamente disponível, usar 'user' do AuthContext
      if (!user) { // Verifica se há um usuário logado
        console.log('👤 Aguardando perfil do usuário ou login...');
        setLoading(false); // Parar o loading se não houver usuário logado
        return;
      }

      try {
        console.log('🔄 Buscando dados do dashboard para:', user.email);
        
        // Fetch recent recipes
        // getRecipes() deve buscar da tabela 'recipes'
        const { data: recipes, error: recipesError } = await getRecipes();
        if (recipes && !recipesError) {
          console.log('✅ Receitas carregadas:', recipes.length);
          // CORREÇÃO: As propriedades de receita devem ser snake_case no RecipeCard se vierem do DB
          setRecentRecipes(recipes.slice(0, 4)); 
        } else {
          console.log('⚠️ Usando receitas mock (se getRecipes não retornar dados)');
          // A Bolt.New disse que adicionou mock data fallbacks, então se não tiver receitas no DB, deve usar mock.
          setRecentRecipes([]); // Ou use um mock de fallback aqui se getRecipes não tiver fallback interno
        }

        // Fetch favorite recipes
        // getFavorites() deve buscar da tabela 'favorites' com join para 'recipes'
        const { data: favorites, error: favoritesError } = await getFavorites(user.id); // CORREÇÃO: Usar user.id
        if (favorites && !favoritesError) {
          console.log('✅ Favoritos carregados:', favorites.length);
          // Mapeia para pegar o objeto de receita do join, se a estrutura for { id, user_id, recipe_id, recipes: {...recipe_object} }
          const fetchedFavoriteRecipes = favorites.map((fav: any) => fav.recipes).filter(Boolean).slice(0, 4); // 'any' temporário, idealmente tipar 'fav'
          setFavoriteRecipes(fetchedFavoriteRecipes);
        } else {
          console.log('ℹ️ Nenhum favorito encontrado ou erro ao carregar favoritos:', favoritesError?.message);
          setFavoriteRecipes([]);
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar dados do dashboard:', error.message);
        // Implementar fallback para dados mock se a Bolt.New prometeu
      } finally {
        setLoading(false);
        console.log('✅ Carregamento do dashboard concluído');
      }
    };

    fetchDashboardData();
  }, [user]); // Re-executa quando 'user' muda, garantindo que o perfil é buscado após o login

  // Stats hardcoded, idealmente seriam dinâmicos com dados do usuário/BD
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
      value: 3, // Este valor é hardcoded, deve vir do DB 'meal_plans' do user
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Artigos Lidos',
      value: 12, // Este valor é hardcoded, deve vir do DB ou lógica de usuário
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pontuação Saúde',
      value: 85, // Este valor é hardcoded, deve vir do perfil do usuário ou cálculo
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

  // Se o userProfile não estiver disponível após o loading, pode ser um problema de autenticação/RLS
  // Adicionei um fallback para o caso de userProfile ainda não ter sido carregado.
  if (!userProfile && !loading && user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-xl font-heading font-bold text-dark-800 mb-4">Erro ao carregar perfil</h1>
          <p className="text-red-600 mb-4">Seu perfil não pôde ser carregado. Tente novamente ou entre em contato com o suporte.</p>
          <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
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
            Olá, {userProfile?.name || user?.email || 'Usuário'}! 👋 {/* CORREÇÃO: userProfile.name */}
          </h1>
          <p className="text-neutral-600">
            Bem-vindo de volta ao seu painel de controle nutricional
          </p>
          
          {/* Debug info em desenvolvimento */}
          {import.meta.env.DEV && ( // Mostra apenas em ambiente de desenvolvimento local
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <p><strong>Debug:</strong> Dashboard carregado com sucesso</p>
              <p><strong>Usuário:</strong> {userProfile?.email || user?.email}</p>
              <p><strong>Receitas Recentes:</strong> {recentRecipes.length}</p>
              <p><strong>Favoritos:</strong> {favoriteRecipes.length}</p>
            </div>
          )}
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
                        src={recipe.image_url || 'https://placehold.co/100x100/EAEAEA/272525?text=Receita'} // CORREÇÃO: image_url
                        alt={recipe.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-dark-800">{recipe.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{recipe.prep_time} min</span> {/* CORREÇÃO: prep_time */}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users size={14} />
                            <span>{recipe.nutrition_info.servings}</span> {/* CORREÇÃO: nutrition_info.servings */}
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp size={14} />
                            <span>IG: {recipe.nutrition_info.glycemic_index}</span> {/* CORREÇÃO: nutrition_info.glycemic_index */}
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
                    Carregando receitas...
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
                        src={recipe.image_url || 'https://placehold.co/100x100/EAEAEA/272525?text=Receita'} // CORREÇÃO: image_url
                        alt={recipe.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-dark-800">{recipe.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{recipe.prep_time} min</span> {/* CORREÇÃO: prep_time */}
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
