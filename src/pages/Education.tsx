import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getGlossaryItems } from '@/lib/supabase';
import { GlossaryItem } from '@/types'; // ✅ Usando GlossaryItem agora

const EducationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState<GlossaryItem[]>([]); // ✅ Atualizado aqui também
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'Todos os Tópicos' },
    { value: 'Informação sobre Diabetes', label: 'Informação sobre Diabetes' },
    { value: 'Ingrediente', label: 'Ingredientes' },
    { value: 'Nutriente', label: 'Nutrientes' },
    { value: 'Dicas Nutricionais', label: 'Dicas Nutricionais' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await getGlossaryItems();
      if (error) {
        console.error('Erro ao carregar glossário:', error);
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-800 mb-4">
            Glossário Educacional
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Termos importantes sobre diabetes, nutrição e saúde, explicados de forma simples.
          </p>
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
                label="Buscar termo"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                placeholder="Buscar por termo, definição ou tag..."
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
              {filteredArticles.length} termo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <Filter size={16} />
              <span>Filtros ativos</span>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id || article.term + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <h3 className="text-lg font-semibold text-dark-800 mb-2">
                    {article.term}
                  </h3>

                  <p className="text-neutral-600 text-sm mb-4">
                    {article.definition}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {article.category}
                  </span>
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
                Nenhum conteúdo encontrado
              </h3>
              <p className="text-neutral-600 mb-6">
                Tente ajustar os filtros para encontrar mais resultados.
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
