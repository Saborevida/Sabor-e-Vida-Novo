import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Filter, Clock, Users, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites } from '../lib/supabase';
import { Recipe } from '../types';
import RecipeCard from '../components/recipes/RecipeCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'breakfast', label: 'Café da Manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dinner', label: 'Jantar' },
    { value: 'snack', label: 'Lanche' },
    { value: 'dessert', label: 'Sobremesa' },
    { value: 'beverage', label: 'Bebida' },
  ];

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    filterFavorites();
  }, [favorites, searchTerm, selectedCategory]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      console.log('❤️ Carregando favoritos...');
      const { data, error } = await getFavorites(user.id);
      
      if (data && !error) {
        const favoriteRecipes = data.map(fav => fav.recipes).filter(Boolean);
        console.log('✅ Favoritos carregados:', favoriteRecipes.length);
        setFavorites(favoriteRecipes);
      } else {
        console.log('ℹ️ Nenhum favorito encontrado');
        setFavorites([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFavorites = () => {
    let filtered = favorites;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredFavorites(filtered);
  };

  const handleFavoriteChange = () => {
    fetchFavorites();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando seus favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3" fill="currentColor" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-800">
              Suas Receitas Favoritas
            </h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Todas as receitas que você salvou em um só lugar. 
            Acesse rapidamente suas preparações preferidas.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Total de Favoritos</h3>
            <p className="text-2xl font-bold text-red-600">{favorites.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Tempo Médio</h3>
            <p className="text-2xl font-bold text-blue-600">
              {favorites.length > 0 
                ? Math.round(favorites.reduce((acc, recipe) => acc + recipe.prepTime, 0) / favorites.length)
                : 0
              }
            </p>
            <p className="text-sm text-neutral-600">minutos</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">IG Médio</h3>
            <p className="text-2xl font-bold text-green-600">
              {favorites.length > 0 
                ? Math.round(favorites.reduce((acc, recipe) => acc + recipe.nutritionInfo.glycemicIndex, 0) / favorites.length)
                : 0
              }
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Porções Totais</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {favorites.reduce((acc, recipe) => acc + recipe.nutritionInfo.servings, 0)}
            </p>
          </Card>
        </motion.div>

        {favorites.length > 0 && (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Buscar nos favoritos"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                    placeholder="Nome da receita ou ingrediente..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Results Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-neutral-600">
                  {filteredFavorites.length} receita{filteredFavorites.length !== 1 ? 's' : ''} favorita{filteredFavorites.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <Filter size={16} />
                  <span>Filtros ativos</span>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFavorites.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <RecipeCard 
                  recipe={recipe} 
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center py-16">
              <Heart className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-dark-800 mb-4">
                Nenhuma receita favorita ainda
              </h3>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Explore nossa biblioteca de receitas e salve suas preparações favoritas 
                clicando no ícone de coração.
              </p>
              <Button variant="primary" size="lg">
                Explorar Receitas
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center py-12">
              <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 mb-2">
                Nenhuma receita encontrada
              </h3>
              <p className="text-neutral-600 mb-6">
                Tente ajustar os filtros para encontrar suas receitas favoritas.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Limpar Filtros
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;