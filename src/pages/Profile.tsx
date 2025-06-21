// ... imports mantidos
import { useSupabaseClient } from '@supabase/auth-helpers-react'; // adicionado
import toast from 'react-hot-toast'; // caso use algum sistema de toast

const ProfilePage: React.FC = () => {
  const supabase = useSupabaseClient(); // supabase client
  const { userProfile, user } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Estados locais dos campos editáveis
  const [name, setName] = useState(userProfile?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    userProfile?.dateOfBirth
      ? userProfile.dateOfBirth.toISOString().split('T')[0]
      : ''
  );
  const [diabetesType, setDiabetesType] = useState(userProfile?.diabetesType || 'type2');

  // Salvar alterações
  const handleSaveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({
        name,
        dateOfBirth,
        diabetesType,
      })
      .eq('id', user.id);

    if (error) {
      console.error(error);
      toast.error('Erro ao salvar perfil.');
    } else {
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      // opcional: forçar atualização do contexto
      // await reloadUserProfile();
    }
  };

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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={!isEditing}
          icon={Calendar}
        />

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">
            Tipo de diabetes
          </label>
          <select
            disabled={!isEditing}
            value={diabetesType}
            onChange={(e) => setDiabetesType(e.target.value)}
            className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-50"
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
          <Button variant="primary" onClick={handleSaveProfile}>
            Salvar Alterações
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );

  // ... restante do código permanece igual (demais tabs, layout, etc.)
};

export default ProfilePage;
