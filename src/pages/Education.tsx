import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, Clock, Star, Users, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';     // CORREÇÃO: Usa named import e alias @/
import { Button } from '@/components/ui/button'; // CORREÇÃO: Usa named import e alias @/
import { Input } from '@/components/ui/input';   // CORREÇÃO: Usa named import e alias @/
import { supabase } from '@/lib/supabase'; // Importa a instância do Supabase

// Tipagem para um termo do glossário do Supabase
interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Adaptação para o formato de 'artigo' esperado pelo componente
interface Article extends GlossaryTerm {
  title: string;
  excerpt: string;
  readTime: number; // Mock data
  difficulty: string; // Mock data
  rating: number; // Mock data
  views: number; // Mock data
  image: string; // Placeholder image
}

const EducationPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todos os Tópicos' },
    { value: 'nutrition', label: 'Nutrição' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'recipes', label: 'Técnicas Culinárias' }, // Mantido 'recipes' para categoria de artigos
    { value: 'lifestyle', label: 'Estilo de Vida' },
    { value: 'supplements', label: 'Suplementos' },
  ];

  // Função para buscar termos do glossário do Supabase
  const fetchGlossaryTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('glossary') // Nome da tabela que esperamos no DB (singular)
        .select('*')
        .order('term', { ascending: true });

      if (error) {
        throw error;
      }

      // Mapeia os termos do glossário para o formato de 'artigo'
      const mappedArticles: Article[] = (data || []).map(term => ({
        ...term,
        title: term.term, // 'term' do glossário vira 'title' do artigo
        excerpt: term.definition, // 'definition' do glossário vira 'excerpt' do artigo
        // Valores mock ou padrão para campos que não existem no schema do glossário
        readTime: Math.floor(Math.random() * 5) + 5, // 5-9 minutos
        difficulty: ['Iniciante', 'Intermediário', 'Avançado'][Math.floor(Math.random() * 3)],
        rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // 3.0 - 5.0
        views: Math.floor(Math.random() * (2000 - 500) + 500), // 500-2000 views
        image: 'https://placehold.co/600x400/EAEAEA/272525?text=Artigo', // Imagem placeholder
      }));

      console.log('✅ Termos do glossário carregados:', mappedArticles.length);
      setArticles(mappedArticles);
    } catch (err: any) {
      console.error('❌ Erro ao carregar termos do glossário:', err.message);
      setError('Falha ao carregar conteúdo educacional.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlossaryTerms();
  }, []); // Carrega os termos uma vez ao montar o componente

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const filterArticles = () => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-600 bg-green-100';
      case 'Intermediário': return 'text-yellow-600 bg-yellow-100';
      case 'Avançado': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap = {
      nutrition: 'Nutrição',
      diabetes: 'Diabetes',
      recipes: 'Técnicas Culinárias',
      lifestyle: 'Estilo de Vida',
      supplements: 'Suplementos',
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando conteúdo educacional...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-xl font-heading font-bold text-dark-800 mb-4">Erro</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchGlossaryTerms}>Tentar Novamente</Button>
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
            Educação Nutricional
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Aprenda sobre nutrição, diabetes e alimentação saudável com conteúdo 
            científico e prático desenvolvido por especialistas.
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
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Artigos</h3>
            <p className="text-2xl font-bold text-primary-600">{articles.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Leitores</h3>
            <p className="text-2xl font-bold text-blue-600">5.2k</p> {/* Mock data */}
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Avaliação</h3>
            <p className="text-2xl font-bold text-green-600">4.7</p> {/* Mock data */}
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Crescimento</h3>
            <p className="text-2xl font-bold text-yellow-600">+23%</p> {/* Mock data */}
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
                label="Buscar conteúdo"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                placeholder="Título, conteúdo ou tags..."
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
        {filteredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-neutral-600">
                {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center space-x-2 text-sm text-neutral-500">
                <Filter size={16} />
                <span>Filtros ativos</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card hover className="h-full">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {getCategoryText(article.category)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                      {article.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-dark-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{article.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button fullWidth variant="outline" size="sm">
                    Ler Artigo
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
                Nenhum artigo encontrado
              </h3>
              <p className="text-neutral-600 mb-6">
                Tente ajustar os filtros para encontrar mais conteúdo.
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

export default EducationPage;
