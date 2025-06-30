import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Apple, Search, Filter, TrendingUp, BarChart3, Zap, Scale } from 'lucide-react';
import { getNutritionFacts } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const NutritionTablePage: React.FC = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dataSource, setDataSource] = useState<'supabase' | 'example'>('supabase');

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'cereais', label: 'Cereais' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'vegetais', label: 'Vegetais' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'peixes', label: 'Peixes' },
    { value: 'laticinios', label: 'Laticínios' },
    { value: 'oleaginosas', label: 'Oleaginosas' },
    { value: 'tuberculos', label: 'Tubérculos' },
    { value: 'leguminosas', label: 'Leguminosas' },
    { value: 'oleos', label: 'Óleos' },
    { value: 'sementes', label: 'Sementes' },
  ];

  useEffect(() => {
    console.log('🥗 Carregando tabela nutricional');
    fetchNutritionFacts();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory]);

  const fetchNutritionFacts = async () => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout no carregamento da tabela nutricional');
        setLoading(false);
        setDataSource('example');
      }
    }, 10000);

    try {
      console.log('📥 Buscando informações nutricionais...');
      const { data, error } = await getNutritionFacts();
      
      clearTimeout(loadingTimeout);
      
      if (data && data.length > 0) {
        console.log('✅ Tabela nutricional carregada:', data.length);
        setDataSource('supabase');
        setFoods(data);
      } else {
        console.log('ℹ️ Nenhum alimento encontrado');
        setFoods([]);
        setDataSource('example');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar tabela nutricional:', error);
      clearTimeout(loadingTimeout);
      setFoods([]);
      setDataSource('example');
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.food_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    setFilteredFoods(filtered);
  };

  const getGlycemicIndexColor = (gi: number) => {
    if (gi <= 55) return 'text-green-600 bg-green-100';
    if (gi <= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGlycemicIndexText = (gi: number) => {
    if (gi <= 55) return 'Baixo';
    if (gi <= 70) return 'Médio';
    return 'Alto';
  };

  const getCategoryText = (category: string) => {
    const categoryMap = {
      cereais: 'Cereais',
      frutas: 'Frutas',
      vegetais: 'Vegetais',
      carnes: 'Carnes',
      peixes: 'Peixes',
      laticinios: 'Laticínios',
      oleaginosas: 'Oleaginosas',
      tuberculos: 'Tubérculos',
      leguminosas: 'Leguminosas',
      oleos: 'Óleos',
      sementes: 'Sementes',
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando tabela nutricional...</p>
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
            Tabela Nutricional
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Informações nutricionais completas dos alimentos, incluindo índice glicêmico, 
            macronutrientes e micronutrientes.
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
              </strong> {foods.length} alimentos disponíveis
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Apple className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Alimentos</h3>
            <p className="text-2xl font-bold text-primary-600">{foods.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">IG Baixo</h3>
            <p className="text-2xl font-bold text-green-600">
              {foods.filter(food => food.glycemic_index <= 55).length}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">IG Médio</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {foods.filter(food => food.glycemic_index > 55 && food.glycemic_index <= 70).length}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-dark-800">IG Alto</h3>
            <p className="text-2xl font-bold text-red-600">
              {foods.filter(food => food.glycemic_index > 70).length}
            </p>
          </Card>
        </motion.div>

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
                label="Buscar alimento"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                placeholder="Nome do alimento..."
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
              {filteredFoods.length} alimento{filteredFoods.length !== 1 ? 's' : ''} encontrado{filteredFoods.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <Filter size={16} />
              <span>
                {dataSource === 'supabase' ? 'Dados do Supabase' : 'Dados de exemplo'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Foods Grid */}
        {filteredFoods.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {getCategoryText(food.category)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getGlycemicIndexColor(food.glycemic_index)}`}>
                      IG: {food.glycemic_index} ({getGlycemicIndexText(food.glycemic_index)})
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-dark-800 mb-3">
                    {food.food_name}
                  </h3>

                  <div className="text-sm text-neutral-600 mb-4">
                    <p className="font-medium text-dark-700 mb-2">
                      Porção: {food.serving_size}
                    </p>
                  </div>

                  {/* Macronutrientes */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Calorias</span>
                        <span className="font-semibold text-dark-800">{food.calories_per_100g}</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Carbs</span>
                        <span className="font-semibold text-dark-800">{food.carbs_per_100g}g</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Proteína</span>
                        <span className="font-semibold text-dark-800">{food.protein_per_100g}g</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Gordura</span>
                        <span className="font-semibold text-dark-800">{food.fat_per_100g}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Outros nutrientes */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div>
                      <span className="text-neutral-500">Fibra:</span>
                      <span className="ml-1 font-medium">{food.fiber_per_100g}g</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Açúcar:</span>
                      <span className="ml-1 font-medium">{food.sugar_per_100g}g</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Sódio:</span>
                      <span className="ml-1 font-medium">{food.sodium_per_100g}mg</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">CG:</span>
                      <span className="ml-1 font-medium">{food.glycemic_load}</span>
                    </div>
                  </div>

                  {/* Indicadores visuais */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Scale size={14} className="text-neutral-400" />
                      <span className="text-xs text-neutral-500">Por 100g</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        food.glycemic_index <= 55 ? 'bg-green-500' :
                        food.glycemic_index <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-neutral-500">
                        {getGlycemicIndexText(food.glycemic_index)} IG
                      </span>
                    </div>
                  </div>

                  <Button fullWidth variant="outline" size="sm">
                    Ver Detalhes Completos
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center py-12">
              <Apple className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 mb-2">
                {foods.length === 0 ? 'Nenhum alimento disponível' : 'Nenhum alimento encontrado'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {foods.length === 0 
                  ? 'Execute a migração do banco de dados para adicionar a tabela nutricional.'
                  : 'Tente ajustar os filtros para encontrar mais alimentos.'
                }
              </p>
              {foods.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
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

export default NutritionTablePage;