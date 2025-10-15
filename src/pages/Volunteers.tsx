import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HandHeart, Plus, Search, Filter, Calendar, User, Phone, Mail, Clock, MapPin, CheckCircle } from 'lucide-react';

const Volunteers: React.FC = () => {
  const { hasRole } = useAuth();
  
  // Only show volunteer's own assignments if user is volunteer
  const filteredAssignmentsForRole = hasRole(['volunteer']) 
    ? assignments.filter(assignment => assignment.volunteer_name === 'Usuario Actual')
    : assignments;

  const [activeTab, setActiveTab] = useState<'volunteers' | 'assignments'>('volunteers');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showNewVolunteerModal, setShowNewVolunteerModal] = useState(false);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    full_name: '',
    email: '',
    phone: '',
    volunteer_roles: [] as string[],
    skills: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  // Mock data - replace with real data from Supabase
  const volunteers = [
    {
      id: '1',
      full_name: 'Carlos Fernández',
      email: 'carlos.fernandez@email.com',
      phone: '+57 300 123 4567',
      volunteer_roles: ['sacristan', 'lector'],
      availability: {
        'Sábado': ['6:00 PM - 8:00 PM'],
        'Domingo': ['8:00 AM - 12:00 PM', '6:00 PM - 8:00 PM']
      },
      skills: ['Lectura', 'Organización', 'Atención al público'],
      emergency_contact: 'María Fernández',
      emergency_phone: '+57 301 234 5678',
      active: true,
      assignments_count: 8
    },
    {
      id: '2',
      full_name: 'Ana María Rodríguez',
      email: 'ana.rodriguez@email.com',
      phone: '+57 302 345 6789',
      volunteer_roles: ['coro', 'catequista'],
      availability: {
        'Miércoles': ['7:00 PM - 9:00 PM'],
        'Domingo': ['9:00 AM - 11:00 AM']
      },
      skills: ['Música', 'Enseñanza', 'Trabajo con niños'],
      emergency_contact: 'Luis Rodríguez',
      emergency_phone: '+57 303 456 7890',
      active: true,
      assignments_count: 12
    },
    {
      id: '3',
      full_name: 'Miguel Santos',
      email: 'miguel.santos@email.com',
      phone: '+57 304 567 8901',
      volunteer_roles: ['monaguillo', 'mantenimiento'],
      availability: {
        'Sábado': ['5:00 PM - 7:00 PM'],
        'Domingo': ['7:00 AM - 9:00 AM', '10:00 AM - 12:00 PM']
      },
      skills: ['Ceremonial', 'Reparaciones menores', 'Limpieza'],
      emergency_contact: 'Carmen Santos',
      emergency_phone: '+57 305 678 9012',
      active: true,
      assignments_count: 15
    }
  ];

  const assignments = [
    {
      id: '1',
      volunteer_name: 'Carlos Fernández',
      mass_date: '2024-01-21T18:00:00',
      event_name: 'Misa Vespertina',
      role: 'Sacristán',
      location: 'Iglesia Principal',
      status: 'confirmed',
      notes: 'Preparar altar para misa especial'
    },
    {
      id: '2',
      volunteer_name: 'Ana María Rodríguez',
      mass_date: '2024-01-21T10:00:00',
      event_name: 'Misa Dominical',
      role: 'Coro',
      location: 'Iglesia Principal',
      status: 'assigned',
      notes: 'Ensayo previo a las 9:30 AM'
    },
    {
      id: '3',
      volunteer_name: 'Miguel Santos',
      mass_date: '2024-01-21T08:00:00',
      event_name: 'Misa Matutina',
      role: 'Monaguillo',
      location: 'Iglesia Principal',
      status: 'confirmed',
      notes: ''
    },
    {
      id: '4',
      volunteer_name: 'Carlos Fernández',
      mass_date: '2024-01-22T19:00:00',
      event_name: 'Adoración Eucarística',
      role: 'Lector',
      location: 'Capilla San José',
      status: 'assigned',
      notes: 'Lectura de las Escrituras'
    }
  ];

  const volunteerRoles = [
    'sacristan', 'lector', 'coro', 'catequista', 'monaguillo', 
    'mantenimiento', 'recepcion', 'limpieza', 'eventos'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      sacristan: 'Sacristán',
      lector: 'Lector',
      coro: 'Coro',
      catequista: 'Catequista',
      monaguillo: 'Monaguillo',
      mantenimiento: 'Mantenimiento',
      recepcion: 'Recepción',
      limpieza: 'Limpieza',
      eventos: 'Eventos'
    };
    return roleNames[role] || role;
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || volunteer.volunteer_roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const filteredAssignments = assignments.filter(assignment =>
    assignment.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Database operations
  const saveVolunteerToDatabase = async (volunteerData: any) => {
    try {
      const newVolunteer = {
        id: Date.now().toString(),
        ...volunteerData,
        active: true,
        assignments_count: 0,
        created_at: new Date().toISOString()
      };
      
      const existingVolunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      existingVolunteers.push(newVolunteer);
      localStorage.setItem('volunteers', JSON.stringify(existingVolunteers));
      
      return newVolunteer;
    } catch (error) {
      throw new Error('Error al guardar el voluntario');
    }
  };

  const handleCreateVolunteer = async () => {
    try {
      await saveVolunteerToDatabase(newVolunteer);
      toast.success('Voluntario registrado exitosamente');
      setShowNewVolunteerModal(false);
      setNewVolunteer({
        full_name: '',
        email: '',
        phone: '',
        volunteer_roles: [],
        skills: '',
        emergency_contact: '',
        emergency_phone: ''
      });
      window.location.reload();
    } catch (error) {
      toast.error('Error al registrar el voluntario');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      console.log('Creando nueva asignación');
      // Here you would save to database
      toast.success('Asignación creada exitosamente');
      setShowNewAssignmentModal(false);
    } catch (error) {
      toast.error('Error al crear la asignación');
    }
  };

  const handleConfirmAssignment = async (assignmentId: string) => {
    try {
      let allAssignments = [...assignments];
      const existingAssignments = JSON.parse(localStorage.getItem('volunteerAssignments') || '[]');
      allAssignments = [...allAssignments, ...existingAssignments];
      
      const updatedAssignments = allAssignments.map((assignment: any) => 
        assignment.id === assignmentId ? { ...assignment, status: 'confirmed', updated_at: new Date().toISOString() } : assignment
      );
      
      const newAssignments = updatedAssignments.filter(assignment => 
        !assignments.find(original => original.id === assignment.id)
      );
      localStorage.setItem('volunteerAssignments', JSON.stringify(newAssignments));
      
      console.log('Asignación confirmada:', assignmentId);
      toast.success('Asignación confirmada exitosamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al confirmar asignación:', error);
      toast.error('Error al confirmar la asignación');
    }
  };

  const handleCancelAssignment = async (assignmentId: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta asignación?')) {
      try {
        let allAssignments = [...assignments];
        const existingAssignments = JSON.parse(localStorage.getItem('volunteerAssignments') || '[]');
        allAssignments = [...allAssignments, ...existingAssignments];
        
        const updatedAssignments = allAssignments.map((assignment: any) => 
          assignment.id === assignmentId ? { ...assignment, status: 'cancelled', updated_at: new Date().toISOString() } : assignment
        );
        
        const newAssignments = updatedAssignments.filter(assignment => 
          !assignments.find(original => original.id === assignment.id)
        );
        localStorage.setItem('volunteerAssignments', JSON.stringify(newAssignments));
        
        console.log('Asignación cancelada:', assignmentId);
        toast.success('Asignación cancelada exitosamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error al cancelar asignación:', error);
        toast.error('Error al cancelar la asignación');
      }
    }
  };

  const handleCreateVolunteer2 = async () => {
    try {
      if (!newVolunteer.full_name.trim()) {
        toast.error('El nombre completo es requerido');
        return;
      }
      if (!newVolunteer.email.trim()) {
        toast.error('El email es requerido');
        return;
      }
      
      const volunteerData = {
        ...newVolunteer,
        volunteer_roles: newVolunteer.volunteer_roles.length > 0 ? newVolunteer.volunteer_roles : ['volunteer'],
        skills: newVolunteer.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      };
      
      await saveVolunteerToDatabase(volunteerData);
      toast.success('Voluntario registrado exitosamente');
      setShowNewVolunteerModal(false);
      setNewVolunteer({
        full_name: '',
        email: '',
        phone: '',
        volunteer_roles: [],
        skills: '',
        emergency_contact: '',
        emergency_phone: ''
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al registrar voluntario:', error);
      toast.error('Error al registrar el voluntario');
    }
  };

  const handleCreateAssignment2 = async () => {
    try {
      const assignmentData = {
        id: Date.now().toString(),
        volunteer_id: 'demo-volunteer-id',
        volunteer_name: 'Nuevo Voluntario',
        mass_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event_name: 'Misa Dominical',
        role: 'Voluntario',
        location: 'Iglesia Principal',
        status: 'assigned',
        notes: 'Nueva asignación creada',
        created_at: new Date().toISOString()
      };
      
      const existingAssignments = JSON.parse(localStorage.getItem('volunteerAssignments') || '[]');
      existingAssignments.push(assignmentData);
      localStorage.setItem('volunteerAssignments', JSON.stringify(existingAssignments));
      
      console.log('Asignación creada:', assignmentData);
      toast.success('Asignación creada exitosamente');
      setShowNewAssignmentModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al crear asignación:', error);
      toast.error('Error al crear la asignación');
    }
  };

  // Show different content based on role
  if (hasRole(['volunteer'])) {
    // Volunteer view - only show their assignments
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Asignaciones</h1>
          <p className="text-slate-600 mt-1">Revisa tus asignaciones de voluntariado</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Mis Próximas Asignaciones</h3>
            <div className="space-y-4">
              {filteredAssignmentsForRole.map((assignment) => (
                <div key={assignment.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{assignment.event_name}</h3>
                        <p className="text-sm text-slate-600">{assignment.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status === 'confirmed' ? 'Confirmada' :
                       assignment.status === 'assigned' ? 'Asignada' :
                       assignment.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(assignment.mass_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{assignment.location}</span>
                    </div>
                  </div>

                  {assignment.notes && (
                    <div className="bg-slate-50 p-3 rounded-lg mb-4">
                      <h5 className="text-sm font-medium text-slate-900 mb-1">Notas:</h5>
                      <p className="text-sm text-slate-600">{assignment.notes}</p>
                    </div>
                  )}

                  {assignment.status === 'assigned' && (
                    <div className="flex space-x-2 pt-4 border-t border-slate-200">
                      <button 
                        onClick={() => handleConfirmAssignment(assignment.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Confirmar Asistencia
                      </button>
                      <button 
                        onClick={() => handleCancelAssignment(assignment.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        No Puedo Asistir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRole(['priest', 'secretary', 'parish_admin'])) {
    return (
      <div className="text-center py-12">
        <HandHeart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceso Restringido</h2>
        <p className="text-slate-600">No tienes permisos para ver la gestión de voluntarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Voluntarios</h1>
          <p className="text-slate-600 mt-1">Administra voluntarios y sus asignaciones</p>
        </div>
        {hasRole(['priest', 'secretary', 'parish_admin']) && (
          <button className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>
              <span onClick={() => {
                if (activeTab === 'volunteers') setShowNewVolunteerModal(true);
                else setShowNewAssignmentModal(true);
              }}>
                {activeTab === 'volunteers' ? 'Nuevo Voluntario' : 'Nueva Asignación'}
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Voluntarios</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{volunteers.length}</p>
            </div>
            <HandHeart className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Activos</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {volunteers.filter(v => v.active).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Asignaciones</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{assignments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Confirmadas</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {assignments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'volunteers'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <HandHeart className="h-4 w-4 inline mr-2" />
              Voluntarios
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Asignaciones
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'volunteers' ? 'Buscar voluntarios...' : 'Buscar asignaciones...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'volunteers' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="all">Todos los roles</option>
                  {volunteerRoles.map(role => (
                    <option key={role} value={role}>{getRoleDisplayName(role)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              {filteredVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <HandHeart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{volunteer.full_name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {volunteer.volunteer_roles.map((role) => (
                            <span key={role} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                              {getRoleDisplayName(role)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        volunteer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {volunteer.active ? 'Activo' : 'Inactivo'}
                      </span>
                      <div className="text-sm text-slate-500 mt-1">
                        {volunteer.assignments_count} asignaciones
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span>{volunteer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{volunteer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <User className="h-4 w-4" />
                      <span>{volunteer.emergency_contact}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Disponibilidad</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(volunteer.availability).map(([day, times]) => (
                        <div key={day} className="flex items-center space-x-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span><strong>{day}:</strong> {times.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Habilidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {assignments.filter(assignment =>
                assignment.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignment.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignment.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((assignment) => (
                <div key={assignment.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{assignment.event_name}</h3>
                        <p className="text-sm text-slate-600">{assignment.volunteer_name} - {assignment.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status === 'confirmed' ? 'Confirmada' :
                       assignment.status === 'assigned' ? 'Asignada' :
                       assignment.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(assignment.mass_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{assignment.location}</span>
                    </div>
                  </div>

                  {assignment.notes && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-900 mb-1">Notas:</h5>
                      <p className="text-sm text-slate-600">{assignment.notes}</p>
                    </div>
                  )}

                  {hasRole(['priest', 'secretary', 'parish_admin']) && assignment.status === 'assigned' && (
                    <div className="flex space-x-2 mt-4 pt-4 border-t border-slate-200">
                      <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        <span onClick={() => handleConfirmAssignment(assignment.id)}>Confirmar</span>
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                        <span onClick={() => handleCancelAssignment(assignment.id)}>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Volunteer Modal */}
      {showNewVolunteerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewVolunteerModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Nuevo Voluntario</h3>
                  <button
                    onClick={() => setShowNewVolunteerModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateVolunteer(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={newVolunteer.full_name}
                      onChange={(e) => setNewVolunteer({...newVolunteer, full_name: e.target.value})}
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
                      value={newVolunteer.email}
                      onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
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
                      value={newVolunteer.phone}
                      onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Habilidades (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={newVolunteer.skills}
                      onChange={(e) => setNewVolunteer({...newVolunteer, skills: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej: Música, Enseñanza, Organización"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewVolunteerModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Registrar Voluntario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewAssignmentModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Nueva Asignación</h3>
                  <button
                    onClick={() => setShowNewAssignmentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateAssignment(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evento
                    </label>
                    <input
                      type="text"
                      defaultValue="Misa Dominical"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="sacristan">Sacristán</option>
                      <option value="lector">Lector</option>
                      <option value="coro">Coro</option>
                      <option value="monaguillo">Monaguillo</option>
                      <option value="recepcion">Recepción</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewAssignmentModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Crear Asignación
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

export default Volunteers;