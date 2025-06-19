// src/pages/Dashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, BookOpen, Heart, CalendarCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Sabor e Vida</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-gray-700">
            <LayoutDashboard size={20} /> Dashboard
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <BookOpen size={20} /> Receitas
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <CalendarCheck size={20} /> Planos
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <Heart size={20} /> Favoritos
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Olá, {userProfile?.name || 'Usuário'} 👋
          </h1>
          <p className="text-gray-600">Bem-vindo ao seu painel.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white shadow p-4">
              <CardContent className="flex items-center gap-4">
                <BookOpen className="text-green-500" size={32} />
                <div>
                  <h2 className="text-lg font-semibold">Receitas</h2>
                  <p className="text-sm text-gray-500">Explore novas receitas.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white shadow p-4">
              <CardContent className="flex items-center gap-4">
                <CalendarCheck className="text-blue-500" size={32} />
                <div>
                  <h2 className="text-lg font-semibold">Planos</h2>
                  <p className="text-sm text-gray-500">Monte seu plano alimentar.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white shadow p-4">
              <CardContent className="flex items-center gap-4">
                <Heart className="text-pink-500" size={32} />
                <div>
                  <h2 className="text-lg font-semibold">Favoritos</h2>
                  <p className="text-sm text-gray-500">Suas receitas favoritas.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
