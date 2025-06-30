import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, ChefHat } from 'lucide-react';
import { getRecipes } from '../lib/supabase';
import { Recipe } from '../types';
import RecipeCard from '../components/recipes/RecipeCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [maxPrepTime, setMaxPrepTime] = useState(120);
  const [dataSource, setDataSource] = useState<'supabase' | 'example'>('supabase');

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'breakfast', label: 'Café da Manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dinner', label: 'Jantar' },
    { value: 'snack', label: 'Lanche' },
    { value: 'dessert', label: 'Sobremesa' },
    { value: 'beverage', label: 'Bebida' },
  ];

  const difficulties = [
    { value: 'all', label: 'Todas as Dificuldades' },
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Médio' },
    { value: 'hard', label: 'Difícil' },
  ];

  useEffect(() => {
    console.log('🍽️ Carregando página de receitas com timeout');
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, maxPrepTime]);

  const fetchRecipes = async () => {
    // Timeout para carregamento
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout no carregamento de receitas');
        setLoading(false);
        setDataSource('example');
      }
    }, 10000); // 10 segundos máximo

    try {
      console.log('📥 Buscando receitas com timeout...');
      const { data, error } = await getRecipes();
      
      clearTimeout(loadingTimeout);
      
      if (data && data.length > 0) {
        console.log('✅ Receitas carregadas:', data.length);
        
        // Verificar se são dados reais ou de exemplo
        const isExample = data.some(recipe => recipe.id?.startsWith('example-'));
        setDataSource(isExample ? 'example' : 'supabase');
        
        // Converter dados para o formato esperado
        const formattedRecipes: Recipe[] = data.map(recipe => ({
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
        
        setRecipes(formattedRecipes);
      } else {
        console.log('ℹ️ Nenhuma receita encontrada');
        setRecipes([]);
        setDataSource('example');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar receitas:', error);
      clearTimeout(loadingTimeout);
      setRecipes([]);
      setDataSource('example');
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

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

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // Filter by prep time
    filtered = filtered.filter(recipe => recipe.prepTime <= maxPrepTime);

    setFilteredRecipes(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando receitas...</p>
          <p className="text-sm text-neutral-500 mt-2">Máximo 10 segundos</p>
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
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-800 mb-4">
            Biblioteca de Receitas
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Descubra receitas deliciosas e saudáveis especialmente desenvolvidas 
            para diabéticos, com informações nutricionais completas.
          </p>
          
          {/* Status de conexão */}
          <div className={`mt-4 p-3 border rounded-lg text-sm max-w-md mx-auto ${
            dataSource === 'supabase' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p>
              <strong>
                {dataSource === 'supabase' ? '✅ Conectado ao Supabase' : '📝 Dados de Exemplo'}:
              </strong> {recipes.length} receitas disponíveis
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Buscar receitas"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                placeholder="Nome ou ingrediente..."
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

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Dificuldade
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Tempo máximo: {maxPrepTime} min
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={maxPrepTime}
                  onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-neutral-600">
              {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <Filter size={16} />
              <span>
                {dataSource === 'supabase' ? 'Dados do Supabase' : 'Dados de exemplo'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center py-12">
              <ChefHat className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 mb-2">
                {recipes.length === 0 ? 'Nenhuma receita disponível' : 'Nenhuma receita encontrada'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {recipes.length === 0 
                  ? 'Adicione receitas ao seu banco Supabase ou verifique a conexão.'
                  : 'Tente ajustar os filtros para encontrar mais receitas.'
                }
              </p>
              {recipes.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setMaxPrepTime(120);
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;