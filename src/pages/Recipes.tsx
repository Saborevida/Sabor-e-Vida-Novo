import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, ChefHat } from 'lucide-react';
import { getRecipes } from '@/lib/supabase'; // CORREÇÃO: Usa alias @/
import { Recipe } from '@/types'; // CORREÇÃO: Usa alias @/
import RecipeCard from '@/components/recipes/recipeCard'; // CORREÇÃO: Usa alias @/ e nome minúsculo
import { Card } from '@/components/ui/card';     // CORREÇÃO: Usa named import e alias @/
import { Button } from '@/components/ui/button'; // CORREÇÃO: Usa named import e alias @/
import { Input } from '@/components/ui/input';   // CORREÇÃO: Usa named import e alias @/

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [maxPrepTime, setMaxPrepTime] = useState(120);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Café da Manhã e Lanches', label: 'Café da Manhã' }, // CORREÇÃO: Usar nome da categoria como texto
    { value: 'Pratos Principais', label: 'Almoço/Jantar' }, // CORREÇÃO: Usar nome da categoria como texto
    { value: 'Sopas e Entradas', label: 'Sopas e Entradas' },
    { value: 'Acompanhamentos', label: 'Acompanhamentos' },
    { value: 'Sobremesas Leves', label: 'Sobremesas' },
    { value: 'Biscoitos e Petiscos Doces', label: 'Lanches/Biscoitos' },
    { value: 'Bebidas Especiais', label: 'Bebidas' },
    { value: 'Chás e Infusões Benéficas', label: 'Chás' },
    { value: 'Bolos e Tortas', label: 'Bolos' },
    { value: 'Doces para Ocasiões Especiais', label: 'Doces Especiais' },
    { value: 'Águas Saborizadas', label: 'Águas Saborizadas' },
  ];

  const difficulties = [
    { value: 'all', label: 'Todas as Dificuldades' },
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Médio' },
    { value: 'hard', label: 'Difícil' },
  ];

  useEffect(() => {
    console.log('🍽️ Carregando página de receitas');
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, maxPrepTime]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      console.log('📥 Buscando receitas do Supabase...');
      // A Bolt.New deve ter configurado getRecipes em lib/supabase para buscar da tabela 'recipes'
      const { data, error } = await getRecipes();
      
      if (data && !error) {
        console.log('✅ Receitas carregadas:', data.length);
        setRecipes(data);
      } else {
        console.log('⚠️ Usando receitas de exemplo (dados mock ou fallback):', error);
        // Fallback para mock data se o Supabase não retornar dados
        setRecipes(getExampleRecipes()); 
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar receitas:', error.message);
      setRecipes(getExampleRecipes()); // Usa mock data em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category (usando o nome da categoria como texto)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    // Filter by difficulty (usando o valor 'easy', 'medium', 'hard')
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // Filter by prep time (usando prep_time do novo schema)
    filtered = filtered.filter(recipe => recipe.prep_time <= maxPrepTime); // CORREÇÃO: usa prep_time

    setFilteredRecipes(filtered);
  };

  // Funções de exemplo (para fallback) - Adaptei para o novo schema
  const getExampleRecipes = (): Recipe[] => [
    {
      id: 'mock-1',
      name: 'Salada de Quinoa com Vegetais Grelhados (Exemplo)',
      category: 'Pratos Principais', // Usando nome da categoria
      ingredients: [{ name: 'Quinoa', amount: 1, unit: 'xícara' }], // Simplificado
      instructions: ['Instrução 1', 'Instrução 2'],
      nutrition_info: { // Adaptação para snake_case
        calories: 320, carbohydrates: 45, protein: 12, fat: 8, fiber: 6, sugar: 8, glycemic_index: 35, servings: 2
      },
      prep_time: 25, // Adaptação para snake_case
      difficulty: 'easy',
      tags: ['vegetariano', 'sem-gluten'],
      image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      name: 'Salmão Grelhado com Brócolis (Exemplo)',
      category: 'Pratos Principais',
      ingredients: [{ name: 'Salmão', amount: 150, unit: 'g' }],
      instructions: ['Instrução 1', 'Instrução 2'],
      nutrition_info: {
        calories: 280, carbohydrates: 12, protein: 35, fat: 15, fiber: 4, sugar: 3, glycemic_index: 15, servings: 1
      },
      prep_time: 20,
      difficulty: 'medium',
      tags: ['rico-em-proteina', 'omega-3'],
      image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando receitas...</p>
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
              <span>Filtros ativos</span>
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
                <RecipeCard 
                  recipe={recipe} 
                  // onFavoriteChange={handleFavoriteChange} // Adicionar se RecipesPage gerenciar favoritos
                />
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
                Nenhuma receita encontrada
              </h3>
              <p className="text-neutral-600 mb-6">
                Tente ajustar os filtros para encontrar mais receitas.
              </p>
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
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
