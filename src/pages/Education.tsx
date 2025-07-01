import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, Clock, Star, Users, TrendingUp } from 'lucide-react';
import { getEducationalContent, incrementArticleViews } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const EducationPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dataSource, setDataSource] = useState<'supabase' | 'example'>('supabase');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const categories = [
    { value: 'all', label: 'Todos os Tópicos' },
    { value: 'nutrition', label: 'Nutrição' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'recipes', label: 'Técnicas Culinárias' },
    { value: 'lifestyle', label: 'Estilo de Vida' },
    { value: 'supplements', label: 'Suplementos' },
  ];

  useEffect(() => {
    console.log('📚 Carregando página de educação com timeout');
    fetchEducationalContent();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchEducationalContent = async () => {
    // Timeout para carregamento
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout no carregamento de conteúdo educativo');
        setLoading(false);
        setDataSource('example');
      }
    }, 10000); // 10 segundos máximo

    try {
      console.log('📥 Buscando conteúdo educativo do Supabase...');
      const { data, error } = await getEducationalContent();
      
      clearTimeout(loadingTimeout);
      
      if (data && data.length > 0) {
        console.log('✅ Conteúdo educativo carregado:', data.length);
        
        // Verificar se são dados reais ou de exemplo
        const isExample = data.some(article => article.id?.length < 10);
        setDataSource(isExample ? 'example' : 'supabase');
        
        setArticles(data);
      } else {
        console.log('ℹ️ Nenhum conteúdo encontrado');
        setArticles([]);
        setDataSource('example');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar conteúdo educativo:', error);
      clearTimeout(loadingTimeout);
      setArticles([]);
      setDataSource('example');
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  };

  const handleArticleClick = async (article: any) => {
    // Incrementar visualizações se for do Supabase
    if (dataSource === 'supabase' && article.id) {
      await incrementArticleViews(article.id);
    }
    
    setSelectedArticle(article);
    setShowArticleModal(true);
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
          <p className="text-neutral-600">Carregando conteúdo educativo...</p>
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
            Educação Nutricional
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Aprenda sobre nutrição, diabetes e alimentação saudável com conteúdo 
            científico e prático desenvolvido por especialistas.
          </p>
          
          {/* Status de conexão */}
          <div className={`mt-4 p-3 border rounded-lg text-sm max-w-md mx-auto ${
            dataSource === 'supabase' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p>
              <strong>
                {dataSource === 'supabase' ? '✅ Conectado ao Supabase' : '📝 Conteúdo de Exemplo'}:
              </strong> {articles.length} artigos disponíveis
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
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Artigos</h3>
            <p className="text-2xl font-bold text-primary-600">{articles.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Visualizações</h3>
            <p className="text-2xl font-bold text-blue-600">
              {articles.reduce((total, article) => total + (article.views || 0), 0)}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Avaliação</h3>
            <p className="text-2xl font-bold text-green-600">
              {articles.length > 0 
                ? (articles.reduce((total, article) => total + (article.rating || 0), 0) / articles.length).toFixed(1)
                : '0.0'
              }
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Categorias</h3>
            <p className="text-2xl font-bold text-yellow-600">{categories.length - 1}</p>
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
              <span>
                {dataSource === 'supabase' ? 'Dados do Supabase' : 'Conteúdo de exemplo'}
              </span>
            </div>
          </div>
        </motion.div>

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
                <Card hover className="h-full cursor-pointer" onClick={() => handleArticleClick(article)}>
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
                    {article.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
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
                {articles.length === 0 ? 'Nenhum conteúdo disponível' : 'Nenhum artigo encontrado'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {articles.length === 0 
                  ? 'Execute a migração do banco de dados para adicionar conteúdo educativo.'
                  : 'Tente ajustar os filtros para encontrar mais conteúdo.'
                }
              </p>
              {articles.length > 0 && (
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

      {/* Article Modal */}
      <Modal
        isOpen={showArticleModal}
        onClose={() => setShowArticleModal(false)}
        title={selectedArticle?.title}
        size="xl"
      >
        {selectedArticle && (
          <div className="space-y-6">
            {/* Article Image */}
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-lg"
            />

            {/* Article Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{selectedArticle.readTime} min de leitura</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{selectedArticle.views} visualizações</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-500" />
                  <span>{selectedArticle.rating}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(selectedArticle.difficulty)}`}>
                {selectedArticle.difficulty}
              </span>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {selectedArticle.content ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: selectedArticle.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h3>').replace(/<h3>/g, '<h3 class="text-xl font-semibold text-dark-800 mt-6 mb-3">') 
                }} />
              ) : (
                <p>{selectedArticle.excerpt}</p>
              )}
            </div>

            {/* Tags */}
            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-dark-800 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="border-t pt-4">
              <p className="text-sm text-neutral-600">
                Por <span className="font-medium">{selectedArticle.author || 'Equipe Sabor & Vida'}</span>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EducationPage;