import React from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleObligationCard = ({ obligation, vehicleId }) => {
  const navigate = useNavigate();

  const totalAmount = Number(obligation?.amount || 0);
  const totalPaid = Number(obligation?.total_paid || 0);
  const pending = Number(obligation?.pending || Math.max(totalAmount - totalPaid, 0));
  const isCompleted = Boolean(obligation?.is_fully_paid) || pending <= 0;
  const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {obligation.obligation_type_name
              ? String(obligation.obligation_type_name).charAt(0).toUpperCase() + String(obligation.obligation_type_name).slice(1)
              : 'Obligation'}
          </h3>
          <p className="text-sm text-gray-600">
            {obligation.entity_name} - {String(obligation.temporality || '').replace('_', ' ')}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {isCompleted ? 'Paid' : 'Pending'}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Paid:</span>
          <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pending:</span>
          <span className="font-semibold text-red-600">{formatCurrency(pending)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/vehicles/${vehicleId}/obligations/${obligation.id}`)}
        className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2 text-sm font-medium"
      >
        View Details and Payments
      </button>
    </div>
  );
};

export default VehicleObligationCard;
