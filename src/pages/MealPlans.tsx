import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Target, ChefHat } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getMealPlans } from '@/lib/supabase';
import { MealPlan } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const MealPlansPage: React.FC = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchMealPlans();
  }, [user]);

  const fetchMealPlans = async () => {
    const { data, error } = await getMealPlans(user!.id);
    if (data) setMealPlans(data);
    else console.error('Erro ao carregar planos de refeição:', error);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <h3 className="text-xl font-semibold text-dark-800 mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-neutral-600 mb-4">
                    Duração: {plan.startDate} a {plan.endDate}
                  </p>

                  <Button
                    fullWidth
                    variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Plano Ativo' : 'Ativar Plano'}
                  </Button>
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
