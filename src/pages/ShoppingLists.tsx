import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Check, X, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getShoppingLists, createShoppingList, supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const ShoppingListsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingList, setEditingList] = useState(false);
  const [deletingList, setDeletingList] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchShoppingLists();
    }
  }, [user]);

  const fetchShoppingLists = async () => {
    if (!user) return;

    try {
      console.log('🛒 Carregando listas de compras...');
      const { data, error } = await getShoppingLists(user.id);
      
      if (data && !error) {
        console.log('✅ Listas carregadas:', data.length);
        setShoppingLists(data);
      } else {
        console.log('ℹ️ Nenhuma lista encontrada');
        setShoppingLists([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar listas:', error);
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const listData = {
      name: formData.get('name') as string,
      items: [
        { name: 'Aveia em flocos', amount: 1, unit: 'pacote', category: 'Cereais', checked: false },
        { name: 'Frutas vermelhas', amount: 200, unit: 'g', category: 'Frutas', checked: false },
        { name: 'Iogurte natural', amount: 1, unit: 'pote', category: 'Laticínios', checked: false },
        { name: 'Ovos', amount: 12, unit: 'unidades', category: 'Proteínas', checked: false },
        { name: 'Azeite extra virgem', amount: 1, unit: 'garrafa', category: 'Óleos', checked: false }
      ],
      total_estimated_cost: 0,
      status: 'active'
    };

    try {
      console.log('🛒 Criando nova lista...');
      const { data, error } = await createShoppingList(user.id, listData);
      
      if (data && !error) {
        console.log('✅ Lista criada com sucesso');
        setShowCreateModal(false);
        fetchShoppingLists();
        
        // Mostrar a lista criada imediatamente
        setSelectedList(data);
        setShowListModal(true);
      } else {
        console.error('❌ Erro ao criar lista:', error);
        alert('Erro ao criar lista. Tente novamente.');
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar lista:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const handleViewList = (list: any) => {
    setSelectedList(list);
    setShowListModal(true);
  };

  const handleToggleItem = (itemIndex: number) => {
    if (!selectedList) return;

    console.log('🔄 Alternando item:', itemIndex);
    
    const updatedItems = [...selectedList.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      checked: !updatedItems[itemIndex].checked
    };

    const updatedList = {
      ...selectedList,
      items: updatedItems
    };

    // Atualizar o estado local imediatamente
    setSelectedList(updatedList);
    
    // Atualizar também na lista principal
    setShoppingLists(prev => prev.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));

    console.log('✅ Item atualizado:', updatedItems[itemIndex]);
  };

  const handleEditList = () => {
    setEditingList(true);
    console.log('✏️ Modo de edição ativado');
  };

  const handleSaveList = () => {
    setEditingList(false);
    console.log('💾 Lista salva');
    alert('Lista atualizada com sucesso!');
  };

  const handleCompleteList = () => {
    if (!selectedList) return;

    console.log('✅ Marcando lista como concluída');
    
    const updatedList = {
      ...selectedList,
      status: 'completed',
      items: selectedList.items.map((item: any) => ({ ...item, checked: true }))
    };

    setSelectedList(updatedList);
    
    // Atualizar na lista principal
    setShoppingLists(prev => prev.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));

    alert('Lista marcada como concluída!');
  };

  const handleAddItem = () => {
    if (!selectedList) return;

    const newItem = {
      name: 'Novo item',
      amount: 1,
      unit: 'unidade',
      category: 'Geral',
      checked: false
    };

    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, newItem]
    };

    setSelectedList(updatedList);
    setShoppingLists(prev => prev.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
  };

  const handleRemoveItem = (itemIndex: number) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.filter((_: any, index: number) => index !== itemIndex);
    const updatedList = {
      ...selectedList,
      items: updatedItems
    };

    setSelectedList(updatedList);
    setShoppingLists(prev => prev.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
  };

  const handleUpdateItem = (itemIndex: number, field: string, value: any) => {
    if (!selectedList) return;

    const updatedItems = [...selectedList.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [field]: value
    };

    const updatedList = {
      ...selectedList,
      items: updatedItems
    };

    setSelectedList(updatedList);
    setShoppingLists(prev => prev.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'active': return 'Ativa';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const calculateProgress = (items: any[]) => {
    if (!items || items.length === 0) return 0;
    const checkedItems = items.filter(item => item.checked).length;
    return Math.round((checkedItems / items.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando listas de compras...</p>
        </div>
      </div>
    );
  }

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
            <ShoppingCart className="w-8 h-8 text-primary-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-800">
              Minhas Listas de Compras
            </h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Organize suas compras de forma inteligente. Crie listas personalizadas 
            ou gere automaticamente a partir dos seus planos de refeição.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Total de Listas</h3>
            <p className="text-2xl font-bold text-primary-600">{shoppingLists.length}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Ativas</h3>
            <p className="text-2xl font-bold text-blue-600">
              {shoppingLists.filter(list => list.status === 'active').length}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Concluídas</h3>
            <p className="text-2xl font-bold text-green-600">
              {shoppingLists.filter(list => list.status === 'completed').length}
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-dark-800">Economia</h3>
            <p className="text-2xl font-bold text-yellow-600">R$ 0</p>
          </Card>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl font-heading font-bold text-dark-800">
            Suas Listas
          </h2>
          <Button 
            icon={Plus} 
            iconPosition="left"
            onClick={() => setShowCreateModal(true)}
          >
            Nova Lista
          </Button>
        </motion.div>

        {/* Shopping Lists Grid */}
        {shoppingLists.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {shoppingLists.map((list, index) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card hover className="h-full cursor-pointer" onClick={() => handleViewList(list)}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark-800 line-clamp-1">
                      {list.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(list.status)}`}>
                      {getStatusText(list.status)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                      <span>Progresso</span>
                      <span>{calculateProgress(list.items)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(list.items)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-dark-700">Itens:</span>
                      <p className="text-neutral-600">{list.items?.length || 0}</p>
                    </div>
                    <div>
                      <span className="font-medium text-dark-700">Criada em:</span>
                      <p className="text-neutral-600">
                        {new Date(list.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {list.meal_plan_id && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        📅 Gerada a partir de um plano de refeição
                      </p>
                    </div>
                  )}

                  <Button fullWidth variant="outline" size="sm">
                    Ver Lista
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center py-16">
              <ShoppingCart className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-dark-800 mb-4">
                Nenhuma lista de compras ainda
              </h3>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Crie sua primeira lista de compras ou gere uma automaticamente 
                a partir de um plano de refeição.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={Plus}
                  onClick={() => setShowCreateModal(true)}
                >
                  Criar Lista
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/meal-plans'}
                >
                  Ver Planos de Refeição
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Create List Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Nova Lista de Compras"
        size="md"
      >
        <form onSubmit={handleCreateList} className="space-y-6">
          <Input
            label="Nome da Lista"
            name="name"
            type="text"
            placeholder="Ex: Compras da Semana"
            required
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Dica</h4>
            <p className="text-sm text-blue-700">
              Você pode gerar listas automaticamente a partir dos seus planos de refeição 
              na página de Planos de Refeição.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={creating}
            >
              {creating ? 'Criando...' : 'Criar Lista'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View List Modal */}
      <Modal
        isOpen={showListModal}
        onClose={() => {
          setShowListModal(false);
          setEditingList(false);
        }}
        title={selectedList?.name}
        size="lg"
      >
        {selectedList && (
          <div className="space-y-6">
            {/* List Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{selectedList.items?.length || 0}</p>
                <p className="text-sm text-neutral-600">Itens</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{calculateProgress(selectedList.items)}%</p>
                <p className="text-sm text-neutral-600">Concluído</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedList.status)}`}>
                  {getStatusText(selectedList.status)}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-dark-800">Itens da Lista</h4>
                {editingList && (
                  <Button size="sm" variant="outline" onClick={handleAddItem}>
                    <Plus size={16} className="mr-1" />
                    Adicionar Item
                  </Button>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedList.items && selectedList.items.length > 0 ? (
                  selectedList.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={item.checked || false}
                          onChange={() => handleToggleItem(index)}
                          className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          {editingList ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-sm"
                              />
                              <div className="flex space-x-2">
                                <input
                                  type="number"
                                  value={item.amount}
                                  onChange={(e) => handleUpdateItem(index, 'amount', parseFloat(e.target.value))}
                                  className="w-20 px-2 py-1 border rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) => handleUpdateItem(index, 'unit', e.target.value)}
                                  className="w-20 px-2 py-1 border rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={item.category}
                                  onChange={(e) => handleUpdateItem(index, 'category', e.target.value)}
                                  className="flex-1 px-2 py-1 border rounded text-sm"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className={`font-medium transition-all duration-200 ${item.checked ? 'line-through text-neutral-500' : 'text-dark-800'}`}>
                                {item.name}
                              </p>
                              <p className="text-sm text-neutral-600">
                                {item.amount} {item.unit} • {item.category}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.checked && !editingList && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {editingList && (
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-center py-4">Nenhum item na lista</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              {editingList ? (
                <>
                  <Button variant="outline" fullWidth onClick={() => setEditingList(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" fullWidth onClick={handleSaveList}>
                    Salvar Alterações
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" fullWidth onClick={handleEditList}>
                    <Edit size={16} className="mr-2" />
                    Editar Lista
                  </Button>
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={handleCompleteList}
                    disabled={selectedList.status === 'completed'}
                  >
                    <Check size={16} className="mr-2" />
                    {selectedList.status === 'completed' ? 'Lista Concluída' : 'Marcar como Concluída'}
                  </Button>
                  <Button 
                    variant="danger" 
                    fullWidth
                    onClick={() => handleDeleteList(selectedList.id)}
                    disabled={deletingList === selectedList.id}
                  >
                    <Trash2 size={16} className="mr-2" />
                    {deletingList === selectedList.id ? 'Excluindo...' : 'Excluir Lista'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShoppingListsPage;