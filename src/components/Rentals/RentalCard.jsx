import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RentalCard = ({ rental, propertyId }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

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
    // Si no hay tenant, la propiedad está disponible
    if (!rental.tenant || !rental.check_out) {
      return { text: 'Available', color: 'bg-blue-100 text-blue-800' };
    }

    const today = new Date();
    const checkOut = new Date(rental.check_out);
    const diffDays = Math.ceil((checkOut - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Finished', color: 'bg-gray-100 text-gray-800' };
    if (diffDays <= 15) return { text: 'Ending Soon', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {rental.tenant ? (rental.tenant.name || rental.tenant_name || 'Tenant') : 'No Tenant'}
            </h3>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {rental.rental_type === 'monthly' ? 'Monthly Rent' : 'Airbnb'} 
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {rental.check_in && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium text-gray-900">{formatDate(rental.check_in)}</span>
          </div>
        )}
        {rental.check_out && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium text-gray-900">{formatDate(rental.check_out)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold text-green-600">{formatCurrency(rental.amount)}</span>
        </div>
        {rental.people_count && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">People:</span>
            <span className="font-medium text-gray-900">{rental.people_count}</span>
          </div>
        )}

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
          <div className="pt-2 border-t border-gray-200 space-y-2">
            {rental.airbnb_data.deposit_amount && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Deposit:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(rental.airbnb_data.deposit_amount)}
                </span>
              </div>
            )}
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
        onClick={() => {
          // Admin navega con propertyId, cliente directo al rental
          const path = isAdmin() 
            ? `/property/${propertyId}/rentals/${rental.id}`
            : `/rentals/${rental.id}`;
          navigate(path);
        }}
        className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2 text-sm font-medium"
      >
        View Details and Payments
      </button>
    </div>
  );
};

export default RentalCard;
