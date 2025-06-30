import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Heart } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(priceId);
    try {
      await createCheckoutSession(priceId, 'subscription');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const freeFeatures = [
    '50 receitas básicas',
    'Planos de 3 dias',
    'Conteúdo educativo limitado',
    'Suporte por email',
    'Informações nutricionais básicas'
  ];

  const premiumFeatures = [
    'Acesso completo a todas as receitas',
    'Planos de refeição ilimitados',
    'Conteúdo educativo completo',
    'Listas de compra automáticas',
    'Suporte prioritário',
    'Novas receitas semanais',
    'Calculadora de índice glicêmico',
    'Relatórios nutricionais detalhados',
    'Planejamento personalizado por IA',
    'Acesso antecipado a novos recursos'
  ];

  const filteredProducts = stripeProducts.filter(product => 
    product.interval === billingCycle
  );

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark-800 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Transforme sua alimentação com receitas especializadas para diabéticos. 
            Comece gratuitamente e faça upgrade quando quiser acesso completo.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
              <button
                onClick={() => setBillingCycle('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  billingCycle === 'month'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:text-primary-600'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('year')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  billingCycle === 'year'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:text-primary-600'
                }`}
              >
                Anual
                <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Economize 33%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full relative">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-dark-800 mb-2">
                  Gratuito
                </h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-dark-800">R$ 0</span>
                  <span className="text-neutral-500 ml-1">/mês</span>
                </div>
                <p className="text-neutral-600">
                  Perfeito para começar sua jornada
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant="outline"
                onClick={() => window.location.href = user ? '/dashboard' : '/register'}
              >
                {user ? 'Plano Atual' : 'Começar Grátis'}
              </Button>
            </Card>
          </motion.div>

          {/* Premium Plans */}
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative"
            >
              {product.interval === 'year' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary-500 to-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full relative ${product.interval === 'year' ? 'ring-2 ring-primary-500 shadow-xl' : ''}`}>
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                    product.interval === 'year' 
                      ? 'bg-gradient-to-r from-primary-500 to-green-500' 
                      : 'bg-primary-100'
                  }`}>
                    {product.interval === 'year' ? (
                      <Crown className="w-6 h-6 text-white" />
                    ) : (
                      <Zap className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-dark-800 mb-2">
                    Premium {product.interval === 'year' ? 'Anual' : 'Mensal'}
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-primary-600">
                      {product.price}
                    </span>
                    <span className="text-neutral-500 ml-1">
                      /{product.interval === 'year' ? 'ano' : 'mês'}
                    </span>
                  </div>
                  {product.interval === 'year' && (
                    <div className="text-sm text-green-600 font-medium mb-2">
                      Equivale a R$ 13,25/mês
                    </div>
                  )}
                  <p className="text-neutral-600">
                    {product.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {premiumFeatures.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant="primary"
                  loading={loading === product.priceId}
                  onClick={() => handleSubscribe(product.priceId)}
                  className={product.interval === 'year' ? 'bg-gradient-to-r from-primary-500 to-green-500 hover:from-primary-600 hover:to-green-600' : ''}
                >
                  {loading === product.priceId ? 'Processando...' : 'Assinar Agora'}
                </Button>

                {product.interval === 'year' && (
                  <p className="text-center text-sm text-neutral-500 mt-3">
                    💰 Economize R$ 79,80 por ano
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-heading font-bold text-dark-800 text-center mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <h3 className="font-semibold text-dark-800 mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-neutral-600">
                Sim! Você pode cancelar sua assinatura a qualquer momento. 
                Não há taxas de cancelamento e você manterá acesso até o final do período pago.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold text-dark-800 mb-2">
                As receitas são adequadas para todos os tipos de diabetes?
              </h3>
              <p className="text-neutral-600">
                Nossas receitas são desenvolvidas para diabéticos tipo 1, tipo 2, gestacional e pré-diabetes, 
                sempre com informações nutricionais detalhadas.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold text-dark-800 mb-2">
                Existe garantia de satisfação?
              </h3>
              <p className="text-neutral-600">
                Oferecemos 7 dias de garantia. Se não ficar satisfeito, 
                entre em contato e faremos o reembolso integral.
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold text-dark-800 mb-2">
                Como funciona o plano gratuito?
              </h3>
              <p className="text-neutral-600">
                O plano gratuito inclui acesso a receitas básicas e conteúdo educativo limitado. 
                Não há limite de tempo e você pode fazer upgrade quando quiser.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span>Cancele Quando Quiser</span>
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span>Suporte Especializado</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;