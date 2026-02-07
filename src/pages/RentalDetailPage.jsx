import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import PaymentForm from '../components/Finance/PaymentForm';
import { 
  getPropertyRental, 
  addPaymentToRental, 
  getRentalPayments,
  deleteRentalPayment 
} from '../api/rentals.api';
import { getProperty } from '../api/properties.api';

const RentalDetailPage = () => {
  const { id, rentalId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rental, setRental] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [id, rentalId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propData, rentalData, paymentsData] = await Promise.all([
        getProperty(id),
        getPropertyRental(id, rentalId),
        getRentalPayments(id, rentalId)
      ]);
      setProperty(propData);
      setRental(rentalData);
      console.log('rentalData:', rentalData);
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.results || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading rental');
      navigate(`/property/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (data) => {
    try {
      setIsSubmitting(true);
      // Construir FormData para enviar archivo
      const formData = new FormData();
      formData.append('payment_location', data.payment_location);
      formData.append('payment_method', data.payment_method);
      formData.append('amount', data.amount);
      formData.append('date', data.date);
      if (data.voucher_url && data.voucher_url.length > 0) {
        formData.append('voucher_url', data.voucher_url[0]);
      }
      await addPaymentToRental(id, rentalId, formData);
      toast.success('Payment added successfully');
      setShowPaymentForm(false);
      loadData();
    } catch (error) {
      console.error('Error adding payment:', error);
      console.log('Error response data:', error.response);
      toast.error(error.response?.data?.detail || 'Error adding payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      await deleteRentalPayment(id, rentalId, paymentId);
      toast.success('Payment deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Error deleting payment');
    }
  };

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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loader />;
  if (!rental) return null;

  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const pending = rental.amount - totalPaid;
  const isCompleted = pending <= 0;

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/property/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la propiedad
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Rental Detail</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Property: <span className="font-semibold">{property?.name || property?.address}</span>
        </p>
      </div>

      {/* Rental Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {rental.tenant.name|| 'Tenant'}
            </h2>
            <p className="text-gray-600">
              {rental.rental_type === 'monthly' ? 'Monthly Rental' : 'Airbnb'}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Check-in</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(rental.check_in)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Check-out</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(rental.check_out)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(rental.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Number of People</p>
            <p className="text-lg font-semibold text-gray-900">{rental.people_count}</p>
          </div>
        </div>

        {rental.rental_type === 'monthly' && rental.monthly_data && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Monthly Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Deposit</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(rental.monthly_data.deposit_amount)}
                  {rental.monthly_data.is_refundable && (
                    <span className="ml-2 text-sm text-green-600">(Refundable)</span>
                  )}
                </p>
              </div>
              {rental.monthly_data.url_files && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Files</p>
                  <a 
                    href={rental.monthly_data.url_files} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Files
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {rental.rental_type === 'airbnb' && rental.airbnb_data && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Airbnb Information</h3>
            <p className="text-sm text-gray-600">
              Payment Status: 
              <span className={`ml-2 font-semibold ${rental.airbnb_data.is_paid ? 'text-green-600' : 'text-red-600'}`}>
                {rental.airbnb_data.is_paid ? 'Paid' : 'Pending'}
              </span>
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Payment Status</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(totalPaid)} / {formatCurrency(rental.amount)}
            </p>
          </div>
          {pending > 0 && (
            <p className="text-sm text-red-600 font-medium">
              Pending: {formatCurrency(pending)}
            </p>
          )}
        </div>
      </div>

      {/* Payment Form */}
      {!isCompleted && status.text !== 'Completed' && (
        <div className="mb-6">
          {showPaymentForm ? (
            <div>
              <PaymentForm 
                onSubmit={handleAddPayment} 
                isLoading={isSubmitting}
                maxAmount={pending}
              />
              <button
                onClick={() => setShowPaymentForm(false)}
                className="mt-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-3 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Payment
            </button>
          )}
        </div>
      )}

      {/* Lista de Pagos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment History ({payments.length})
        </h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600">No payments recorded</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {payment.payment_method_name || 'Payment Method'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Date: {formatDate(payment.date)}
                    </p>
                    {payment.voucher_url && (
                      <a 
                        href={payment.voucher_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Voucher
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePayment(payment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Payment"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalDetailPage;
