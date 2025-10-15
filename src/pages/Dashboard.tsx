import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/Dashboard/StatsCard';
import {
  Users,
  Calendar,
  Heart,
  Award,
  BookOpen,
  HandHeart,
  TrendingUp,
  Clock,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.full_name}`;
  };

  const getRoleBasedStats = () => {
    const baseStats = [
      {
        title: 'Total Parishioners',
        value: '1,234',
        icon: Users,
        trend: { value: 5.2, isPositive: true },
        color: 'blue' as const,
      },
      {
        title: 'Upcoming Masses',
        value: '12',
        icon: Calendar,
        color: 'green' as const,
      },
      {
        title: 'Pending Intentions',
        value: '8',
        icon: Heart,
        color: 'amber' as const,
      },
      {
        title: 'Active Volunteers',
        value: '45',
        icon: HandHeart,
        trend: { value: 2.1, isPositive: true },
        color: 'purple' as const,
      },
    ];

    if (hasRole(['priest', 'parish_admin'])) {
      return [
        ...baseStats,
        {
          title: 'Sacraments This Month',
          value: '23',
          icon: Award,
          trend: { value: 8.3, isPositive: true },
          color: 'green' as const,
        },
        {
          title: 'Catechesis Students',
          value: '156',
          icon: BookOpen,
          color: 'blue' as const,
        },
      ];
    }

    return baseStats;
  };

  const getRecentActivities = () => {
    return [
      {
        id: 1,
        action: 'New mass intention submitted',
        user: 'Maria González',
        time: '5 minutes ago',
        type: 'intention',
      },
      {
        id: 2,
        action: 'Volunteer confirmed for Sunday mass',
        user: 'Juan Pérez',
        time: '1 hour ago',
        type: 'volunteer',
      },
      {
        id: 3,
        action: 'Baptism certificate requested',
        user: 'Carmen López',
        time: '2 hours ago',
        type: 'sacrament',
      },
      {
        id: 4,
        action: 'Catechesis attendance recorded',
        user: 'Fr. Rodriguez',
        time: '3 hours ago',
        type: 'catechesis',
      },
    ];
  };

  const getUpcomingEvents = () => {
    return [
      {
        id: 1,
        title: 'Sunday Mass',
        date: 'Today, 10:00 AM',
        celebrant: 'Fr. Rodriguez',
        location: 'Main Church',
      },
      {
        id: 2,
        title: 'Children\'s Catechesis',
        date: 'Tomorrow, 4:00 PM',
        celebrant: 'Sister Maria',
        location: 'Parish Hall',
      },
      {
        id: 3,
        title: 'Marriage Ceremony',
        date: 'Saturday, 6:00 PM',
        celebrant: 'Fr. Rodriguez',
        location: 'Main Church',
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
        <p className="opacity-90 mt-1">
          {hasRole('priest') && 'Welcome to your parish management dashboard.'}
          {hasRole('secretary') && 'Here\'s your parish administration overview.'}
          {hasRole('catechist') && 'Manage your catechesis activities here.'}
          {hasRole('volunteer') && 'Check your volunteer assignments and schedule.'}
          {hasRole('parish_admin') && 'Complete parish management at your fingertips.'}
          {hasRole('parishioner') && 'Access your parish services and information.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRoleBasedStats().map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activities</h2>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {getRecentActivities().map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.user}</p>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Events</h2>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {getUpcomingEvents().map((event) => (
              <div key={event.id} className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="font-semibold text-slate-900">{event.title}</h3>
                <p className="text-sm text-slate-600">{event.date}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                  <span>Celebrant: {event.celebrant}</span>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{getWelcomeMessage()}</h1>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => navigate('/dashboard/intentions')}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Nueva Intención
              </button>
              <button
                onClick={() => navigate('/dashboard/sacraments')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Solicitar Sacramento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;