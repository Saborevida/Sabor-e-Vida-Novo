import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Users, Target, ChefHat } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const MealPlansPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const mealPlans = [
    {
      id: '1',
      name: 'Plano Detox 7 Dias',
      description: 'Plano focado em desintoxicação e controle glicêmico',
      duration: '7 dias',
      meals: 21,
      calories: '1400-1600 kcal/dia',
      difficulty: 'Fácil',
      tags: ['Detox', 'Baixo IG', 'Anti-inflamatório'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Plano Mediterrâneo 14 Dias',
      description: 'Baseado na dieta mediterrânea, rica em ômega-3',
      duration: '14 dias',
      meals: 42,
      calories: '1600-1800 kcal/dia',
      difficulty: 'Médio',
      tags: ['Mediterrâneo', 'Ômega-3', 'Coração Saudável'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Plano Low Carb 21 Dias',
      description: 'Redução controlada de carboidratos para diabéticos',
      duration: '21 dias',
      meals: 63,
      calories: '1500-1700 kcal/dia',
      difficulty: 'Avançado',
      tags: ['Low Carb', 'Cetogênico', 'Perda de Peso'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

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
            <p className="text-2xl font-bold text-primary-600">3</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Receitas</h3>
            <p className="text-2xl font-bold text-blue-600">126</p>
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
            <Button icon={Plus} iconPosition="left">
              Criar Plano Personalizado
            </Button>
          </div>

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
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <h3 className="text-xl font-semibold text-dark-800 mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-neutral-600 mb-4">
                    {plan.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-dark-700">Duração:</span>
                      <p className="text-neutral-600">{plan.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-dark-700">Refeições:</span>
                      <p className="text-neutral-600">{plan.meals}</p>
                    </div>
                    <div>
                      <span className="font-medium text-dark-700">Calorias:</span>
                      <p className="text-neutral-600">{plan.calories}</p>
                    </div>
                    <div>
                      <span className="font-medium text-dark-700">Dificuldade:</span>
                      <p className="text-neutral-600">{plan.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    fullWidth
                    variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Plano Ativo' : 'Iniciar Plano'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Menu Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-heading font-bold text-dark-800 mb-6">
            Cardápio da Semana
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
    </div>
  );
};

export default MealPlansPage;
