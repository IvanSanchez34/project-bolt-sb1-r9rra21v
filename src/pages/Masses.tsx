import { Calendar as CalendarIcon, Plus, Search, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Masses: React.FC = () => {
  const { hasRole } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMassModal, setShowNewMassModal] = useState(false);
  const [newMass, setNewMass] = useState({
    date_time: '',
    type: 'sunday',
    celebrant_id: '',
    location: 'Iglesia Principal',
    capacity: 200
  });

  const [celebrants, setCelebrants] = useState<any[]>([]);
  const [celebrantsError, setCelebrantsError] = useState<string | null>(null);

  React.useEffect(() => {
    // Obtener celebrantes (usuarios con rol priest)
    (async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('role', 'priest');
      if (error) {
        setCelebrantsError('Error al cargar los celebrantes.');
        setCelebrants([]);
      } else if (data && data.length === 0) {
        setCelebrantsError('No hay celebrantes disponibles.');
        setCelebrants([]);
      } else {
        setCelebrantsError(null);
        setCelebrants(data);
      }
    })();
  }, []);

  // Mock data - replace with real data from Supabase
  const masses = [
    {
      id: '1',
      date_time: '2024-01-15T08:00:00',
      type: 'sunday',
      celebrant: 'Fr. Miguel Rodriguez',
      location: 'Iglesia Principal',
      capacity: 200,
      registered_count: 150,
      status: 'confirmed',
      intentions: ['Por la salud de María García', 'En memoria de Juan Pérez']
    },
    {
      id: '2',
      date_time: '2024-01-15T10:00:00',
      type: 'sunday',
      celebrant: 'Fr. Miguel Rodriguez',
      location: 'Iglesia Principal',
      capacity: 200,
      registered_count: 180,
      status: 'confirmed',
      intentions: ['Por la familia López', 'Acción de gracias']
    },
    {
      id: '3',
      date_time: '2024-01-15T18:00:00',
      type: 'sunday',
      celebrant: 'Fr. Carlos Mendoza',
      location: 'Capilla San José',
      capacity: 100,
      registered_count: 75,
      status: 'confirmed',
      intentions: ['Por los enfermos de la parroquia']
    },
    {
      id: '4',
      date_time: '2024-01-16T07:00:00',
      type: 'daily',
      celebrant: 'Fr. Miguel Rodriguez',
      location: 'Iglesia Principal',
      capacity: 50,
      registered_count: 25,
      status: 'scheduled',
      intentions: []
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sunday': return 'bg-blue-100 text-blue-800';
      case 'daily': return 'bg-green-100 text-green-800';
      case 'holiday': return 'bg-purple-100 text-purple-800';
      case 'special': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMasses = masses.filter(mass => {
    const matchesSearch = mass.celebrant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mass.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateMass = () => {
    (async () => {
      try {
        if (!newMass.date_time) {
          toast.error('La fecha y hora son requeridas');
          return;
        }
        if (!newMass.celebrant_id) {
          toast.error('El celebrante es requerido');
          return;
        }

        const parish_id = '550e8400-e29b-41d4-a716-446655440000';
        const { error } = await supabase
          .from('masses')
          .insert([
            {
              parish_id,
              date_time: newMass.date_time,
              type: newMass.type,
              celebrant_id: newMass.celebrant_id,
              location: newMass.location,
              capacity: newMass.capacity,
              status: 'scheduled',
            }
          ]);

        if (error) {
          toast.error('Error al crear la misa');
          return;
        }

        toast.success('Misa creada exitosamente');
        setShowNewMassModal(false);
        setNewMass({
          date_time: '',
          type: 'sunday',
          celebrant_id: '',
          location: 'Iglesia Principal',
          capacity: 200
        });
        // Opcional: recargar o actualizar lista
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error al crear misa:', error);
        toast.error('Error al crear la misa');
      }
    })();
  };

  const handleEditMass = (massId: string) => {
    const mass = masses.find(m => m.id === massId);
    if (mass) {
      toast.success(`Editando misa del ${formatDate(mass.date_time)}`);
      console.log('Editando misa:', mass);
    }
  };

  const handleDeleteMass = (massId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta misa?')) {
      try {
        const existingMasses = JSON.parse(localStorage.getItem('parishMasses') || '[]');
        const updatedMasses = existingMasses.filter((mass: any) => mass.id !== massId);
        localStorage.setItem('parishMasses', JSON.stringify(updatedMasses));
        
        console.log('Misa eliminada:', massId);
        toast.success('Misa eliminada exitosamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error al eliminar misa:', error);
        toast.error('Error al eliminar la misa');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Misas</h1>
          <p className="text-slate-600 mt-1">Administra el calendario de misas y celebraciones</p>
        </div>
        {hasRole(['priest', 'secretary', 'parish_admin']) && (
          <button 
            onClick={() => setShowNewMassModal(true)}
            className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Misa</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CalendarIcon className="h-4 w-4 inline mr-2" />
              Calendario
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lista
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar misas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Calendario</h3>
              <ReactCalendar
                onChange={setSelectedDate as any}
                value={selectedDate}
                className="w-full"
                locale="es-ES"
              />
            </div>
          </div>

          {/* Masses for selected date */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Misas del {formatDate(selectedDate.toISOString())}
              </h3>
              <div className="space-y-4">
                {filteredMasses
                  .filter(mass => {
                    const massDate = new Date(mass.date_time);
                    return massDate.toDateString() === selectedDate.toDateString();
                  })
                  .map((mass) => (
                    <div key={mass.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{formatTime(mass.date_time)}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(mass.type)}`}>
                                {mass.type === 'sunday' ? 'Dominical' : 
                                 mass.type === 'daily' ? 'Diaria' : 
                                 mass.type === 'holiday' ? 'Festiva' : 'Especial'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mass.status)}`}>
                                {mass.status === 'confirmed' ? 'Confirmada' : 
                                 mass.status === 'scheduled' ? 'Programada' : 'Cancelada'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {hasRole(['priest', 'secretary', 'parish_admin']) && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditMass(mass.id)}
                              className="p-2 text-slate-400 hover:text-amber-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMass(mass.id)}
                              className="p-2 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <User className="h-4 w-4" />
                          <span>{mass.celebrant}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{mass.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-slate-600">
                          Capacidad: {mass.registered_count}/{mass.capacity} personas
                        </div>
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-amber-600 h-2 rounded-full" 
                            style={{ width: `${(mass.registered_count / mass.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {mass.intentions.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-slate-900 mb-2">Intenciones:</h5>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {mass.intentions.map((intention, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                {intention}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                {filteredMasses.filter(mass => {
                  const massDate = new Date(mass.date_time);
                  return massDate.toDateString() === selectedDate.toDateString();
                }).length === 0 && (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No hay misas programadas</h3>
                    <p className="text-slate-600">No se encontraron misas para esta fecha.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Todas las Misas</h3>
            <div className="space-y-4">
              {filteredMasses.map((mass) => (
                <div key={mass.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {formatDate(mass.date_time)} - {formatTime(mass.date_time)}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(mass.type)}`}>
                            {mass.type === 'sunday' ? 'Dominical' : 
                             mass.type === 'daily' ? 'Diaria' : 
                             mass.type === 'holiday' ? 'Festiva' : 'Especial'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mass.status)}`}>
                            {mass.status === 'confirmed' ? 'Confirmada' : 
                             mass.status === 'scheduled' ? 'Programada' : 'Cancelada'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {hasRole(['priest', 'secretary', 'parish_admin']) && (
                      <div className="flex space-x-2">
                        <button className="p-2 text-slate-400 hover:text-amber-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <User className="h-4 w-4" />
                      <span>{mass.celebrant}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{mass.location}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {mass.registered_count}/{mass.capacity} personas
                    </div>
                  </div>

                  {mass.intentions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-900 mb-2">Intenciones:</h5>
                      <div className="flex flex-wrap gap-2">
                        {mass.intentions.map((intention, index) => (
                          <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs">
                            {intention}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Mass Modal */}
      {showNewMassModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewMassModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Nueva Misa</h3>
                  <button
                    onClick={() => setShowNewMassModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateMass(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={newMass.date_time}
                      onChange={(e) => setNewMass({...newMass, date_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Misa
                    </label>
                    <select
                      value={newMass.type}
                      onChange={(e) => setNewMass({...newMass, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="daily">Diaria</option>
                      <option value="sunday">Dominical</option>
                      <option value="holiday">Festiva</option>
                      <option value="special">Especial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Celebrante
                    </label>
                    <select
                      value={newMass.celebrant_id}
                      onChange={(e) => setNewMass({...newMass, celebrant_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                      disabled={!!celebrantsError}
                    >
                      <option value="">Selecciona un celebrante</option>
                      {celebrants.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                    {celebrantsError && (
                      <p className="mt-2 text-sm text-red-600">{celebrantsError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={newMass.location}
                      onChange={(e) => setNewMass({...newMass, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad
                    </label>
                    <input
                      type="number"
                      value={newMass.capacity}
                      onChange={(e) => setNewMass({...newMass, capacity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min="1"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewMassModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Crear Misa
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

export default Masses;