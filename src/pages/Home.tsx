import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ChefHat,
  Calendar,
  BookOpen,
  Star,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

import Header from '../components/layout/Header';
import { Button } from '@/components/ui/button'; // Usa named import e caminho em minúsculas

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

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alimentação saudável para quem vive com <span className="text-primary-600">Diabetes</span>
          </h1>
          <p className="text-lg mb-8">
            Receitas, planos alimentares e educação nutricional baseada em ciência.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg">Comece agora</Button>
            </Link>
            <Link to="/recipes">
              <Button variant="ghost" size="lg">Ver receitas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="flex justify-center">
                <item.icon className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para transformar sua saúde?</h2>
          <p className="mb-8 text-lg">Descubra como o Sabor & Vida pode ajudar no controle do diabetes com alimentação.</p>
          <Link to="/register">
            <Button variant="light" size="lg">Criar conta grátis</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
