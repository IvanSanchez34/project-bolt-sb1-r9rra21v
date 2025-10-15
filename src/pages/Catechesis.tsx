import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Plus, Search, Filter, Users, Calendar, CheckCircle, Clock, User, Phone, Mail } from 'lucide-react';

const Catechesis: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'groups' | 'students' | 'attendance'>('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedGroupForStudent, setSelectedGroupForStudent] = useState('');
  const [newGroup, setNewGroup] = useState({
    name: '',
    age_range: '',
    catechist: '',
    schedule: '',
    max_students: 25
  });
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    date_of_birth: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    group_id: '',
    medical_notes: ''
  });

  // Mock data - replace with real data from Supabase
  const groups = [
    {
      id: '1',
      name: 'Primera Comunión - Grupo A',
      age_range: '8-10 años',
      catechist: 'Sister María Carmen',
      schedule: 'Sábados 3:00 PM - 4:30 PM',
      academic_year: '2024-2025',
      max_students: 20,
      current_students: 18,
      active: true
    },
    {
      id: '2',
      name: 'Confirmación - Jóvenes',
      age_range: '14-16 años',
      catechist: 'Carlos Mendoza',
      schedule: 'Domingos 4:00 PM - 5:30 PM',
      academic_year: '2024-2025',
      max_students: 15,
      current_students: 12,
      active: true
    },
    {
      id: '3',
      name: 'Catequesis Familiar',
      age_range: 'Familias',
      catechist: 'Ana Rodríguez',
      schedule: 'Viernes 7:00 PM - 8:30 PM',
      academic_year: '2024-2025',
      max_students: 25,
      current_students: 22,
      active: true
    }
  ];

  const students = [
    {
      id: '1',
      full_name: 'María José García',
      date_of_birth: '2014-03-15',
      parent_name: 'Carmen García',
      parent_phone: '+57 300 123 4567',
      parent_email: 'carmen.garcia@email.com',
      group_name: 'Primera Comunión - Grupo A',
      enrollment_date: '2024-01-15',
      active: true,
      attendance_rate: 95
    },
    {
      id: '2',
      full_name: 'Juan Carlos Pérez',
      date_of_birth: '2014-07-22',
      parent_name: 'Luis Pérez',
      parent_phone: '+57 301 234 5678',
      parent_email: 'luis.perez@email.com',
      group_name: 'Primera Comunión - Grupo A',
      enrollment_date: '2024-01-20',
      active: true,
      attendance_rate: 88
    },
    {
      id: '3',
      full_name: 'Ana Sofía López',
      date_of_birth: '2008-11-10',
      parent_name: 'María López',
      parent_phone: '+57 302 345 6789',
      parent_email: 'maria.lopez@email.com',
      group_name: 'Confirmación - Jóvenes',
      enrollment_date: '2024-01-10',
      active: true,
      attendance_rate: 92
    }
  ];

  const attendanceRecords = [
    {
      id: '1',
      student_name: 'María José García',
      group_name: 'Primera Comunión - Grupo A',
      date: '2024-01-13',
      present: true,
      notes: ''
    },
    {
      id: '2',
      student_name: 'Juan Carlos Pérez',
      group_name: 'Primera Comunión - Grupo A',
      date: '2024-01-13',
      present: false,
      notes: 'Enfermo'
    },
    {
      id: '3',
      student_name: 'Ana Sofía López',
      group_name: 'Confirmación - Jóvenes',
      date: '2024-01-14',
      present: true,
      notes: 'Participación excelente'
    }
  ];

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.catechist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Database operations
  const saveGroupToDatabase = async (groupData: any) => {
    try {
      if (!groupData.name.trim() || !groupData.catechist.trim()) {
        throw new Error('Nombre del grupo y catequista son requeridos');
      }
      
      const newGroup = {
        id: Date.now().toString(),
        ...groupData,
        academic_year: '2025-2026',
        current_students: 0,
        active: true,
        created_at: new Date().toISOString()
      };
      
      const existingGroups = JSON.parse(localStorage.getItem('catechesisGroups') || '[]');
      existingGroups.push(newGroup);
      localStorage.setItem('catechesisGroups', JSON.stringify(existingGroups));
      
      console.log('Grupo guardado:', newGroup);
      return newGroup;
    } catch (error) {
      throw new Error('Error al guardar el grupo');
    }
  };

  const saveStudentToDatabase = async (studentData: any) => {
    try {
      if (!studentData.full_name.trim() || !studentData.parent_name.trim()) {
        throw new Error('Nombre del estudiante y padre/madre son requeridos');
      }
      
      const newStudent = {
        id: Date.now().toString(),
        ...studentData,
        enrollment_date: new Date().toISOString().split('T')[0],
        active: true,
        attendance_rate: 100,
        created_at: new Date().toISOString()
      };
      
      const existingStudents = JSON.parse(localStorage.getItem('catechesisStudents') || '[]');
      existingStudents.push(newStudent);
      localStorage.setItem('catechesisStudents', JSON.stringify(existingStudents));
      
      console.log('Estudiante guardado:', newStudent);
      return newStudent;
    } catch (error) {
      throw new Error('Error al guardar el estudiante');
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!newGroup.name.trim()) {
        toast.error('El nombre del grupo es requerido');
        return;
      }
      if (!newGroup.catechist.trim()) {
        toast.error('El catequista es requerido');
        return;
      }
      
      await saveGroupToDatabase(newGroup);
      toast.success('Grupo creado exitosamente');
      setShowNewGroupModal(false);
      setNewGroup({
        name: '',
        age_range: '',
        catechist: '',
        schedule: '',
        max_students: 25
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Error al crear el grupo');
    }
  };

  const handleCreateStudent = async () => {
    try {
      if (!newStudent.full_name.trim()) {
        toast.error('El nombre del estudiante es requerido');
        return;
      }
      if (!newStudent.parent_name.trim()) {
        toast.error('El nombre del padre/madre es requerido');
        return;
      }
      if (!selectedGroupForStudent) {
        toast.error('Debe seleccionar un grupo');
        return;
      }
      
      const studentData = {
        ...newStudent,
        group_id: selectedGroupForStudent
      };
      
      await saveStudentToDatabase(studentData);
      toast.success('Estudiante registrado exitosamente');
      setShowNewStudentModal(false);
      setNewStudent({
        full_name: '',
        date_of_birth: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        group_id: '',
        medical_notes: ''
      });
      setSelectedGroupForStudent('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message || 'Error al registrar el estudiante');
    }
  };

  const handleRecordAttendance = async () => {
    try {
      if (!selectedGroupForStudent) {
        toast.error('Debe seleccionar un grupo');
        return;
      }
      
      const attendanceData = {
        id: Date.now().toString(),
        student_id: 'demo-student-id',
        group_id: selectedGroupForStudent,
        date: new Date().toISOString().split('T')[0],
        present: true,
        notes: '',
        recorded_by: user?.id || 'current_user'
      };
      
      const existingAttendance = JSON.parse(localStorage.getItem('catechesisAttendance') || '[]');
      existingAttendance.push(attendanceData);
      localStorage.setItem('catechesisAttendance', JSON.stringify(existingAttendance));
      
      console.log('Asistencia registrada:', attendanceData);
      toast.success('Asistencia registrada exitosamente');
      setShowAttendanceModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Error al registrar la asistencia');
    }
  };

  const handleViewDetails = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      toast.success(`Viendo detalles de: ${group.name}`);
      console.log('Detalles del grupo:', group);
    }
  };

  const handleManageGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      toast.success(`Gestionando grupo: ${group.name}`);
      console.log('Gestionando grupo:', group);
    }
  };
  if (!hasRole(['catechist'])) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Módulo de Catequesis</h2>
        <p className="text-slate-600">Este módulo está disponible solo para catequistas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Catequesis</h1>
          <p className="text-slate-600 mt-1">Administra grupos, estudiantes y asistencia</p>
        </div>
        {hasRole(['priest', 'secretary', 'parish_admin', 'catechist']) && (
          <button className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>
              <span onClick={() => {
                if (activeTab === 'groups') setShowNewGroupModal(true);
                else if (activeTab === 'students') setShowNewStudentModal(true);
                else setShowAttendanceModal(true);
              }}>
                {activeTab === 'groups' ? 'Nuevo Grupo' : 
                 activeTab === 'students' ? 'Nuevo Estudiante' : 'Registrar Asistencia'}
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Grupos
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Estudiantes
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attendance'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Asistencia
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'groups' ? 'Buscar grupos...' :
                activeTab === 'students' ? 'Buscar estudiantes...' :
                'Buscar registros de asistencia...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{group.name}</h3>
                          <p className="text-sm text-slate-600">{group.age_range}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {group.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <User className="h-4 w-4" />
                        <span>{group.catechist}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{group.schedule}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>{group.academic_year}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-600">
                        Estudiantes: {group.current_students}/{group.max_students}
                      </span>
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{ width: `${(group.current_students / group.max_students) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                        <span onClick={() => handleViewDetails(group.id)}>Ver Detalles</span>
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
                        <span onClick={() => handleManageGroup(group.id)}>Gestionar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{student.full_name}</h3>
                        <p className="text-sm text-slate-600">
                          {calculateAge(student.date_of_birth)} años • {student.group_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getAttendanceColor(student.attendance_rate)}`}>
                        {student.attendance_rate}%
                      </div>
                      <div className="text-xs text-slate-500">Asistencia</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <User className="h-4 w-4" />
                      <span>{student.parent_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{student.parent_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span>{student.parent_email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Inscrito el {formatDate(student.enrollment_date)}</span>
                    <span>Nacimiento: {formatDate(student.date_of_birth)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-slate-900 mb-2">Registros Recientes de Asistencia</h3>
                <p className="text-sm text-slate-600">Últimos registros de asistencia por grupo</p>
              </div>

              {attendanceRecords.map((record) => (
                <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        record.present ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {record.present ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{record.student_name}</h4>
                        <p className="text-sm text-slate-600">{record.group_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-900">{formatDate(record.date)}</div>
                      <div className={`text-sm font-medium ${
                        record.present ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.present ? 'Presente' : 'Ausente'}
                      </div>
                    </div>
                  </div>
                  {record.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewGroupModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Grupo</h3>
                  <button
                    onClick={() => setShowNewGroupModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Grupo
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej: Primera Comunión - Grupo A"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rango de Edad
                    </label>
                    <input
                      type="text"
                      value={newGroup.age_range}
                      onChange={(e) => setNewGroup({...newGroup, age_range: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej: 8-10 años"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catequista
                    </label>
                    <input
                      type="text"
                      value={newGroup.catechist}
                      onChange={(e) => setNewGroup({...newGroup, catechist: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Nombre del catequista"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={newGroup.schedule}
                      onChange={(e) => setNewGroup({...newGroup, schedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej: Sábados 3:00 PM - 4:30 PM"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Máximo de Estudiantes
                    </label>
                    <input
                      type="number"
                      value={newGroup.max_students}
                      onChange={(e) => setNewGroup({...newGroup, max_students: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min="1"
                      max="50"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewGroupModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Crear Grupo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Student Modal */}
      {showNewStudentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowNewStudentModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Registrar Nuevo Estudiante</h3>
                  <button
                    onClick={() => setShowNewStudentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateStudent(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo del Estudiante
                      </label>
                      <input
                        type="text"
                        value={newStudent.full_name}
                        onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        value={newStudent.date_of_birth}
                        onChange={(e) => setNewStudent({...newStudent, date_of_birth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Padre/Madre
                      </label>
                      <input
                        type="text"
                        value={newStudent.parent_name}
                        onChange={(e) => setNewStudent({...newStudent, parent_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Nombre del padre o madre"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={newStudent.parent_phone}
                        onChange={(e) => setNewStudent({...newStudent, parent_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="+57 300 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newStudent.parent_email}
                      onChange={(e) => setNewStudent({...newStudent, parent_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="email@ejemplo.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grupo
                    </label>
                    <select
                      value={selectedGroupForStudent}
                      onChange={(e) => setSelectedGroupForStudent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="">Seleccionar grupo</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Médicas (Opcional)
                    </label>
                    <textarea
                      value={newStudent.medical_notes}
                      onChange={(e) => setNewStudent({...newStudent, medical_notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                      placeholder="Alergias, medicamentos, condiciones especiales..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewStudentModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Registrar Estudiante
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAttendanceModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Registrar Asistencia</h3>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleRecordAttendance(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grupo
                    </label>
                    <select
                      value={selectedGroupForStudent}
                      onChange={(e) => setSelectedGroupForStudent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="">Seleccionar grupo</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAttendanceModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Registrar Asistencia
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

export default Catechesis;