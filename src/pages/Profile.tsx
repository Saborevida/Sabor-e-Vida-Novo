import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Heart, Settings, Shield, Bell, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProfilePage: React.FC = () => {
  const { userProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'health', label: 'Saúde', icon: Heart },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
  ];

  const healthGoals = [
    'Controle glicêmico',
    'Perda de peso',
    'Ganho de massa muscular',
    'Melhora da energia',
    'Redução do colesterol',
    'Controle da pressão arterial'
  ];

  const dietaryPreferences = [
    'Vegetariano',
    'Vegano',
    'Sem glúten',
    'Sem lactose',
    'Low carb',
    'Mediterrânea',
    'DASH',
    'Cetogênica'
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-800">Informações Pessoais</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome completo"
          type="text"
          value={userProfile?.name || ''}
          disabled={!isEditing}
          placeholder="Seu nome completo"
        />

        <Input
          label="Email"
          type="email"
          value={user?.email || ''}
          disabled={true}
          icon={Mail}
        />

        <Input
          label="Data de nascimento"
          type="date"
          value={userProfile?.dateOfBirth ? userProfile.dateOfBirth.toISOString().split('T')[0] : ''}
          disabled={!isEditing}
          icon={Calendar}
        />

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">
            Tipo de diabetes
          </label>
          <select
            disabled={!isEditing}
            className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50"
            value={userProfile?.diabetesType || 'type2'}
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
          <Button variant="primary">
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );

  const renderHealthTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-800">Objetivos de Saúde</h3>
      
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Selecione seus objetivos principais:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthGoals.map((goal) => (
            <label key={goal} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                defaultChecked={userProfile?.healthGoals?.includes(goal)}
              />
              <span className="ml-2 text-sm text-dark-700">{goal}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-dark-800 mb-3">Métricas de Saúde</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Peso atual (kg)"
            type="number"
            placeholder="70"
          />
          <Input
            label="Altura (cm)"
            type="number"
            placeholder="170"
          />
          <Input
            label="Meta de peso (kg)"
            type="number"
            placeholder="65"
          />
        </div>
      </div>

      <Button variant="primary">
        Salvar Objetivos
      </Button>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-800">Preferências Alimentares</h3>
      
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Selecione suas preferências dietéticas:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dietaryPreferences.map((preference) => (
            <label key={preference} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                defaultChecked={userProfile?.dietaryPreferences?.includes(preference)}
              />
              <span className="ml-2 text-sm text-dark-700">{preference}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-dark-800 mb-3">Configurações de Receitas</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-dark-700">Mostrar apenas receitas de baixo IG</p>
              <p className="text-sm text-neutral-600">Exibir apenas receitas com índice glicêmico baixo</p>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              defaultChecked={true}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-dark-700">Sugestões personalizadas</p>
              <p className="text-sm text-neutral-600">Receber recomendações baseadas no seu perfil</p>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              defaultChecked={true}
            />
          </div>
        </div>
      </div>

      <Button variant="primary">
        Salvar Preferências
      </Button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-800">Configurações de Notificação</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Lembretes de refeição</p>
            <p className="text-sm text-neutral-600">Receber lembretes nos horários das refeições</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={true}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Novas receitas</p>
            <p className="text-sm text-neutral-600">Ser notificado quando novas receitas forem adicionadas</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={true}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Dicas educativas</p>
            <p className="text-sm text-neutral-600">Receber conteúdo educativo sobre diabetes e nutrição</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={true}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Relatórios semanais</p>
            <p className="text-sm text-neutral-600">Receber resumo semanal das suas atividades</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={false}
          />
        </div>
      </div>

      <Button variant="primary">
        Salvar Configurações
      </Button>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-dark-800">Privacidade e Segurança</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Perfil público</p>
            <p className="text-sm text-neutral-600">Permitir que outros usuários vejam seu perfil</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={false}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Compartilhar progresso</p>
            <p className="text-sm text-neutral-600">Permitir compartilhamento do seu progresso</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={false}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-700">Análise de dados</p>
            <p className="text-sm text-neutral-600">Permitir análise anônima dos dados para melhorias</p>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            defaultChecked={true}
          />
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h4 className="font-medium text-dark-800 mb-4">Ações da Conta</h4>
        <div className="space-y-3">
          <Button variant="outline" fullWidth>
            Alterar Senha
          </Button>
          <Button variant="outline" fullWidth>
            Exportar Dados
          </Button>
          <Button variant="danger" fullWidth>
            Excluir Conta
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'health': return renderHealthTab();
      case 'preferences': return renderPreferencesTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      default: return renderProfileTab();
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
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
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

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card>
              {renderTabContent()}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;