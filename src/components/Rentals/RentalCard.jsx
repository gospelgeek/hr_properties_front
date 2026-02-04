import React from 'react';
import { useNavigate } from 'react-router-dom';

const RentalCard = ({ rental, propertyId }) => {
  const navigate = useNavigate();

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

  const getStatus = () => {
    const today = new Date();
    const checkOut = new Date(rental.check_out);
    const diffDays = Math.ceil((checkOut - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Finalizado', color: 'bg-gray-100 text-gray-800' };
    if (diffDays <= 15) return { text: 'Próximo a finalizar', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Activo', color: 'bg-green-100 text-green-800' };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {rental.tenant_name || 'Inquilino'}
            </h3>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {rental.rental_type === 'monthly' ? 'Arriendo Mensual' : 'Airbnb'}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Check-in:</span>
          <span className="font-medium text-gray-900">{formatDate(rental.check_in)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Check-out:</span>
          <span className="font-medium text-gray-900">{formatDate(rental.check_out)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold text-green-600">{formatCurrency(rental.amount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">People:</span>
          <span className="font-medium text-gray-900">{rental.people_count}</span>
        </div>

        {rental.rental_type === 'monthly' && rental.monthly_data && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Deposit:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(rental.monthly_data.deposit_amount)}
                {rental.monthly_data.is_refundable && (
                  <span className="ml-2 text-xs text-green-600">(Refundable)</span>
                )}
              </span>
            </div>
          </div>
        )}

        {rental.rental_type === 'airbnb' && rental.airbnb_data && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`font-medium ${rental.airbnb_data.is_paid ? 'text-green-600' : 'text-red-600'}`}>
                {rental.airbnb_data.is_paid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/property/${propertyId}/rentals/${rental.id}`)}
        className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2 text-sm font-medium"
      >
        View Details and Payments
      </button>
    </div>
  );
};

export default RentalCard;
