import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Star, Gift } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { getUserSubscription } from '../lib/stripe';
import { getProductByPriceId } from '../stripe-config';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subData = await getUserSubscription();
        setSubscription(subData);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      // Wait a moment for webhook to process
      setTimeout(fetchSubscription, 2000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const product = subscription?.price_id ? getProductByPriceId(subscription.price_id) : null;

  const benefits = [
    {
      icon: Star,
      title: 'Acesso Completo',
      description: 'Todas as receitas e planos de refeição disponíveis'
    },
    {
      icon: Gift,
      title: 'Recursos Exclusivos',
      description: 'Listas de compra automáticas e relatórios nutricionais'
    },
    {
      icon: CheckCircle,
      title: 'Suporte Prioritário',
      description: 'Atendimento especializado quando precisar'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Processando sua assinatura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark-800 mb-4">
            Bem-vindo ao Premium! 🎉
          </h1>
          
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Sua assinatura foi ativada com sucesso. Agora você tem acesso completo 
            a todas as funcionalidades do Sabor & Vida.
          </p>
        </motion.div>

        {/* Subscription Details */}
        {product && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="text-center bg-gradient-to-r from-primary-500 to-green-500 text-white">
              <h2 className="text-2xl font-heading font-bold mb-2">
                {product.name}
              </h2>
              <p className="text-primary-100 mb-4">
                {product.description}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {product.price}/{product.interval === 'year' ? 'ano' : 'mês'}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  Status: {subscription?.subscription_status === 'active' ? 'Ativo' : 'Processando'}
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-heading font-bold text-dark-800 text-center mb-8">
            O que você ganhou com o Premium
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-dark-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-heading font-bold text-dark-800 mb-6">
            Próximos Passos
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Ir para o Dashboard
              </Button>
            </Link>
            
            <Link to="/recipes">
              <Button variant="outline" size="lg">
                Explorar Receitas Premium
              </Button>
            </Link>
          </div>
          
          <p className="text-neutral-500 mt-6 text-sm">
            Você receberá um email de confirmação com todos os detalhes da sua assinatura.
          </p>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="text-center bg-neutral-100">
            <h3 className="font-semibold text-dark-800 mb-2">
              Precisa de Ajuda?
            </h3>
            <p className="text-neutral-600 mb-4">
              Nossa equipe está aqui para ajudar você a aproveitar ao máximo sua assinatura.
            </p>
            <Button variant="outline" size="sm">
              Entrar em Contato
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;