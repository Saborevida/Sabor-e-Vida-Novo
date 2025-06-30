import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, Star, Users, TrendingUp, Book } from 'lucide-react';
import { getGlossary } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const GlossaryPage: React.FC = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [dataSource, setDataSource] = useState<'supabase' | 'example'>('supabase');

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'nutricao', label: 'Nutrição' },
    { value: 'exercicios', label: 'Exercícios' },
    { value: 'medicamentos', label: 'Medicamentos' },
    { value: 'geral', label: 'Geral' },
  ];

  const difficulties = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
  ];

  useEffect(() => {
    console.log('📖 Carregando página do glossário');
    fetchGlossary();
  }, []);

  useEffect(() => {
    filterTerms();
  }, [terms, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchGlossary = async () => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout no carregamento do glossário');
        setLoading(false);
        setDataSource('example');
      }
    }, 10000);

    try {
      console.log('📥 Buscando glossário...');
      const { data, error } = await getGlossary();
      
      clearTimeout(loadingTimeout);
      
      if (data && data.length > 0) {
        console.log('✅ Glossário carregado:', data.length);
        setDataSource('supabase');
        setTerms(data);
      } else {
        console.log('ℹ️ Nenhum termo encontrado');
        setTerms([]);
        setDataSource('example');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar glossário:', error);
      clearTimeout(loadingTimeout);
      setTerms([]);
      setDataSource('example');
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const filterTerms = () => {
    let filtered = terms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.synonyms.some((synonym: string) => synonym.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(term => term.difficulty_level === selectedDifficulty);
    }

    setFilteredTerms(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante': return 'text-green-600 bg-green-100';
      case 'intermediario': return 'text-yellow-600 bg-yellow-100';
      case 'avancado': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap = {
      diabetes: 'Diabetes',
      nutricao: 'Nutrição',
      exercicios: 'Exercícios',
      medicamentos: 'Medicamentos',
      geral: 'Geral',
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando glossário...</p>
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
            Glossário Nutricional
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Dicionário completo de termos relacionados à nutrição, diabetes e saúde. 
            Entenda os conceitos importantes para sua jornada.
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
              </strong> {terms.length} termos disponíveis
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
              <Book className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Termos</h3>
            <p className="text-2xl font-bold text-primary-600">{terms.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Categorias</h3>
            <p className="text-2xl font-bold text-blue-600">
              {new Set(terms.map(term => term.category)).size}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Iniciante</h3>
            <p className="text-2xl font-bold text-green-600">
              {terms.filter(term => term.difficulty_level === 'iniciante').length}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Avançado</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {terms.filter(term => term.difficulty_level === 'avancado').length}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Buscar termo"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                placeholder="Termo, definição ou sinônimo..."
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
              {filteredTerms.length} termo{filteredTerms.length !== 1 ? 's' : ''} encontrado{filteredTerms.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <Filter size={16} />
              <span>
                {dataSource === 'supabase' ? 'Dados do Supabase' : 'Dados de exemplo'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Terms Grid */}
        {filteredTerms.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {getCategoryText(term.category)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(term.difficulty_level)}`}>
                      {term.difficulty_level}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-dark-800 mb-3">
                    {term.term}
                  </h3>

                  <p className="text-neutral-600 text-sm mb-4 line-clamp-4">
                    {term.definition}
                  </p>

                  {term.synonyms && term.synonyms.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-neutral-500 mb-2">SINÔNIMOS:</h4>
                      <div className="flex flex-wrap gap-1">
                        {term.synonyms.slice(0, 3).map((synonym: string, synIndex: number) => (
                          <span
                            key={synIndex}
                            className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                          >
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {term.examples && term.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-neutral-500 mb-2">EXEMPLOS:</h4>
                      <ul className="text-xs text-neutral-600 space-y-1">
                        {term.examples.slice(0, 2).map((example: string, exIndex: number) => (
                          <li key={exIndex} className="flex items-start">
                            <span className="text-primary-500 mr-1">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {term.related_terms && term.related_terms.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-neutral-500 mb-2">TERMOS RELACIONADOS:</h4>
                      <div className="flex flex-wrap gap-1">
                        {term.related_terms.slice(0, 3).map((relatedTerm: string, relIndex: number) => (
                          <span
                            key={relIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                          >
                            {relatedTerm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button fullWidth variant="outline" size="sm">
                    Ver Detalhes
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
              <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 mb-2">
                {terms.length === 0 ? 'Nenhum termo disponível' : 'Nenhum termo encontrado'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {terms.length === 0 
                  ? 'Execute a migração do banco de dados para adicionar o glossário.'
                  : 'Tente ajustar os filtros para encontrar mais termos.'
                }
              </p>
              {terms.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
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

export default GlossaryPage;