import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Plus, Search, Filter, Calendar, User, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

const MassIntentions: React.FC = () => {
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewIntentionModal, setShowNewIntentionModal] = useState(false);
  const [newIntention, setNewIntention] = useState({
    intention_for: '',
    intention_type: 'living',
    description: '',
    amount: 25000,
    mass_date: ''
  });

  // Mock data - replace with real data from Supabase
  const intentions = [
    {
      id: '1',
      requestor_name: 'María González',
      intention_for: 'Juan González (fallecido)',
      intention_type: 'deceased',
      description: 'Por el eterno descanso de mi esposo',
      mass_date: '2024-01-15T10:00:00',
      amount: 25000,
      payment_status: 'paid',
      payment_method: 'cash',
      status: 'confirmed',
      created_at: '2024-01-10T14:30:00'
    },
    {
      id: '2',
      requestor_name: 'Carlos Pérez',
      intention_for: 'Ana Pérez',
      intention_type: 'living',
      description: 'Por la salud de mi madre',
      mass_date: '2024-01-16T08:00:00',
      amount: 20000,
      payment_status: 'pending',
      payment_method: null,
      status: 'pending',
      created_at: '2024-01-12T09:15:00'
    },
    {
      id: '3',
      requestor_name: 'Familia López',
      intention_for: 'Todos los difuntos de la familia',
      intention_type: 'deceased',
      description: 'En memoria de nuestros seres queridos',
      mass_date: '2024-01-17T18:00:00',
      amount: 30000,
      payment_status: 'paid',
      payment_method: 'card',
      status: 'confirmed',
      created_at: '2024-01-11T16:45:00'
    }
  ];

  // Database operations
  const saveIntentionToDatabase = async (intentionData: any) => {
    try {
      const newIntention = {
        id: Date.now().toString(),
        ...intentionData,
        requestor_name: user?.full_name || 'Usuario',
        requestor_id: user?.id || 'demo-user',
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const existingIntentions = JSON.parse(localStorage.getItem('massIntentions') || '[]');
      existingIntentions.push(newIntention);
      localStorage.setItem('massIntentions', JSON.stringify(existingIntentions));
      
      console.log('Intención guardada:', newIntention);
      return newIntention;
    } catch (error) {
      console.error('Error al guardar intención:', error);
      throw new Error('Error al guardar la intención');
    }
  };

  const updateIntentionStatus = async (intentionId: string, status: string) => {
    try {
      let allIntentions = [...intentions];
      const existingIntentions = JSON.parse(localStorage.getItem('massIntentions') || '[]');
      allIntentions = [...allIntentions, ...existingIntentions];
      
      const updatedIntentions = allIntentions.map((intention: any) => 
        intention.id === intentionId ? { ...intention, status, updated_at: new Date().toISOString() } : intention
      );
      
      const newIntentions = updatedIntentions.filter(intention => 
        !intentions.find(original => original.id === intention.id)
      );
      localStorage.setItem('massIntentions', JSON.stringify(newIntentions));
      
      console.log('Estado actualizado:', { intentionId, status });
    } catch (error) {
      console.error('Error al actualizar intención:', error);
      throw new Error('Error al actualizar la intención');
    }
  };

  const handleCreateIntention = async (data: any) => {
    try {
      if (!newIntention.intention_for.trim()) {
        throw new Error('El nombre de la persona es requerido');
      }
      
      const intentionData = {
        ...newIntention,
        mass_date: newIntention.mass_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      await saveIntentionToDatabase(intentionData);
      toast.success('Intención creada exitosamente');
      setShowNewIntentionModal(false);
      setNewIntention({
        intention_for: '',
        intention_type: 'living',
        description: '',
        amount: 25000,
        mass_date: ''
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error al crear intención:', error);
      toast.error(error.message || 'Error al crear la intención');
    }
  };

  const handleConfirmIntention = async (intentionId: string) => {
    try {
      await updateIntentionStatus(intentionId, 'confirmed');
      toast.success('Intención confirmada exitosamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error al confirmar intención:', error);
      toast.error(error.message || 'Error al confirmar la intención');
    }
  };

  const handleRejectIntention = async (intentionId: string) => {
    if (confirm('¿Estás seguro de que deseas rechazar esta intención?')) {
      try {
        await updateIntentionStatus(intentionId, 'rejected');
        toast.success('Intención rechazada');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error: any) {
        console.error('Error al rechazar intención:', error);
        toast.error(error.message || 'Error al rechazar la intención');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const filteredIntentions = intentions.filter(intention => {
    const matchesSearch = intention.requestor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intention.intention_for.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || intention.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Load intentions from localStorage on component mount
  React.useEffect(() => {
    const savedIntentions = localStorage.getItem('massIntentions');
    console.log('Intenciones guardadas:', savedIntentions ? JSON.parse(savedIntentions) : 'Ninguna');
  }, []);

  // Filter intentions based on user role
  const getFilteredIntentions = () => {
    if (hasRole(['parishioner'])) {
      // Parishioners only see their own intentions
      return intentions.filter(intention => intention.requestor_name === user?.full_name);
    }
    return filteredIntentions;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Intenciones de Misa</h1>
          <p className="text-slate-600 mt-1">Gestiona las intenciones solicitadas por los feligreses</p>
        </div>
        <button 
          onClick={() => setShowNewIntentionModal(true)}
          className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Intención</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar intenciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Intenciones</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{intentions.length}</p>
            </div>
            <Heart className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pendientes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {intentions.filter(i => i.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Confirmadas</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {intentions.filter(i => i.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ingresos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(intentions.filter(i => i.payment_status === 'paid').reduce((sum, i) => sum + i.amount, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Intentions List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Lista de Intenciones</h3>
          <div className="space-y-4">
            {getFilteredIntentions().map((intention) => (
              <div key={intention.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{intention.intention_for}</h4>
                      <p className="text-sm text-slate-600">Solicitado por: {intention.requestor_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intention.status)} flex items-center space-x-1`}>
                          {getStatusIcon(intention.status)}
                          <span>
                            {intention.status === 'confirmed' ? 'Confirmada' : 
                             intention.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                          </span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(intention.payment_status)}`}>
                          {intention.payment_status === 'paid' ? 'Pagado' : 
                           intention.payment_status === 'pending' ? 'Pendiente pago' : 'Cancelado'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          intention.intention_type === 'living' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {intention.intention_type === 'living' ? 'Por los vivos' : 'Por los difuntos'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {hasRole(['priest', 'secretary', 'parish_admin']) && (
                    <div className="flex space-x-2">
                      {intention.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleConfirmIntention(intention.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Confirmar
                          </button>
                          <button 
                            onClick={() => handleRejectIntention(intention.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(intention.mass_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(intention.amount)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <User className="h-4 w-4" />
                    <span>
                      {intention.payment_method === 'cash' ? 'Efectivo' : 
                       intention.payment_method === 'card' ? 'Tarjeta' : 
                       intention.payment_method === 'transfer' ? 'Transferencia' : 'Sin especificar'}
                    </span>
                  </div>
                </div>

                {intention.description && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-900 mb-1">Descripción:</h5>
                    <p className="text-sm text-slate-600">{intention.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredIntentions.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron intenciones</h3>
              <p className="text-slate-600">No hay intenciones que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Intention Modal */}
      {showNewIntentionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewIntentionModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Nueva Intención de Misa</h3>
                  <button
                    onClick={() => setShowNewIntentionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intención para
                    </label>
                    <input
                      type="text"
                      value={newIntention.intention_for}
                      onChange={(e) => setNewIntention({...newIntention, intention_for: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Nombre de la persona"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de intención
                    </label>
                    <select 
                      value={newIntention.intention_type}
                      onChange={(e) => setNewIntention({...newIntention, intention_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="living">Por los vivos</option>
                      <option value="deceased">Por los difuntos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción (opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={newIntention.description}
                      onChange={(e) => setNewIntention({...newIntention, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Describe la intención..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto de donación
                    </label>
                    <input
                      type="number"
                      value={newIntention.amount}
                      onChange={(e) => setNewIntention({...newIntention, amount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="20000"
                      min="1000"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewIntentionModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateIntention(newIntention)}
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Crear Intención
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassIntentions;