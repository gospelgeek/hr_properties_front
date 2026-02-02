import React from 'react';
import { useNavigate } from 'react-router-dom';

const ObligationCard = ({ obligation, propertyId }) => {
  const navigate = useNavigate();
  
  const totalPaid = obligation.total_paid || 0;
  const totalAmount = obligation.amount || 0;
  const pending = totalAmount - totalPaid;
  const isCompleted = pending <= 0;
  const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(obligation.due_date);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0 && !isCompleted;
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7 && !isCompleted;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {obligation.obligation_type_name || 'Obligación'}
          </h3>
          <p className="text-sm text-gray-600">{obligation.entity_name}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          isCompleted ? 'bg-green-100 text-green-800' :
          isOverdue ? 'bg-red-100 text-red-800' :
          isDueSoon ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {isCompleted ? 'Pagada' : isOverdue ? 'Vencida' : isDueSoon ? 'Por vencer' : 'Pendiente'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Monto total:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Pagado:</span>
          <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Pendiente:</span>
          <span className="font-semibold text-red-600">{formatCurrency(pending)}</span>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Fecha de vencimiento:</span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-900'}`}>
            {formatDate(obligation.due_date)}
          </span>
        </div>

        {(isOverdue || isDueSoon) && (
          <div className={`text-xs ${isOverdue ? 'text-red-600' : 'text-yellow-600'} font-medium`}>
            {isOverdue ? `Vencida hace ${Math.abs(daysUntilDue)} días` : `Vence en ${daysUntilDue} días`}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(propertyId ? `/property/${propertyId}/obligations/${obligation.id}` : `/obligations/${obligation.id}`)}
        className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2 text-sm font-medium"
      >
        Ver detalles y pagos
      </button>
    </div>
  );
};

export default ObligationCard;
