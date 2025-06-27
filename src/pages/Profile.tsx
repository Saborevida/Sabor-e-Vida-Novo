import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Heart,
  Settings,
  Shield,
  Bell,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { updateUserProfile } from '../lib/supabase';

const ProfilePage: React.FC = () => {
  const { userProfile, user, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    dateOfBirth: userProfile?.dateOfBirth?.toString().substring(0, 10) || '',
    diabetesType: userProfile?.diabetesType || 'type2',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userProfile) return;
    const { error } = await updateUserProfile(userProfile.id, {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
    });
    if (!error) {
      await refreshUserProfile();
      setIsEditing(false);
    } else {
      console.error('Erro ao atualizar perfil:', error.message);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'health', label: 'Saúde', icon: Heart },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-800">Informações Pessoais</h3>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome completo"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Seu nome completo"
        />

        <Input
          label="Email"
          type="email"
          value={user?.email || ''}
          disabled
          icon={Mail}
        />

        <Input
          label="Data de nascimento"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          disabled={!isEditing}
          icon={Calendar}
        />

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">
            Tipo de diabetes
          </label>
          <select
            name="diabetesType"
            value={formData.diabetesType}
            onChange={handleChange}
            disabled={!isEditing}
            className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50"
          >
            <option value="type1">Tipo 1</option>
            <option value="type2">Tipo 2</option>
            <option value="gestational">Gestacional</option>
            <option value="prediabetes">Pré-diabetes</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className="flex space-x-4">
          <Button variant="primary" onClick={handleSave}>
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );

  // Os outros tabs podem permanecer como estão por enquanto, ou podemos integrá-los com updateUserProfile quando necessário.

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      // outros tabs permanecem inalterados por ora
      default: return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-dark-800">
                {userProfile?.name || 'Usuário'}
              </h1>
              <p className="text-neutral-600">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <Card>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <tab.icon size={20} className="mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <Card>{renderTabContent()}</Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
