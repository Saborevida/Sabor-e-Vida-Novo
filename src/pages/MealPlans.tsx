import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Users, Target, ChefHat } from 'lucide-react';
import { Card } from '@/components/ui/card'; // CORREÇÃO: Usa named import e alias @/
import { Button } from '@/components/ui/button'; // CORREÇÃO: Usa named import e alias @/
import { supabase } from '@/lib/supabase'; // Importa a instância do Supabase
import { useAuth } from '@/contexts/AuthContext'; // Importa o contexto de autenticação

// Tipagem para um plano de refeição do Supabase
interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  start_date: string; // Formato de data do DB
  end_date: string;   // Formato de data do DB
  meals: {            // JSONB no DB
    [day: string]: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
      snack?: string;
    };
  };
  created_at: string;
  updated_at: string;
}

const MealPlansPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // Obtém o usuário autenticado e estado de carregamento
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null); // Para o plano ativo

  // Função para buscar planos de refeição do Supabase
  const fetchMealPlans = async () => {
    if (!user) {
      setLoading(false);
      setError('Faça login para ver seus planos de refeição.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('🗓️ Carregando planos de refeição para o usuário:', user.id);
      const { data, error } = await supabase
        .from('meal_plans') // Nome da tabela no DB
        .select('*')
        .eq('user_id', user.id) // Filtra pelos planos do usuário logado
        .order('created_at', { ascending: false }); // Ordena pelos mais recentes

      if (error) {
        throw error;
      }

      setMealPlans(data || []);
      // Se houver planos e nenhum selecionado, selecione o primeiro como ativo
      if (data && data.length > 0 && !selectedPlanId) {
        setSelectedPlanId(data[0].id);
      }
      console.log('✅ Planos de Refeição carregados:', data.length);
    } catch (err: any) {
      console.error('❌ Erro ao carregar planos de refeição:', err.message);
      setError('Falha ao carregar planos de refeição.');
      setMealPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) { // Só tenta buscar se a autenticação já carregou
      fetchMealPlans();
    }
  }, [user, authLoading]); // Re-executa quando o usuário ou o estado de autenticação muda

  // Estado de carregamento geral da página
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando planos de refeição...</p>
        </div>
      </div>
    );
  }

  // Tratamento de erro
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-xl font-heading font-bold text-dark-800 mb-4">Erro</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchMealPlans}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  // Componente principal da página
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
            Meus Planos de Refeição
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Organize suas refeições com planos alimentares personalizados e controle glicêmico otimizado.
          </p>
        </motion.div>

        {/* Quick Stats (Dados mock para demo, substituir por dados reais) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Planos Ativos</h3>
            <p className="text-2xl font-bold text-primary-600">{mealPlans.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Refeições Registradas</h3>
            {/* Somatória das refeições nos planos (exemplo simplificado) */}
            <p className="text-2xl font-bold text-blue-600">
              {mealPlans.reduce((acc, plan) => acc + Object.keys(plan.meals || {}).length * 4, 0)} {/* Assumindo 4 refeições/dia */}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Meta Diária</h3>
            <p className="text-2xl font-bold text-green-600">~1600</p>
            <p className="text-sm text-neutral-600">kcal</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Próxima Refeição</h3>
            {/* Lógica para determinar a próxima refeição */}
            <p className="text-lg font-bold text-yellow-600">N/A</p>
            <p className="text-sm text-neutral-600">N/A</p>
          </Card>
        </motion.div>

        {/* Meal Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-dark-800">
              Meus Planos Ativos
            </h2>
            <Button icon={Plus} iconPosition="left">
              Criar Novo Plano
            </Button>
          </div>

          {mealPlans.length === 0 ? (
            <Card className="text-center p-8">
              <p className="text-neutral-600 mb-4">Você ainda não tem planos de refeição. Crie um agora!</p>
              <Button icon={Plus} iconPosition="left">
                Criar Primeiro Plano
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mealPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card hover className="h-full cursor-pointer" onClick={() => setSelectedPlanId(plan.id)}>
                    <h3 className="text-xl font-semibold text-dark-800 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {plan.start_date} a {plan.end_date}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(plan.meals).length > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {Object.keys(plan.meals).length} dias
                        </span>
                      )}
                      {/* Opcional: mostrar tipos de refeição dentro do plano */}
                    </div>

                    <Button
                      fullWidth
                      variant={selectedPlanId === plan.id ? 'primary' : 'outline'}
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      {selectedPlanId === plan.id ? 'Plano Ativo' : 'Ver Detalhes'}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Selected Plan Details or Weekly Menu Preview */}
        {selectedPlanId && mealPlans.find(p => p.id === selectedPlanId) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-heading font-bold text-dark-800 mb-6">
              Cardápio do Plano Ativo ({mealPlans.find(p => p.id === selectedPlanId)?.name})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {Object.entries(mealPlans.find(p => p.id === selectedPlanId)?.meals || {}).map(([day, meals], index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="h-full">
                    <h3 className="font-semibold text-dark-800 mb-4 text-center">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </h3>
                    
                    <div className="space-y-3">
                      {Object.entries(meals).map(([mealType, mealName]) => (
                        <div key={mealType}>
                          <h4 className="text-sm font-medium text-primary-600 mb-1">
                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                          </h4>
                          <p className="text-sm text-neutral-700">{mealName}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MealPlansPage;
