import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import PaymentForm from '../components/Finance/PaymentForm';
import { 
  getPropertyObligation, 
  addPaymentToObligation, 
  getObligationPayments,
  deleteObligationPayment 
} from '../api/finance.api';
import { getProperty } from '../api/properties.api';

const ObligationDetailPage = () => {
  const { id, obligationId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [obligation, setObligation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [id, obligationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propData, oblData, paymentsData] = await Promise.all([
        getProperty(id),
        getPropertyObligation(id, obligationId),
        getObligationPayments(id, obligationId)
      ]);
      setProperty(propData);
      setObligation(oblData);
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.results || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar la obligación');
      navigate(`/property/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (data) => {
    try {
      setIsSubmitting(true);
      await addPaymentToObligation(id, obligationId, data);
      toast.success('Pago agregado correctamente');
      setShowPaymentForm(false);
      loadData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Error al agregar pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!confirm('¿Estás seguro de eliminar este pago?')) return;
    
    try {
      await deleteObligationPayment(id, obligationId, paymentId);
      toast.success('Pago eliminado correctamente');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar pago');
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
  if (!obligation) return null;

  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const pending = obligation.amount - totalPaid;
  const isCompleted = pending <= 0;
  const progress = obligation.amount > 0 ? (totalPaid / obligation.amount) * 100 : 0;

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Detalle de Obligación</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Propiedad: <span className="font-semibold">{property?.name || property?.address}</span>
        </p>
      </div>

      {/* Información de la Obligación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {obligation.obligation_type_name || 'Obligación'}
            </h2>
            <p className="text-gray-600">{obligation.entity_name}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isCompleted ? 'Pagada' : 'Pendiente'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Monto Total</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(obligation.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Fecha de Vencimiento</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(obligation.due_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pendiente</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(pending)}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Progreso de Pago</p>
            <p className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Periodicidad:</span> {obligation.temporality}
          </p>
        </div>
      </div>

      {/* Formulario de Pago */}
      {!isCompleted && (
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
                Cancelar
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
              Agregar Pago
            </button>
          )}
        </div>
      )}

      {/* Lista de Pagos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historial de Pagos ({payments.length})
        </h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600">No hay pagos registrados</p>
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
                        {payment.payment_method_name || 'Pago'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Fecha: {formatDate(payment.date)}
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
                        Ver comprobante
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePayment(payment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar pago"
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

export default ObligationDetailPage;
