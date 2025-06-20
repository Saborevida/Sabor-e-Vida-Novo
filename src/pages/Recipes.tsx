import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, ChefHat } from 'lucide-react';
import { getRecipes } from '../lib/supabase';
import { Recipe } from '../types';
import RecipeCard from '../components/recipes/RecipeCard';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import Input from '../components/ui/input';

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
    console.log('🍽️ Carregando página de receitas');
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, maxPrepTime]);

  const fetchRecipes = async () => {
    try {
      console.log('📥 Buscando receitas...');
      const { data, error } = await getRecipes();
      
      if (data && !error) {
        console.log('✅ Receitas carregadas:', data.length);
        setRecipes(data);
      } else {
        console.log('⚠️ Usando receitas de exemplo');
        setRecipes(getExampleRecipes());
      }
    } catch (error) {
      console.error('❌ Erro ao carregar receitas:', error);
      setRecipes(getExampleRecipes());
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

  const getExampleRecipes = (): Recipe[] => [
    {
      id: '1',
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
    {
      id: '2',
      name: 'Salmão Grelhado com Brócolis no Vapor',
      category: 'dinner',
      ingredients: [
        { name: 'Filé de salmão', amount: 150, unit: 'g' },
        { name: 'Brócolis', amount: 200, unit: 'g' },
        { name: 'Azeite', amount: 1, unit: 'colher de sopa' },
        { name: 'Limão', amount: 0.5, unit: 'unidade' },
        { name: 'Alho', amount: 2, unit: 'dentes' },
        { name: 'Sal marinho', amount: 1, unit: 'pitada' },
        { name: 'Pimenta-do-reino', amount: 1, unit: 'pitada' }
      ],
      instructions: [
        'Tempere o salmão com sal, pimenta e limão',
        'Aqueça uma frigideira antiaderente',
        'Grelhe o salmão por 4 minutos de cada lado',
        'Cozinhe o brócolis no vapor por 5 minutos',
        'Refogue o alho no azeite e misture com o brócolis',
        'Sirva o salmão com o brócolis'
      ],
      nutritionInfo: {
        calories: 280,
        carbohydrates: 12,
        protein: 35,
        fat: 15,
        fiber: 4,
        sugar: 3,
        glycemicIndex: 15,
        servings: 1
      },
      prepTime: 20,
      difficulty: 'medium',
      tags: ['rico-em-proteina', 'omega-3', 'baixo-carb', 'anti-inflamatorio'],
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Smoothie Verde Detox',
      category: 'beverage',
      ingredients: [
        { name: 'Espinafre baby', amount: 50, unit: 'g' },
        { name: 'Pepino', amount: 0.5, unit: 'unidade' },
        { name: 'Maçã verde', amount: 1, unit: 'unidade' },
        { name: 'Gengibre fresco', amount: 1, unit: 'cm' },
        { name: 'Água de coco', amount: 200, unit: 'ml' },
        { name: 'Limão', amount: 0.5, unit: 'unidade' },
        { name: 'Hortelã', amount: 5, unit: 'folhas' }
      ],
      instructions: [
        'Lave bem todos os ingredientes',
        'Descasque o gengibre e corte em pedaços pequenos',
        'Corte a maçã em pedaços (sem casca se preferir)',
        'Bata todos os ingredientes no liquidificador',
        'Coe se desejar uma textura mais lisa',
        'Sirva imediatamente com gelo'
      ],
      nutritionInfo: {
        calories: 95,
        carbohydrates: 22,
        protein: 3,
        fat: 0.5,
        fiber: 4,
        sugar: 18,
        glycemicIndex: 30,
        servings: 1
      },
      prepTime: 10,
      difficulty: 'easy',
      tags: ['detox', 'baixa-caloria', 'antioxidante', 'hidratante'],
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Omelete de Claras com Cogumelos',
      category: 'breakfast',
      ingredients: [
        { name: 'Claras de ovo', amount: 4, unit: 'unidades' },
        { name: 'Cogumelos paris', amount: 100, unit: 'g' },
        { name: 'Espinafre', amount: 50, unit: 'g' },
        { name: 'Queijo cottage', amount: 2, unit: 'colheres de sopa' },
        { name: 'Azeite', amount: 1, unit: 'colher de chá' },
        { name: 'Cebola', amount: 0.25, unit: 'unidade' },
        { name: 'Sal e pimenta', amount: 1, unit: 'a gosto' }
      ],
      instructions: [
        'Refogue a cebola e os cogumelos no azeite',
        'Adicione o espinafre e refogue até murchar',
        'Bata as claras com sal e pimenta',
        'Despeje as claras na frigideira',
        'Adicione o recheio em uma metade',
        'Dobre a omelete e sirva quente'
      ],
      nutritionInfo: {
        calories: 180,
        carbohydrates: 8,
        protein: 22,
        fat: 6,
        fiber: 3,
        sugar: 4,
        glycemicIndex: 20,
        servings: 1
      },
      prepTime: 15,
      difficulty: 'easy',
      tags: ['alto-em-proteina', 'baixo-carb', 'cafe-da-manha', 'rapido'],
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Mousse de Chocolate com Abacate',
      category: 'dessert',
      ingredients: [
        { name: 'Abacate maduro', amount: 2, unit: 'unidades' },
        { name: 'Cacau em pó', amount: 3, unit: 'colheres de sopa' },
        { name: 'Adoçante stevia', amount: 2, unit: 'colheres de chá' },
        { name: 'Leite de amêndoas', amount: 100, unit: 'ml' },
        { name: 'Essência de baunilha', amount: 1, unit: 'colher de chá' },
        { name: 'Castanhas picadas', amount: 2, unit: 'colheres de sopa' }
      ],
      instructions: [
        'Retire a polpa dos abacates',
        'Bata no liquidificador com cacau e adoçante',
        'Adicione o leite de amêndoas aos poucos',
        'Acrescente a baunilha',
        'Leve à geladeira por 2 horas',
        'Sirva decorado com castanhas'
      ],
      nutritionInfo: {
        calories: 220,
        carbohydrates: 18,
        protein: 6,
        fat: 16,
        fiber: 8,
        sugar: 8,
        glycemicIndex: 25,
        servings: 2
      },
      prepTime: 15,
      difficulty: 'easy',
      tags: ['sem-acucar', 'vegano', 'rico-em-fibras', 'antioxidante'],
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Wrap de Frango com Vegetais',
      category: 'lunch',
      ingredients: [
        { name: 'Peito de frango', amount: 120, unit: 'g' },
        { name: 'Tortilla integral', amount: 1, unit: 'unidade' },
        { name: 'Alface americana', amount: 3, unit: 'folhas' },
        { name: 'Tomate', amount: 1, unit: 'unidade' },
        { name: 'Cenoura ralada', amount: 2, unit: 'colheres de sopa' },
        { name: 'Iogurte grego', amount: 2, unit: 'colheres de sopa' },
        { name: 'Mostarda dijon', amount: 1, unit: 'colher de chá' }
      ],
      instructions: [
        'Tempere e grelhe o frango até cozinhar',
        'Corte o frango em tiras',
        'Misture o iogurte com a mostarda',
        'Espalhe o molho na tortilla',
        'Adicione os vegetais e o frango',
        'Enrole firmemente e corte ao meio'
      ],
      nutritionInfo: {
        calories: 290,
        carbohydrates: 28,
        protein: 25,
        fat: 8,
        fiber: 5,
        sugar: 6,
        glycemicIndex: 40,
        servings: 1
      },
      prepTime: 20,
      difficulty: 'medium',
      tags: ['alto-em-proteina', 'portatil', 'equilibrado', 'pratico'],
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: new Date(),
      updatedAt: new Date()
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