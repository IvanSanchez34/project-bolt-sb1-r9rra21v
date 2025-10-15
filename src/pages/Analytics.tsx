import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { BarChart3, TrendingUp, Users, Calendar, Heart, Award, HandHeart, DollarSign, Filter } from 'lucide-react';

const Analytics: React.FC = () => {
  const { hasRole } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  const handleExportData = () => {
    try {
      console.log('Exportando datos analíticos...');
      toast.success('Datos exportados exitosamente');
    } catch (error) {
      toast.error('Error al exportar los datos');
    }
  };

  const handleGenerateReport = () => {
    try {
      console.log('Generando reporte...');
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el reporte');
    }
  };

  // Mock data - replace with real data from Supabase
  const stats = {
    totalParishioners: 1234,
    activeMasses: 24,
    totalIntentions: 156,
    completedSacraments: 89,
    activeVolunteers: 45,
    totalRevenue: 2450000,
    trends: {
      parishioners: { value: 5.2, isPositive: true },
      masses: { value: 2.1, isPositive: true },
      intentions: { value: 8.3, isPositive: true },
      sacraments: { value: -1.2, isPositive: false },
      volunteers: { value: 12.5, isPositive: true },
      revenue: { value: 15.8, isPositive: true }
    }
  };

  const massAttendance = [
    { month: 'Ene', attendance: 850 },
    { month: 'Feb', attendance: 920 },
    { month: 'Mar', attendance: 1100 },
    { month: 'Abr', attendance: 980 },
    { month: 'May', attendance: 1200 },
    { month: 'Jun', attendance: 1150 }
  ];

  const sacramentStats = [
    { type: 'Bautismos', count: 45, color: 'bg-blue-500' },
    { type: 'Matrimonios', count: 12, color: 'bg-pink-500' },
    { type: 'Confirmaciones', count: 28, color: 'bg-purple-500' },
    { type: 'Primera Comunión', count: 34, color: 'bg-green-500' }
  ];

  const revenueBySource = [
    { source: 'Intenciones de Misa', amount: 980000, percentage: 40 },
    { source: 'Sacramentos', amount: 735000, percentage: 30 },
    { source: 'Donaciones', amount: 490000, percentage: 20 },
    { source: 'Eventos', amount: 245000, percentage: 10 }
  ];

  const volunteerParticipation = [
    { role: 'Sacristán', count: 8 },
    { role: 'Lector', count: 12 },
    { role: 'Coro', count: 15 },
    { role: 'Catequista', count: 6 },
    { role: 'Monaguillo', count: 10 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  if (!hasRole(['priest', 'parish_admin'])) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceso Restringido</h2>
        <p className="text-slate-600">No tienes permisos para ver las analíticas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analíticas Parroquiales</h1>
          <p className="text-slate-600 mt-1">Métricas y estadísticas de la comunidad</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          <button
            onClick={handleExportData}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Exportar Datos
          </button>
          <button
            onClick={handleGenerateReport}
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Feligreses</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalParishioners.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className={`flex items-center text-sm ${
            stats.trends.parishioners.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{stats.trends.parishioners.isPositive ? '+' : ''}{stats.trends.parishioners.value}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Misas Activas</p>
              <p className="text-3xl font-bold text-slate-900">{stats.activeMasses}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <div className={`flex items-center text-sm ${
            stats.trends.masses.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{stats.trends.masses.isPositive ? '+' : ''}{stats.trends.masses.value}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Intenciones</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalIntentions}</p>
            </div>
            <Heart className="h-8 w-8 text-amber-600" />
          </div>
          <div className={`flex items-center text-sm ${
            stats.trends.intentions.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{stats.trends.intentions.isPositive ? '+' : ''}{stats.trends.intentions.value}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Sacramentos</p>
              <p className="text-3xl font-bold text-slate-900">{stats.completedSacraments}</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
          <div className={`flex items-center text-sm ${
            stats.trends.sacraments.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{stats.trends.sacraments.isPositive ? '+' : ''}{stats.trends.sacraments.value}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Voluntarios</p>
              <p className="text-3xl font-bold text-slate-900">{stats.activeVolunteers}</p>
            </div>
            <HandHeart className="h-8 w-8 text-pink-600" />
          </div>
          <div className={`flex items-center text-sm ${
            stats.trends.volunteers.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{stats.trends.volunteers.isPositive ? '+' : ''}{stats.trends.volunteers.value}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Ingresos</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className={`flex items-center text-sm ${
            stats.trends.revenue.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{stats.trends.revenue.isPositive ? '+' : ''}{stats.trends.revenue.value}% vs mes anterior</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mass Attendance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Asistencia a Misas</h3>
          <div className="space-y-4">
            {massAttendance.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${(data.attendance / 1200) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-900 w-16 text-right">
                  {data.attendance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sacraments Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribución de Sacramentos</h3>
          <div className="space-y-4">
            {sacramentStats.map((sacrament, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${sacrament.color}`}></div>
                  <span className="text-sm text-slate-600">{sacrament.type}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">{sacrament.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue and Volunteer Participation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ingresos por Fuente</h3>
          <div className="space-y-4">
            {revenueBySource.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{source.source}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatCurrency(source.amount)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Participation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Participación de Voluntarios</h3>
          <div className="space-y-4">
            {volunteerParticipation.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{role.role}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-amber-600 h-2 rounded-full" 
                      style={{ width: `${(role.count / 15) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-6 text-right">
                    {role.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen de Actividad Reciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
            <div className="text-sm text-slate-600">Nuevos feligreses este mes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">156</div>
            <div className="text-sm text-slate-600">Intenciones procesadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
            <div className="text-sm text-slate-600">Sacramentos completados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;