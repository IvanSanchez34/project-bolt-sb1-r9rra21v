import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Church, Calendar, Heart, Award, Clock, MapPin, Phone, Mail, Users, BookOpen, Cross, Star, ChevronRight, Menu, X, Move as Dove, Crown, Shield } from 'lucide-react';
import LoginModal from '../components/Auth/LoginModal';
import RegisterModal from '../components/Auth/RegisterModal';

const HomePage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const massSchedule = [
    { day: 'Lunes - Viernes', time: '7:00 AM', type: 'Misa Diaria' },
    { day: 'Sábado', time: '6:00 PM', type: 'Misa Vespertina' },
    { day: 'Domingo', time: '8:00 AM, 10:00 AM, 12:00 PM, 6:00 PM', type: 'Misas Dominicales' },
  ];

  const sacramentRequirements = [
    {
      title: 'Bautismo',
      icon: Cross,
      requirements: [
        'Acta de nacimiento original',
        'Cédula de los padres',
        'Certificado de matrimonio religioso de los padres',
        'Carta de los padrinos',
        'Curso de preparación bautismal'
      ]
    },
    {
      title: 'Matrimonio',
      icon: Heart,
      requirements: [
        'Actas de bautismo recientes (máximo 6 meses)',
        'Cédulas de identidad',
        'Certificado de soltería',
        'Curso prematrimonial',
        'Examen médico prematrimonial'
      ]
    },
    {
      title: 'Confirmación',
      icon: Award,
      requirements: [
        'Acta de bautismo',
        'Cédula de identidad',
        'Curso de preparación (2 años)',
        'Carta del padrino/madrina',
        'Participación activa en la comunidad'
      ]
    }
  ];

  const nearbyParishes = [
    {
      name: 'Parroquia San Miguel Arcángel',
      address: 'Calle 45 #23-67, Centro',
      phone: '+57 7 634 5678',
      masses: 'Dom: 8AM, 10AM, 6PM',
      distance: '0.5 km'
    },
    {
      name: 'Parroquia Sagrado Corazón',
      address: 'Carrera 27 #34-12, Cabecera',
      phone: '+57 7 645 9876',
      masses: 'Dom: 9AM, 11AM, 7PM',
      distance: '2.1 km'
    },
    {
      name: 'Parroquia Nuestra Señora del Carmen',
      address: 'Calle 56 #45-23, García Rovira',
      phone: '+57 7 678 1234',
      masses: 'Dom: 7AM, 9AM, 5PM',
      distance: '3.2 km'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Church className="h-10 w-10 text-amber-300" />
                <Crown className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Parroquia San Miguel</h1>
                <p className="text-amber-200 text-sm">Arquidiócesis de Bucaramanga</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-amber-100 hover:text-white transition-colors font-medium">Inicio</a>
              <a href="#horarios" className="text-amber-100 hover:text-white transition-colors font-medium">Horarios</a>
              <a href="#sacramentos" className="text-amber-100 hover:text-white transition-colors font-medium">Sacramentos</a>
              <a href="#parroquias" className="text-amber-100 hover:text-white transition-colors font-medium">Parroquias</a>
              <a href="#contacto" className="text-amber-100 hover:text-white transition-colors font-medium">Contacto</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="text-amber-100 hover:text-white transition-colors font-medium"
              >
                Registrarse
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg font-medium"
              >
                Iniciar Sesión
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-amber-100 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-red-700">
              <div className="flex flex-col space-y-4">
                <a href="#inicio" className="text-amber-100 hover:text-white transition-colors font-medium">Inicio</a>
                <a href="#horarios" className="text-amber-100 hover:text-white transition-colors font-medium">Horarios</a>
                <a href="#sacramentos" className="text-amber-100 hover:text-white transition-colors font-medium">Sacramentos</a>
                <a href="#parroquias" className="text-amber-100 hover:text-white transition-colors font-medium">Parroquias</a>
                <a href="#contacto" className="text-amber-100 hover:text-white transition-colors font-medium">Contacto</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-red-700">
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="text-left text-amber-100 hover:text-white transition-colors font-medium"
                  >
                    Registrarse
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-left bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-red-900 via-red-800 to-amber-900 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 opacity-10">
            <Cross className="h-32 w-32 text-amber-300" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10">
            <Dove className="h-24 w-24 text-white" />
          </div>
          <div className="absolute top-1/2 left-1/4 opacity-5">
            <Shield className="h-40 w-40 text-amber-400" />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Crown className="h-16 w-16 text-amber-300 mx-auto mb-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent">
            Bienvenidos a Nuestra Parroquia
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto leading-relaxed">
            Un lugar sagrado de fe, esperanza y comunidad en el corazón de Bucaramanga, 
            donde cada alma encuentra paz y cada corazón halla su hogar espiritual
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-xl transform hover:scale-105"
            >
              <Heart className="inline h-5 w-5 mr-2" />
              Solicitar Intención de Misa
            </button>
            <a
              href="#horarios"
              className="border-2 border-amber-300 text-amber-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-300 hover:text-red-900 transition-all duration-200 shadow-xl transform hover:scale-105"
            >
              <Calendar className="inline h-5 w-5 mr-2" />
              Ver Horarios de Misa
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Cross className="h-12 w-12 text-red-800 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-red-900 mb-4">Nuestros Servicios Sagrados</h2>
            <p className="text-xl text-red-700 max-w-2xl mx-auto">Acompañamos a nuestra comunidad en todos los momentos importantes de la vida cristiana</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-red-600 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-red-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <Heart className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-3 text-center">Intenciones de Misa</h3>
              <p className="text-red-700 mb-6 text-center">Solicita intenciones para tus seres queridos</p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-full font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center"
              >
                Solicitar <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-amber-600 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-100 to-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <Award className="h-8 w-8 text-amber-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-3 text-center">Sacramentos</h3>
              <p className="text-red-700 mb-6 text-center">Bautismo, matrimonio, confirmación y más</p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-full font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 flex items-center justify-center"
              >
                Solicitar <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-3 text-center">Catequesis</h3>
              <p className="text-red-700 mb-6 text-center">Formación religiosa para niños y adultos</p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center"
              >
                Ver Información <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-600 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-3 text-center">Voluntariado</h3>
              <p className="text-red-700 mb-6 text-center">Únete a nuestra comunidad de servicio</p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-full font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center"
              >
                Registrarse <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mass Schedule Section */}
      <section id="horarios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Clock className="h-12 w-12 text-red-800 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-red-900 mb-4">Horarios de Misa</h2>
            <p className="text-xl text-red-700">Únete a nosotros en la celebración eucarística</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {massSchedule.map((schedule, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-amber-50 p-8 rounded-2xl shadow-lg border border-red-100">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-red-600 to-amber-600 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-900">{schedule.day}</h3>
                </div>
                <p className="text-3xl font-bold text-amber-700 mb-3">{schedule.time}</p>
                <p className="text-red-700 text-lg">{schedule.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacraments Section */}
      <section id="sacramentos" className="py-20 bg-gradient-to-br from-amber-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Award className="h-12 w-12 text-red-800 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-red-900 mb-4">Requisitos para Sacramentos</h2>
            <p className="text-xl text-red-700">Información necesaria para cada sacramento</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sacramentRequirements.map((sacrament, index) => {
              const Icon = sacrament.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-600">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-br from-red-100 to-amber-100 p-4 rounded-full mr-4">
                      <Icon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-900">{sacrament.title}</h3>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {sacrament.requirements.map((requirement, reqIndex) => (
                      <li key={reqIndex} className="flex items-start">
                        <Star className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-red-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-full font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
                  >
                    Ver Requisitos
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Parishes Section */}
      <section id="parroquias" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Church className="h-12 w-12 text-red-800 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-red-900 mb-4">Parroquias Cercanas</h2>
            <p className="text-xl text-red-700">Encuentra la parroquia más cercana a ti</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {nearbyParishes.map((parish, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-amber-50 p-6 rounded-2xl shadow-lg border border-red-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-red-900">{parish.name}</h3>
                    <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {parish.distance}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-red-700">
                      <MapPin className="h-5 w-5 mr-3 text-red-600" />
                      <span>{parish.address}</span>
                    </div>
                    <div className="flex items-center text-red-700">
                      <Phone className="h-5 w-5 mr-3 text-red-600" />
                      <span>{parish.phone}</span>
                    </div>
                    <div className="flex items-center text-red-700">
                      <Clock className="h-5 w-5 mr-3 text-red-600" />
                      <span>{parish.masses}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="h-96 bg-white rounded-xl overflow-hidden shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0!2d-73.1198!3d7.1193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDcnMDkuNSJOIDczwrAwNycxMS4zIlc!5e0!3m2!1ses!2sco!4v1609459200000!5m2!1ses!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de Parroquias en Bucaramanga"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Phone className="h-12 w-12 text-amber-300 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Contacto</h2>
            <p className="text-xl text-amber-100">Estamos aquí para servirte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dirección</h3>
              <p className="text-amber-100">Calle 45 #23-67<br />Centro, Bucaramanga</p>
            </div>

            <div className="text-center bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <Phone className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Teléfono</h3>
              <p className="text-amber-100">+57 7 634 5678<br />+57 300 123 4567</p>
            </div>

            <div className="text-center bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <Mail className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email</h3>
              <p className="text-amber-100">info@sanmiguel.com<br />parroco@sanmiguel.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="relative">
                <Church className="h-8 w-8 text-amber-400" />
                <Crown className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-lg">Parroquia San Miguel - Arquidiócesis de Bucaramanga</span>
            </div>
            <p className="text-amber-200 text-sm">
              © 2025 Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </div>
  );
};

export default HomePage;