import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ChefHat, 
  Calendar,
  BookOpen,
  Star,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

import Header from '@/components/layout/header'; // CORREÇÃO: Usa alias @/ e caminho em minúsculas
import { Button } from '@/components/ui/button'; // CORREÇÃO: Usa named import e alias @/ para caminho em minúsculas
import { Card } from '@/components/ui/card';     // CORREÇÃO: Usa named import e alias @/ para caminho em minúsculas

const Home: React.FC = () => {
  const features = [
    {
      icon: ChefHat,
      title: 'Receitas Especializadas',
      description: 'Centenas de receitas deliciosas desenvolvidas especificamente para diabéticos',
    },
    {
      icon: Calendar,
      title: 'Planejamento Inteligente',
      description: 'Planos de refeição personalizados com base no seu perfil e objetivos',
    },
    {
      icon: BookOpen,
      title: 'Educação Nutricional',
      description: 'Aprenda sobre nutrição diabética com conteúdo científico e prático',
    },
    {
      icon: Heart,
      title: 'Controle Glicêmico',
      description: 'Todas as receitas com informações detalhadas sobre índice glicêmico',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      type: 'Diabetes Tipo 2',
      content: 'Finalmente encontrei receitas que são deliciosas e me ajudam a controlar minha glicemia!',
      rating: 5,
    },
    {
      name: 'João Santos',
      type: 'Pré-diabético',
      content: 'O planejamento de refeições mudou completamente minha relação com a alimentação.',
      rating: 5,
    },
    {
      name: 'Dr. Ana Costa',
      type: 'Endocrinologista',
      content: 'Recomendo para todos os meus pacientes. Ferramenta essencial para o tratamento.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      features: [
        '50 receitas básicas',
        'Planos de 3 dias',
        'Conteúdo educativo limitado',
        'Suporte por email',
      ],
      cta: 'Começar Grátis',
      variant: 'outline' as const,
    },
    {
      name: 'Premium',
      price: 'R$ 29,90',
      period: '/mês',
      features: [
        'Acesso completo a todas as receitas',
        'Planos de refeição ilimitados',
        'Conteúdo educativo completo',
        'Listas de compra automáticas',
        'Suporte prioritário',
        'Novas receitas semanais',
      ],
      cta: 'Assinar Premium',
      variant: 'primary' as const,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%230AFF0F%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-2zM4%2034v-4H2v4H0v2h2v4h2v-4h4v-2H4z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span className="text-primary-700 font-medium">Nova Plataforma</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-dark-800 mb-6">
                Culinária Saudável
                <br />
                <span className="text-primary-600">para Diabéticos</span>
              </h1>
              
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
                Transforme sua alimentação com receitas deliciosas, planejamento nutricional 
                inteligente e educação especializada. Mantenha o controle glicêmico sem abrir 
                mão do prazer gastronômico.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/register">
                  <Button size="lg" icon={Heart} iconPosition="left">
                    Começar Gratuitamente
                  </Button>
                </Link>
                <Link to="/recipes">
                  <Button variant="outline" size="lg">
                    Ver Receitas
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-800 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Nossa plataforma combina ciência nutricional, tecnologia e praticidade 
              para transformar sua relação com a alimentação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-dark-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-800 mb-4">
              O que nossos usuários dizem
            </h2>
            <div className="flex items-center justify-center space-x-2 text-primary-600">
              <Users className="w-6 h-6" />
              <span className="text-lg font-medium">Mais de 10.000 pessoas confiam em nós</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-dark-800">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.type}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-800 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comece gratuitamente e faça upgrade quando quiser acesso completo 
              a todas as funcionalidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-heading font-bold text-dark-800 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                      <span className="text-neutral-500 ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register">
                    <Button fullWidth variant={plan.variant} size="lg">
                      {plan.cta}
                    </Button>
                  </Link>
                  
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <Shield className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Pronto para transformar sua alimentação?
            </h2>
            
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Junte-se a milhares de pessoas que já descobriram como comer bem 
              mantendo o controle da diabetes.
            </p>
            
            <Link to="/register">
              <Button 
                size="lg" 
                variant="secondary" 
                icon={ArrowRight} 
                iconPosition="right"
              >
                Começar Agora - É Grátis
              </Button>
            </Link>
            
            <p className="text-primary-200 text-sm mt-4">
              Não é necessário cartão de crédito • Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
