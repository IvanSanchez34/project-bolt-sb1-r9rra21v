import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail, User } from 'lucide-react';

const StaffManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'volunteer',
    availability: '',
    notes: ''
  });
  
  // Mock data - replace with real data from Supabase
  const staffMembers = [
    {
      id: '1',
      full_name: 'Fr. Miguel Rodriguez',
      email: 'padre.miguel@parish.com',
      phone: '+34 123 456 789',
      role: 'priest',
      roles: ['priest', 'confessor'],
      availability: 'Monday to Friday, 9:00 AM - 6:00 PM',
      active: true,
      notes: 'Main celebrant for Sunday masses',
    },
    {
      id: '2',
      full_name: 'Sister Maria Carmen',
      email: 'hermana.carmen@parish.com',
      phone: '+34 123 456 790',
      role: 'catechist',
      roles: ['catechist', 'youth_leader'],
      availability: 'Monday, Wednesday, Friday - Afternoons',
      active: true,
      notes: 'Specializes in first communion preparation',
    },
    {
      id: '3',
      full_name: 'Ana Martínez',
      email: 'ana.martinez@parish.com',
      phone: '+34 123 456 791',
      role: 'secretary',
      roles: ['secretary', 'administrator'],
      availability: 'Monday to Friday, 8:00 AM - 4:00 PM',
      active: true,
      notes: 'Handles administrative tasks and parish communications',
    },
    {
      id: '4',
      full_name: 'Carlos Fernández',
      email: 'carlos.fernandez@parish.com',
      phone: '+34 123 456 792',
      role: 'volunteer',
      roles: ['sacristan', 'maintenance'],
      availability: 'Weekends and holidays',
      active: true,
      notes: 'Responsible for church maintenance and altar preparation',
    },
  ];

  const roleColors = {
    priest: 'bg-purple-100 text-purple-800',
    secretary: 'bg-blue-100 text-blue-800',
    catechist: 'bg-green-100 text-green-800',
    volunteer: 'bg-amber-100 text-amber-800',
    parish_admin: 'bg-red-100 text-red-800',
    parishioner: 'bg-gray-100 text-gray-800',
  };

  const filteredStaff = staffMembers.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = () => {
    try {
      if (!newStaff.full_name.trim()) {
        toast.error('El nombre completo es requerido');
        return;
      }
      if (!newStaff.email.trim()) {
        toast.error('El email es requerido');
        return;
      }
      
      const staffData = {
        id: Date.now().toString(),
        ...newStaff,
        active: true,
        roles: [newStaff.role],
        created_at: new Date().toISOString()
      };
      
      const existingStaff = JSON.parse(localStorage.getItem('parishStaff') || '[]');
      existingStaff.push(staffData);
      localStorage.setItem('parishStaff', JSON.stringify(existingStaff));
      
      console.log('Personal agregado:', staffData);
      toast.success('Personal agregado exitosamente');
      setShowAddStaffModal(false);
      setNewStaff({
        full_name: '',
        email: '',
        phone: '',
        role: 'volunteer',
        availability: '',
        notes: ''
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al agregar personal:', error);
      toast.error('Error al agregar el personal');
    }
  };

  const handleEditStaff = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    if (staff) {
      toast.success(`Editando: ${staff.full_name}`);
      console.log('Editando personal:', staff);
    }
  };

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este miembro del personal?')) {
      try {
        const existingStaff = JSON.parse(localStorage.getItem('parishStaff') || '[]');
        const updatedStaff = existingStaff.filter((staff: any) => staff.id !== staffId);
        localStorage.setItem('parishStaff', JSON.stringify(updatedStaff));
        
        console.log('Personal eliminado:', staffId);
        toast.success('Personal eliminado exitosamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error al eliminar personal:', error);
        toast.error('Error al eliminar el personal');
      }
    }
  };

  if (!hasRole(['priest', 'secretary', 'parish_admin'])) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-600">You don't have permission to view staff management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-600 mt-1">Manage parish staff members and volunteers</p>
        </div>
        {hasRole(['priest', 'parish_admin']) && (
          <button 
            onClick={() => setShowAddStaffModal(true)}
            className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Personal</span>
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="all">All Roles</option>
              <option value="priest">Priest</option>
              <option value="secretary">Secretary</option>
              <option value="catechist">Catechist</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{member.full_name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      roleColors[member.role as keyof typeof roleColors]
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                {hasRole(['priest', 'parish_admin']) && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditStaff(member.id)}
                      className="p-1 text-slate-400 hover:text-amber-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteStaff(member.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Additional Roles</h4>
                <div className="flex flex-wrap gap-1">
                  {member.roles.slice(1).map((role) => (
                    <span key={role} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-900 mb-1">Availability</h4>
                <p className="text-sm text-slate-600">{member.availability}</p>
              </div>

              {member.notes && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-1">Notes</h4>
                  <p className="text-sm text-slate-600">{member.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No staff members found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddStaffModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Personal</h3>
                  <button
                    onClick={() => setShowAddStaffModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddStaff(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={newStaff.full_name}
                      onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="priest">Sacerdote</option>
                      <option value="secretary">Secretario</option>
                      <option value="catechist">Catequista</option>
                      <option value="volunteer">Voluntario</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidad
                    </label>
                    <input
                      type="text"
                      value={newStaff.availability}
                      onChange={(e) => setNewStaff({...newStaff, availability: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej: Lunes a Viernes, 9:00 AM - 6:00 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      value={newStaff.notes}
                      onChange={(e) => setNewStaff({...newStaff, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Agregar Personal
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

export default StaffManagement;