import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Award, Plus, Search, Filter, Calendar, User, FileText, CheckCircle, Clock, XCircle, Upload } from 'lucide-react';

const Sacraments: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with real data from Supabase
  const sacraments = [
    {
      id: '1',
      applicant_name: 'Ana María Rodríguez',
      type: 'baptism',
      status: 'approved',
      scheduled_date: '2024-01-20T10:00:00',
      celebrant: 'Fr. Miguel Rodriguez',
      created_at: '2024-01-05T14:30:00',
      requirements_checklist: {
        birth_certificate: true,
        parents_id: true,
        marriage_certificate: true,
        godparents_letter: false,
        baptism_course: true
      },
      documents: [
        { name: 'Acta de nacimiento', uploaded: true },
        { name: 'Cédula de los padres', uploaded: true },
        { name: 'Certificado de matrimonio', uploaded: true }
      ]
    },
    {
      id: '2',
      applicant_name: 'Carlos y María Fernández',
      type: 'marriage',
      status: 'in_review',
      scheduled_date: null,
      celebrant: null,
      created_at: '2024-01-08T09:15:00',
      requirements_checklist: {
        baptism_certificates: true,
        identity_cards: true,
        single_certificate: false,
        premarital_course: false,
        medical_exam: false
      },
      documents: [
        { name: 'Actas de bautismo', uploaded: true },
        { name: 'Cédulas de identidad', uploaded: true }
      ]
    },
    {
      id: '3',
      applicant_name: 'Luis Alberto González',
      type: 'confirmation',
      status: 'pending',
      scheduled_date: null,
      celebrant: null,
      created_at: '2024-01-10T16:45:00',
      requirements_checklist: {
        baptism_certificate: true,
        identity_card: true,
        preparation_course: false,
        sponsor_letter: false,
        community_participation: false
      },
      documents: [
        { name: 'Acta de bautismo', uploaded: true }
      ]
    }
  ];

  const sacramentTypes = {
    baptism: { name: 'Bautismo', color: 'bg-blue-100 text-blue-800' },
    marriage: { name: 'Matrimonio', color: 'bg-pink-100 text-pink-800' },
    confirmation: { name: 'Confirmación', color: 'bg-purple-100 text-purple-800' },
    first_communion: { name: 'Primera Comunión', color: 'bg-green-100 text-green-800' }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_review': return <Clock className="h-4 w-4" />;
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

  const getRequirementsProgress = (checklist: Record<string, boolean>) => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const filteredSacraments = sacraments.filter(sacrament => {
    const matchesSearch = sacrament.applicant_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || sacrament.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || sacrament.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Sacramentos</h1>
          <p className="text-slate-600 mt-1">Administra las solicitudes de sacramentos</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Solicitud</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre del solicitante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los sacramentos</option>
              <option value="baptism">Bautismo</option>
              <option value="marriage">Matrimonio</option>
              <option value="confirmation">Confirmación</option>
              <option value="first_communion">Primera Comunión</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="in_review">En revisión</option>
              <option value="approved">Aprobados</option>
              <option value="completed">Completados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Solicitudes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{sacraments.length}</p>
            </div>
            <Award className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pendientes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {sacraments.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Revisión</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {sacraments.filter(s => s.status === 'in_review').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Aprobados</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {sacraments.filter(s => s.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Sacraments List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Solicitudes de Sacramentos</h3>
          <div className="space-y-6">
            {filteredSacraments.map((sacrament) => {
              const progress = getRequirementsProgress(sacrament.requirements_checklist);
              const sacramentType = sacramentTypes[sacrament.type as keyof typeof sacramentTypes];
              
              return (
                <div key={sacrament.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900">{sacrament.applicant_name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${sacramentType.color}`}>
                            {sacramentType.name}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sacrament.status)} flex items-center space-x-1`}>
                            {getStatusIcon(sacrament.status)}
                            <span>
                              {sacrament.status === 'pending' ? 'Pendiente' :
                               sacrament.status === 'in_review' ? 'En revisión' :
                               sacrament.status === 'approved' ? 'Aprobado' :
                               sacrament.status === 'completed' ? 'Completado' : 'Rechazado'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {hasRole(['priest', 'secretary', 'parish_admin']) && (
                      <div className="flex space-x-2">
                        {sacrament.status === 'in_review' && (
                          <>
                            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                              Aprobar
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                              Rechazar
                            </button>
                          </>
                        )}
                        {sacrament.status === 'approved' && (
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            Programar
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Scheduled Date and Celebrant */}
                  {sacrament.scheduled_date && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>Programado: {formatDate(sacrament.scheduled_date)}</span>
                      </div>
                      {sacrament.celebrant && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <User className="h-4 w-4" />
                          <span>Celebrante: {sacrament.celebrant}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Requirements Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-900">Requisitos completados</h5>
                      <span className="text-sm text-slate-600">{progress.completed}/{progress.total}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(sacrament.requirements_checklist).map(([requirement, completed]) => (
                        <div key={requirement} className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            completed ? 'bg-green-100' : 'bg-slate-100'
                          }`}>
                            {completed && <CheckCircle className="h-3 w-3 text-green-600" />}
                          </div>
                          <span className={`text-sm ${completed ? 'text-slate-900' : 'text-slate-500'}`}>
                            {requirement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 mb-2">Documentos</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {sacrament.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-700">{doc.name}</span>
                          </div>
                          {doc.uploaded ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <button className="text-amber-600 hover:text-amber-700">
                              <Upload className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Solicitud creada el {formatDate(sacrament.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSacraments.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron solicitudes</h3>
              <p className="text-slate-600">No hay solicitudes de sacramentos que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sacraments;