import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { X, Mail, Lock, Eye, EyeOff, User, Phone, Church } from 'lucide-react';
import { toast } from 'react-toastify';
import { UserRole } from '../../types';

const schema = yup.object({
  full_name: yup.string().required('El nombre completo es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  phone: yup.string().required('El teléfono es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña'),
  role: yup.string().required('Selecciona tu rol'),
});

type RegisterFormData = yup.InferType<typeof schema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);

      await signUp(data.email, data.password, {
        full_name: data.full_name,
        phone: data.phone,
        role: data.role as UserRole,
      });

      // Mensajes personalizados según rol
      const roleMessages: Record<string, string> = {
        parishioner: '¡Registro exitoso! Bienvenido a la comunidad parroquial.',
        volunteer: '¡Gracias por ser voluntario! Tu cuenta ha sido creada exitosamente.',
        catechist: '¡Gracias por tu interés en ser catequista! Tu solicitud está en revisión por el administrador parroquial.',
      };

      toast.success(roleMessages[data.role] || 'Registro exitoso.');

      // Redirección según rol
      setTimeout(() => {
        if (data.role === 'catechist') {
          window.location.href = '/dashboard/pending-approval';
        } else if (data.role === 'parishioner') {
          window.location.href = '/dashboard/intentions';
        } else {
          window.location.href = '/dashboard/volunteers';
        }
      }, 500);

      onClose();
      reset();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Error al registrarse. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Church className="h-8 w-8 text-amber-400" />
                <span className="font-bold text-lg">Registro de Usuario</span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input {...register('full_name')} type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Tu nombre completo" />
                {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input {...register('email')} type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="tu@email.com" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input {...register('phone')} type="tel" className="w-full px-4 py-2 border rounded-lg" placeholder="+57 300 123 4567" />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">¿Cómo deseas participar?</label>
                <select {...register('role')} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Selecciona una opción</option>
                  <option value="parishioner">Feligrés (Intenciones, Sacramentos)</option>
                  <option value="volunteer">Voluntario (Servicio comunitario)</option>
                  <option value="catechist">Catequista (Enseñanza religiosa)</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input {...register('password')} type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="Contraseña" />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                <input {...register('confirmPassword')} type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="Confirma tu contraseña" />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <button onClick={onClose} className="text-amber-600 hover:text-amber-500 font-medium">Inicia sesión</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
