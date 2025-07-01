import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Users, Target, ChefHat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMealPlans, createMealPlan } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const MealPlansPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'supabase' | 'example'>('supabase');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    console.log('📅 Carregando página de planos com timeout');
    fetchMealPlans();
  }, [userProfile]);

  const fetchMealPlans = async () => {
    if (!userProfile) {
      console.log('👤 Aguardando perfil do usuário...');
      return;
    }

    // Timeout para carregamento
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout no carregamento de planos');
        setLoading(false);
        setDataSource('example');
      }
    }, 10000); // 10 segundos máximo

    try {
      console.log('📥 Buscando planos de refeição...');
      const { data, error } = await getMealPlans(userProfile.id);
      
      clearTimeout(loadingTimeout);
      
      if (data && data.length > 0) {
        console.log('✅ Planos carregados:', data.length);
        
        // Verificar se são dados reais ou de exemplo
        const isExample = data.some(plan => plan.id?.startsWith('plan-'));
        setDataSource(isExample ? 'example' : 'supabase');
        
        setMealPlans(data);
      } else {
        console.log('ℹ️ Nenhum plano encontrado');
        setMealPlans([]);
        setDataSource('example');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar planos:', error);
      clearTimeout(loadingTimeout);
      setMealPlans([]);
      setDataSource('example');
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setCreating(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const planData = {
      name: formData.get('name') as string,
      start_date: formData.get('startDate') as string,
      end_date: formData.get('endDate') as string,
      meals: {
        description: formData.get('description') as string,
        duration: calculateDuration(formData.get('startDate') as string, formData.get('endDate') as string),
        totalMeals: calculateTotalMeals(formData.get('startDate') as string, formData.get('endDate') as string),
        calories: '1500-1700 kcal/dia',
        difficulty: formData.get('difficulty') as string,
        tags: ['Personalizado', 'Novo']
      }
    };

    try {
      console.log('📅 Criando novo plano...');
      const { data, error } = await createMealPlan(userProfile.id, planData);
      
      if (data && !error) {
        console.log('✅ Plano criado com sucesso');
        setShowCreateModal(false);
        fetchMealPlans(); // Recarregar lista
      } else {
        console.error('❌ Erro ao criar plano:', error);
        alert('Erro ao criar plano. Tente novamente.');
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar plano:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias`;
  };

  const calculateTotalMeals = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 3; // 3 refeições por dia
  };

  const handleViewPlan = (plan: any) => {
    setSelectedPlanDetails(plan);
    setShowPlanModal(true);
  };

  const weeklyMenu = {
    'Segunda-feira': {
      breakfast: 'Omelete de Claras com Espinafre',
      lunch: 'Salada de Quinoa com Salmão',
      dinner: 'Frango Grelhado com Brócolis',
      snack: 'Iogurte com Nozes'
    },
    'Terça-feira': {
      breakfast: 'Smoothie Verde Detox',
      lunch: 'Wrap de Frango com Vegetais',
      dinner: 'Peixe Assado com Legumes',
      snack: 'Mix de Castanhas'
    },
    'Quarta-feira': {
      breakfast: 'Aveia com Frutas Vermelhas',
      lunch: 'Salada de Grão-de-Bico',
      dinner: 'Carne Magra com Abobrinha',
      snack: 'Queijo Cottage com Pepino'
    },
    'Quinta-feira': {
      breakfast: 'Tapioca com Queijo Branco',
      lunch: 'Sopa de Lentilha',
      dinner: 'Salmão com Aspargos',
      snack: 'Abacate com Cacau'
    },
    'Sexta-feira': {
      breakfast: 'Panqueca de Banana',
      lunch: 'Salada Caesar com Frango',
      dinner: 'Tofu Grelhado com Vegetais',
      snack: 'Chá Verde com Amêndoas'
    },
    'Sábado': {
      breakfast: 'Ovos Mexidos com Tomate',
      lunch: 'Risotto de Quinoa',
      dinner: 'Peixe ao Papillote',
      snack: 'Frutas com Iogurte'
    },
    'Domingo': {
      breakfast: 'Mingau de Aveia',
      lunch: 'Salada Completa',
      dinner: 'Frango ao Curry',
      snack: 'Chocolate 70% Cacau'
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando planos de refeição...</p>
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
            Planos de Refeição
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Planos alimentares personalizados para diabéticos, com receitas balanceadas 
            e controle glicêmico otimizado.
          </p>
          
          {/* Status de conexão */}
          <div className={`mt-4 p-3 border rounded-lg text-sm max-w-md mx-auto ${
            dataSource === 'supabase' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p>
              <strong>
                {dataSource === 'supabase' ? '✅ Conectado ao Supabase' : '📝 Planos de Exemplo'}:
              </strong> {mealPlans.length} planos disponíveis
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
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
            <h3 className="font-semibold text-dark-800">Receitas</h3>
            <p className="text-2xl font-bold text-blue-600">
              {mealPlans.reduce((total, plan) => total + (plan.meals?.totalMeals || 0), 0)}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Meta Diária</h3>
            <p className="text-2xl font-bold text-green-600">1600</p>
            <p className="text-sm text-neutral-600">kcal</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Tempo Médio</h3>
            <p className="text-2xl font-bold text-yellow-600">25</p>
            <p className="text-sm text-neutral-600">min</p>
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
              Planos Disponíveis
            </h2>
            <Button 
              icon={Plus} 
              iconPosition="left"
              onClick={() => setShowCreateModal(true)}
            >
              Criar Plano Personalizado
            </Button>
          </div>

          {mealPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mealPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card hover className="h-full">
                    <img
                      src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt={plan.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    
                    <h3 className="text-xl font-semibold text-dark-800 mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-neutral-600 mb-4">
                      {plan.meals?.description || 'Plano personalizado de refeições'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-dark-700">Duração:</span>
                        <p className="text-neutral-600">{plan.meals?.duration || '7 dias'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-dark-700">Refeições:</span>
                        <p className="text-neutral-600">{plan.meals?.totalMeals || 21}</p>
                      </div>
                      <div>
                        <span className="font-medium text-dark-700">Calorias:</span>
                        <p className="text-neutral-600">{plan.meals?.calories || '1500 kcal/dia'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-dark-700">Dificuldade:</span>
                        <p className="text-neutral-600">{plan.meals?.difficulty || 'Médio'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(plan.meals?.tags || ['Saudável', 'Diabético']).map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button
                        fullWidth
                        variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'Plano Ativo' : 'Iniciar Plano'}
                      </Button>
                      <Button
                        fullWidth
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPlan(plan)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-800 mb-2">
                Nenhum plano encontrado
              </h3>
              <p className="text-neutral-600 mb-6">
                {dataSource === 'supabase' 
                  ? 'Crie seu primeiro plano de refeições personalizado.'
                  : 'Conecte ao Supabase para ver seus planos salvos.'
                }
              </p>
              <Button
                variant="primary"
                icon={Plus}
                iconPosition="left"
                onClick={() => setShowCreateModal(true)}
              >
                Criar Primeiro Plano
              </Button>
            </Card>
          )}
        </motion.div>

        {/* Weekly Menu Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-heading font-bold text-dark-800 mb-6">
            Cardápio da Semana (Exemplo)
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {Object.entries(weeklyMenu).map(([day, meals], index) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <h3 className="font-semibold text-dark-800 mb-4 text-center">
                    {day}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-primary-600 mb-1">
                        Café da Manhã
                      </h4>
                      <p className="text-sm text-neutral-700">{meals.breakfast}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-blue-600 mb-1">
                        Almoço
                      </h4>
                      <p className="text-sm text-neutral-700">{meals.lunch}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-1">
                        Jantar
                      </h4>
                      <p className="text-sm text-neutral-700">{meals.dinner}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-yellow-600 mb-1">
                        Lanche
                      </h4>
                      <p className="text-sm text-neutral-700">{meals.snack}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create Plan Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Novo Plano de Refeição"
        size="lg"
      >
        <form onSubmit={handleCreatePlan} className="space-y-6">
          <Input
            label="Nome do Plano"
            name="name"
            type="text"
            placeholder="Ex: Plano Detox 7 Dias"
            required
          />

          <Input
            label="Descrição"
            name="description"
            type="text"
            placeholder="Descreva o objetivo do plano"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data de Início"
              name="startDate"
              type="date"
              required
            />

            <Input
              label="Data de Fim"
              name="endDate"
              type="date"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Dificuldade
            </label>
            <select
              name="difficulty"
              className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={creating}
            >
              {creating ? 'Criando...' : 'Criar Plano'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Plan Details Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title={selectedPlanDetails?.name}
        size="lg"
      >
        {selectedPlanDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">Informações Gerais</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Duração:</strong> {selectedPlanDetails.meals?.duration}</p>
                  <p><strong>Total de Refeições:</strong> {selectedPlanDetails.meals?.totalMeals}</p>
                  <p><strong>Calorias:</strong> {selectedPlanDetails.meals?.calories}</p>
                  <p><strong>Dificuldade:</strong> {selectedPlanDetails.meals?.difficulty}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">Período</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Início:</strong> {new Date(selectedPlanDetails.start_date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Fim:</strong> {new Date(selectedPlanDetails.end_date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-dark-800 mb-2">Descrição</h4>
              <p className="text-neutral-600">{selectedPlanDetails.meals?.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-dark-800 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {(selectedPlanDetails.meals?.tags || []).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Button
              fullWidth
              variant="primary"
              onClick={() => {
                setSelectedPlan(selectedPlanDetails.id);
                setShowPlanModal(false);
              }}
            >
              Ativar Este Plano
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MealPlansPage;