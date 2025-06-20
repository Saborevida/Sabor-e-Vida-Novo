import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Heart, Settings, Shield, Bell, Eye, EyeOff } from 'lucide-react'; // Adicionado EyeOff para consistência
import { useAuth } from '@/contexts/AuthContext'; // CORREÇÃO: Usa alias @/
import { Card } from '@/components/ui/card';     // CORREÇÃO: Usa named import e alias @/
import { Button } from '@/components/ui/button'; // CORREÇÃO: Usa named import e alias @/
import { Input } from '@/components/ui/input';   // CORREÇÃO: Usa named import e alias @/
import { supabase } from '@/lib/supabase'; // Importa Supabase para salvar perfil

const ProfilePage: React.FC = () => {
  const { userProfile, user, refetchUserProfile, loading: authLoading } = useAuth(); // Adicionado refetchUserProfile
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [localUserProfile, setLocalUserProfile] = useState(userProfile); // Estado local para edição
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Sincroniza o perfil do usuário do contexto para o estado local ao carregar ou atualizar
    setLocalUserProfile(userProfile);
  }, [userProfile]);

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

  const handleSaveProfile = async () => {
    if (!user || !localUserProfile) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: localUserProfile.name,
          date_of_birth: localUserProfile.date_of_birth, // CORREÇÃO: snake_case
          diabetes_type: localUserProfile.diabetes_type, // CORREÇÃO: snake_case
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      setSaveSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false); // Sair do modo de edição
      refetchUserProfile(); // Re-buscar o perfil para atualizar o contexto
    } catch (err: any) {
      console.error('❌ Erro ao salvar perfil:', err.message);
      setSaveError('Falha ao salvar alterações: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHealthGoals = async () => {
    if (!user || !localUserProfile) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          health_goals: localUserProfile.health_goals // CORREÇÃO: snake_case
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      setSaveSuccess('Objetivos de saúde atualizados!');
      refetchUserProfile();
    } catch (err: any) {
      console.error('❌ Erro ao salvar objetivos de saúde:', err.message);
      setSaveError('Falha ao salvar objetivos: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user || !localUserProfile) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          dietary_preferences: localUserProfile.dietary_preferences // CORREÇÃO: snake_case
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      setSaveSuccess('Preferências alimentares salvas!');
      refetchUserProfile();
    } catch (err: any) {
      console.error('❌ Erro ao salvar preferências:', err.message);
      setSaveError('Falha ao salvar preferências: ' + err.message);
    } finally {
      setSaving(false);
    }
  };


  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-800">Informações Pessoais</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsEditing(!isEditing);
            // Reset local state if canceling
            if (isEditing) setLocalUserProfile(userProfile);
          }}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome completo"
          type="text"
          value={localUserProfile?.name || ''}
          onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
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
          value={localUserProfile?.date_of_birth ? localUserProfile.date_of_birth.split('T')[0] : ''} // CORREÇÃO: snake_case e formato correto
          onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, date_of_birth: e.target.value } : null)}
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
            value={localUserProfile?.diabetes_type || 'type2'} // CORREÇÃO: snake_case
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, diabetes_type: e.target.value } : null)}
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
          <Button variant="primary" loading={saving} onClick={handleSaveProfile}>
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
            Cancelar
          </Button>
        </div>
      )}
      {saveError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{saveError}</div>}
      {saveSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveSuccess}</div>}
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
                checked={localUserProfile?.health_goals?.includes(goal) || false} // CORREÇÃO: snake_case e 'checked'
                onChange={(e) => {
                  const updatedGoals = e.target.checked
                    ? [...(localUserProfile?.health_goals || []), goal]
                    : (localUserProfile?.health_goals || []).filter(g => g !== goal);
                  setLocalUserProfile(prev => prev ? { ...prev, health_goals: updatedGoals } : null);
                }}
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
            value={localUserProfile?.current_weight || ''} // Exemplo: assuming new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, current_weight: parseFloat(e.target.value) } : null)}
          />
          <Input
            label="Altura (cm)"
            type="number"
            placeholder="170"
            value={localUserProfile?.height_cm || ''} // Exemplo: assuming new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, height_cm: parseFloat(e.target.value) } : null)}
          />
          <Input
            label="Meta de peso (kg)"
            type="number"
            placeholder="65"
            value={localUserProfile?.target_weight || ''} // Exemplo: assuming new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, target_weight: parseFloat(e.target.value) } : null)}
          />
        </div>
      </div>

      <Button variant="primary" loading={saving} onClick={handleSaveHealthGoals}>
        Salvar Objetivos
      </Button>
      {saveError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{saveError}</div>}
      {saveSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveSuccess}</div>}
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
                checked={localUserProfile?.dietary_preferences?.includes(preference) || false} // CORREÇÃO: snake_case e 'checked'
                onChange={(e) => {
                  const updatedPreferences = e.target.checked
                    ? [...(localUserProfile?.dietary_preferences || []), preference]
                    : (localUserProfile?.dietary_preferences || []).filter(p => p !== preference);
                  setLocalUserProfile(prev => prev ? { ...prev, dietary_preferences: updatedPreferences } : null);
                }}
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
              defaultChecked={localUserProfile?.show_low_ig_recipes || false} // Exemplo: new field
              onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, show_low_ig_recipes: e.target.checked } : null)}
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
              defaultChecked={localUserProfile?.personalized_suggestions || false} // Exemplo: new field
              onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, personalized_suggestions: e.target.checked } : null)}
            />
          </div>
        </div>
      </div>

      <Button variant="primary" loading={saving} onClick={handleSavePreferences}>
        Salvar Preferências
      </Button>
      {saveError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{saveError}</div>}
      {saveSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveSuccess}</div>}
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
            defaultChecked={localUserProfile?.reminders_on || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, reminders_on: e.target.checked } : null)}
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
            defaultChecked={localUserProfile?.new_recipes_notifications || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, new_recipes_notifications: e.target.checked } : null)}
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
            defaultChecked={localUserProfile?.educational_tips_notifications || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, educational_tips_notifications: e.target.checked } : null)}
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
            defaultChecked={localUserProfile?.weekly_reports || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, weekly_reports: e.target.checked } : null)}
          />
        </div>
      </div>

      <Button variant="primary" loading={saving} onClick={handleSavePreferences}> {/* Reutilizando handleSavePreferences, ajustar para new func if needed */}
        Salvar Configurações
      </Button>
      {saveError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{saveError}</div>}
      {saveSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveSuccess}</div>}
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
            defaultChecked={localUserProfile?.public_profile || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, public_profile: e.target.checked } : null)}
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
            defaultChecked={localUserProfile?.share_progress || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, share_progress: e.target.checked } : null)}
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
            defaultChecked={localUserProfile?.data_analysis_opt_in || false} // Exemplo: new field
            onChange={(e) => setLocalUserProfile(prev => prev ? { ...prev, data_analysis_opt_in: e.target.checked } : null)}
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
    if (authLoading) { // Mostra loading enquanto autenticação carrega
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600">Carregando perfil...</p>
            </div>
        );
    }
    if (!user) { // Redireciona ou mostra erro se não houver usuário logado
        // Isso normalmente seria tratado pelo ProtectedRoute no App.tsx
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-dark-800 mb-2">Acesso Negado</h3>
                <p className="text-neutral-600 mb-4">Faça login para ver esta página.</p>
                <Button onClick={() => window.location.href = '/login'}>Ir para Login</Button>
            </div>
        );
    }


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
