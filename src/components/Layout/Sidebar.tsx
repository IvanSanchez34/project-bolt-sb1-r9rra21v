import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  Calendar,
  Heart,
  Award,
  BookOpen,
  HandHeart,
  BarChart3,
  Settings,
  LogOut,
  Church,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, signOut, hasRole } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard/',
      icon: Home,
      roles: ['priest', 'secretary', 'parish_admin'],
    },
    {
      name: 'Staff Management',
      href: '/dashboard/staff',
      icon: Users,
      roles: ['priest', 'secretary', 'parish_admin'],
    },
    {
      name: 'Masses',
      href: '/dashboard/masses',
      icon: Calendar,
      roles: ['priest', 'secretary', 'parish_admin'],
    },
    {
      name: 'Mass Intentions',
      href: '/dashboard/intentions',
      icon: Heart,
      roles: ['priest', 'secretary', 'parish_admin', 'parishioner'],
    },
    {
      name: 'Sacraments',
      href: '/dashboard/sacraments',
      icon: Award,
      roles: ['priest', 'secretary', 'parish_admin'],
    },
    {
      name: 'Catechesis',
      href: '/dashboard/catechesis',
      icon: BookOpen,
      roles: ['catechist'],
    },
    {
      name: 'Volunteers',
      href: '/dashboard/volunteers',
      icon: HandHeart,
      roles: ['volunteer'],
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      roles: ['priest', 'parish_admin'],
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      roles: ['priest', 'secretary', 'parish_admin'],
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Church className="h-8 w-8 text-amber-400" />
          <div>
            <h2 className="text-xl font-bold">ParishHub</h2>
            <p className="text-slate-400 text-sm">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems
            .filter(item => hasRole(item.roles as any))
            .map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.full_name}</p>
            <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 p-3 w-full rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;