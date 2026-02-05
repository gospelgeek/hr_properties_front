import React from 'react';
import { markNotificationAsRead, deleteNotification } from '../../api/finance.api';
import toast from 'react-hot-toast';

const NotificationCard = ({ notification, onUpdate }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'obligation_due':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rental_ending':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markNotificationAsRead(notification.id);
      toast.success('Notificación marcada como leída');
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al marcar como leída');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification.id);
      toast.success('Notificación eliminada');
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar notificación');
    }
  };

  return (
    <div className={`border-l-4 ${getPriorityColor(notification.priority)} p-4 rounded-r-lg mb-3 ${!notification.is_read ? 'shadow-sm' : 'opacity-75'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${notification.priority === 'high' ? 'text-red-600' : notification.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'}`}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(notification.created_at).toLocaleString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!notification.is_read && (
            <button
              onClick={handleMarkAsRead}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Marcar como leída"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
