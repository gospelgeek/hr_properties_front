import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import NotificationCard from '../components/Finance/NotificationCard';
import { getNotifications, markAllNotificationsAsRead } from '../api/finance.api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unread');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter === 'unread') {
        params.is_read = false;
      } else if (filter === 'read') {
        params.is_read = true;
      }
      
      const data = await getNotifications(params);
      setNotifications(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      toast.error('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      toast.success('Todas las notificaciones marcadas como leídas');
      loadNotifications();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al marcar notificaciones');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
          <p className="text-sm sm:text-base text-gray-600">Alertas y recordatorios del sistema</p>
        </div>
        {notifications.length > 0 && filter === 'unread' && (
          <button
            onClick={handleMarkAllAsRead}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-4 py-2 text-sm font-medium"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          No leídas
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'read'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Leídas
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? 'No tienes notificaciones sin leer' 
              : filter === 'read'
              ? 'No hay notificaciones leídas'
              : 'No hay notificaciones disponibles'}
          </p>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onUpdate={loadNotifications}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
