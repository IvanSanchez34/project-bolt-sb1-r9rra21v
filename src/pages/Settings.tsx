import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Phone, MapPin, Globe, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { hasRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'parish' | 'notifications' | 'security' | 'system'>('parish');
  const [loading, setLoading] = useState(false);

  // Mock parish data - replace with real data from Supabase
  const [parishSettings, setParishSettings] = useState({
    name: 'Parroquia San Miguel Arcángel',
    address: 'Calle 45 #23-67, Centro, Bucaramanga',
    phone: '+57 7 634 5678',
    email: 'info@sanmiguel.com',
    website: 'https://sanmiguel.com',
    pastor: 'Fr. Miguel Rodriguez',
    mass_intention_price: 25000,
    timezone: 'America/Bogota',
    language: 'es'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    mass_reminders: true,
    intention_confirmations: true,
    sacrament_updates: true,
    volunteer_assignments: true,
    payment_notifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    require_2fa: false,
    password_expiry_days: 90,
    max_login_attempts: 5,
    session_timeout_minutes: 60,
    require_password_change: false
  });

  const handleSaveParishSettings = async () => {
    setLoading(true);
    try {
      // Save parish settings to Supabase
      console.log('Saving parish settings:', parishSettings);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuración de la parroquia guardada exitosamente');
    } catch (error) {
      console.error('Error saving parish settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    try {
      // Save notification settings to Supabase
      console.log('Saving notification settings:', notificationSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuración de notificaciones guardada exitosamente');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setLoading(true);
    try {
      // Save security settings to Supabase
      console.log('Saving security settings:', securitySettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuración de seguridad guardada exitosamente');
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      console.log('Creando respaldo de la base de datos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Respaldo creado exitosamente');
    } catch (error) {
      toast.error('Error al crear el respaldo');
    }
  };

  const handleCheckUpdates = async () => {
    try {
      console.log('Buscando actualizaciones...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info('El sistema está actualizado');
    } catch (error) {
      toast.error('Error al buscar actualizaciones');
    }
  };

  const handleViewLogs = () => {
    try {
      console.log('Abriendo logs del sistema...');
      toast.info('Abriendo logs del sistema...');
    } catch (error) {
      toast.error('Error al acceder a los logs');
    }
  };
  if (!hasRole(['priest', 'secretary', 'parish_admin'])) {
    return (
      <div className="text-center py-12">
        <SettingsIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceso Restringido</h2>
        <p className="text-slate-600">No tienes permisos para ver la configuración del sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
        <p className="text-slate-600 mt-1">Administra la configuración de la parroquia y el sistema</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('parish')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'parish'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <MapPin className="h-4 w-4 inline mr-2" />
              Parroquia
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notificaciones
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Seguridad
            </button>
            {hasRole(['parish_admin']) && (
              <button
                onClick={() => setActiveTab('system')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'system'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Database className="h-4 w-4 inline mr-2" />
                Sistema
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'parish' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información de la Parroquia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre de la Parroquia
                    </label>
                    <input
                      type="text"
                      value={parishSettings.name}
                      onChange={(e) => setParishSettings({...parishSettings, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Párroco
                    </label>
                    <input
                      type="text"
                      value={parishSettings.pastor}
                      onChange={(e) => setParishSettings({...parishSettings, pastor: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={parishSettings.address}
                      onChange={(e) => setParishSettings({...parishSettings, address: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={parishSettings.phone}
                      onChange={(e) => setParishSettings({...parishSettings, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={parishSettings.email}
                      onChange={(e) => setParishSettings({...parishSettings, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      value={parishSettings.website}
                      onChange={(e) => setParishSettings({...parishSettings, website: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Precio Intención de Misa (COP)
                    </label>
                    <input
                      type="number"
                      value={parishSettings.mass_intention_price}
                      onChange={(e) => setParishSettings({...parishSettings, mass_intention_price: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Zona Horaria
                    </label>
                    <select
                      value={parishSettings.timezone}
                      onChange={(e) => setParishSettings({...parishSettings, timezone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="America/Bogota">América/Bogotá (GMT-5)</option>
                      <option value="America/Caracas">América/Caracas (GMT-4)</option>
                      <option value="America/Lima">América/Lima (GMT-5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={parishSettings.language}
                      onChange={(e) => setParishSettings({...parishSettings, language: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSaveParishSettings}
                    disabled={loading}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Guardando...' : 'Guardar Configuración'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuración de Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Notificaciones por Email</h4>
                      <p className="text-sm text-slate-600">Recibir notificaciones por correo electrónico</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_notifications}
                        onChange={(e) => setNotificationSettings({...notificationSettings, email_notifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Notificaciones SMS</h4>
                      <p className="text-sm text-slate-600">Recibir notificaciones por mensaje de texto</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.sms_notifications}
                        onChange={(e) => setNotificationSettings({...notificationSettings, sms_notifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Recordatorios de Misa</h4>
                      <p className="text-sm text-slate-600">Notificar sobre próximas misas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.mass_reminders}
                        onChange={(e) => setNotificationSettings({...notificationSettings, mass_reminders: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Confirmaciones de Intenciones</h4>
                      <p className="text-sm text-slate-600">Notificar cuando se confirmen intenciones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.intention_confirmations}
                        onChange={(e) => setNotificationSettings({...notificationSettings, intention_confirmations: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Actualizaciones de Sacramentos</h4>
                      <p className="text-sm text-slate-600">Notificar cambios en solicitudes de sacramentos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.sacrament_updates}
                        onChange={(e) => setNotificationSettings({...notificationSettings, sacrament_updates: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Asignaciones de Voluntarios</h4>
                      <p className="text-sm text-slate-600">Notificar sobre nuevas asignaciones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.volunteer_assignments}
                        onChange={(e) => setNotificationSettings({...notificationSettings, volunteer_assignments: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Notificaciones de Pagos</h4>
                      <p className="text-sm text-slate-600">Notificar sobre pagos recibidos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.payment_notifications}
                        onChange={(e) => setNotificationSettings({...notificationSettings, payment_notifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSaveNotificationSettings}
                    disabled={loading}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Guardando...' : 'Guardar Configuración'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuración de Seguridad</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Autenticación de Dos Factores</h4>
                      <p className="text-sm text-slate-600">Requerir verificación adicional para iniciar sesión</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.require_2fa}
                        onChange={(e) => setSecuritySettings({...securitySettings, require_2fa: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expiración de Contraseña (días)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.password_expiry_days}
                        onChange={(e) => setSecuritySettings({...securitySettings, password_expiry_days: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Máximo Intentos de Login
                      </label>
                      <input
                        type="number"
                        value={securitySettings.max_login_attempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, max_login_attempts: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tiempo de Sesión (minutos)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.session_timeout_minutes}
                        onChange={(e) => setSecuritySettings({...securitySettings, session_timeout_minutes: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">Forzar Cambio de Contraseña</h4>
                      <p className="text-sm text-slate-600">Requerir que todos los usuarios cambien su contraseña</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.require_password_change}
                        onChange={(e) => setSecuritySettings({...securitySettings, require_password_change: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSaveSecuritySettings}
                    disabled={loading}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Guardando...' : 'Guardar Configuración'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && hasRole(['parish_admin']) && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuración del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Base de Datos</h4>
                    <p className="text-sm text-slate-600 mb-4">Estado de la conexión y respaldo</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Estado:</span>
                        <span className="text-sm text-green-600">Conectado</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Último respaldo:</span>
                        <span className="text-sm">Hace 2 horas</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      <span onClick={handleCreateBackup}>Crear Respaldo</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Almacenamiento</h4>
                    <p className="text-sm text-slate-600 mb-4">Uso del espacio de archivos</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Usado:</span>
                        <span className="text-sm">2.4 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Disponible:</span>
                        <span className="text-sm">7.6 GB</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Logs del Sistema</h4>
                    <p className="text-sm text-slate-600 mb-4">Registros de actividad</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Errores hoy:</span>
                        <span className="text-sm text-red-600">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Advertencias:</span>
                        <span className="text-sm text-yellow-600">2</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                      <span onClick={handleViewLogs}>Ver Logs</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Versión del Sistema</h4>
                    <p className="text-sm text-slate-600 mb-4">Información de la aplicación</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Versión:</span>
                        <span className="text-sm">v1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Última actualización:</span>
                        <span className="text-sm">15/01/2024</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      <span onClick={handleCheckUpdates}>Buscar Actualizaciones</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;