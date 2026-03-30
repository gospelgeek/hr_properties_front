import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import PaymentForm from '../components/Finance/PaymentForm';
import PaymentEditModal from '../components/Finance/PaymentEditModal';
import ObligationEditModal from '../components/Finance/ObligationEditModal';
import { 
  getPropertyObligation,
  getObligation,
  addPaymentToObligation, 
  getObligationPayments,
  deleteObligationPayment,
  updatePropertyObligation,
  updateObligationPayment
} from '../api/finance.api';
import { getProperty, openProtectedMedia } from '../api/properties.api';

const getErrorMessage = (error, fallbackMessage) => {
  const payload = error?.response?.data;

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload?.error && typeof payload.error === 'string') {
    return payload.error;
  }

  if (payload && typeof payload === 'object') {
    const details = Object.entries(payload)
      .map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(', ')}`;
        }
        return `${field}: ${String(messages)}`;
      })
      .join(' | ');

    if (details) return details;
  }

  return error?.message || fallbackMessage;
};

const toCents = (value) => {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * 100);
};

const fromCents = (value) => value / 100;

const ObligationDetailPage = () => {
  const { id, obligationId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [obligation, setObligation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
const [editingObligation, setEditingObligation] = useState(null);
const [isSavingObligation, setIsSavingObligation] = useState(false);
const [editingPayment, setEditingPayment] = useState(null);
const [isSavingPayment, setIsSavingPayment] = useState(false);


  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // If we have propertyId, load property-specific obligation
      if (id) {
        const [propData, oblData, paymentsData] = await Promise.all([
          getProperty(id),
          getPropertyObligation(id, obligationId),
          getObligationPayments(id, obligationId)
        ]);
        setProperty(propData);
        setObligation(oblData);
        setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.results || []);
      } else {
        // Otherwise, load obligation directly and get property info from it
        const oblData = await getObligation(obligationId);
        setObligation(oblData);
        
        // Load property if obligation has property_id
        if (oblData.property) {
          const propData = await getProperty(oblData.property);
          setProperty(propData);
          
          // Load payments using the property ID from the obligation
          const paymentsData = await getObligationPayments(oblData.property, obligationId);
          setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.results || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(getErrorMessage(error, 'Error loading obligation details'));
      navigate(id ? `/property/${id}` : '/obligations');
    } finally {
      setLoading(false);
    }
  }, [id, obligationId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddPayment = async (data) => {
    try {
      setIsSubmitting(true);
      const propertyId = id || obligation.property;
      await addPaymentToObligation(propertyId, obligationId, data);
      //console.log('data enviada al backend para agregar pago:', data);
      toast.success('Payment added successfully');
      setShowPaymentForm(false);
      loadData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(getErrorMessage(error, 'Error adding payment'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      const propertyId = id || obligation.property;
      await deleteObligationPayment(propertyId, obligationId, paymentId);
      toast.success('Payment deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(getErrorMessage(error, 'Error deleting payment'));
    }
  };

const handleEditObligation = () => setEditingObligation(obligation);
const handleEditPayment = (payment) => setEditingPayment(payment);

  const handleSaveObligation = async (updatedObligation) => {
  try {
    const propertyId = id || obligation?.property;
    if (!propertyId || !obligationId) {
      toast.error('Missing property or obligation reference');
      return;
    }

    setIsSavingObligation(true);
    const payload = {
      obligation_type: Number(updatedObligation.obligation_type),
      entity_name: updatedObligation.entity_name,
      amount: Number(updatedObligation.amount),
      due_date: updatedObligation.due_date,
      temporality: updatedObligation.temporality,
    };

    await updatePropertyObligation(propertyId, obligationId, payload);
    await loadData();
    toast.success("Obligación actualizada");
    setEditingObligation(null); // Cierra el modal
  } catch (error) {
    toast.error(getErrorMessage(error, 'Error updating obligation'));
  } finally {
    setIsSavingObligation(false);
  }
};

  const handleSavePayment = async (updatedPayment) => {
    try {
      const propertyId = id || obligation?.property;
      if (!propertyId || !obligationId || !editingPayment?.id) {
        toast.error('Missing payment reference');
        return;
      }

      setIsSavingPayment(true);
      await updateObligationPayment(propertyId, obligationId, editingPayment.id, updatedPayment);
      await loadData();
      toast.success('Payment updated successfully');
      setEditingPayment(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Error updating payment'));
    } finally {
      setIsSavingPayment(false);
    }
  };

    const handleOpenDocument = async (url) => {
      try {
        await openProtectedMedia(url);
      } catch (error) {
        console.error('Error opening protected document:', error);
      }
    };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    // Parse YYYY-MM-DD as local date to avoid timezone shifting one day back.
    const match = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const date = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : new Date(dateString);

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loader />;
  if (!obligation) return null;

  const obligationAmountCents = toCents(obligation.amount);
  const totalPaidCents = obligation.total_paid ? toCents(obligation.total_paid) : obligation.payments.reduce((sum, p) => sum + toCents(p.amount), 0);
  const pendingCents = Math.max(0, obligationAmountCents - totalPaidCents);

  const totalPaid = fromCents(totalPaidCents);
  const pending = fromCents(pendingCents);
  const isCompleted = pendingCents <= 0;
  const progress = obligationAmountCents > 0 ? (totalPaidCents / obligationAmountCents) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(id ? `/property/${id}` : '/obligations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {id ? 'Back to Property' : 'Back to Obligations'}
        </button>

        <div className="flex items-center justify-between gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Obligation Detail</h1>
          <button
            onClick={handleEditObligation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Obligation
          </button>
        </div>

        {property && (
          <p className="text-sm sm:text-base text-gray-600">
            Property: <span className="font-semibold">{property?.name || property?.address}</span>
          </p>
        )}
      </div>

      {/* Información de la Obligación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {obligation.obligation_type_name || 'Obligation'}
            </h2>
            <p className="text-gray-600">{obligation.entity_name}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isCompleted ? 'Paid' : 'Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(obligation.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Due Date</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(obligation.due_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(pending)}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Payment Progress</p>
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
            <span className="font-medium">Periodicity:</span> {obligation.temporality}
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
                maxAmount={Number(pending.toFixed(2))}
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
       
<div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold text-gray-900">
    Payment History ({payments.length})
  </h3>
  {payments.length > 0 && (
    <span className="text-sm text-gray-700 font-medium">
      Total paid: {formatCurrency(totalPaid)}
    </span>
  )}
</div>
{payments.length === 0 ? (
  <div className="text-center py-8 text-gray-500">
    <p>No payments recorded yet.</p>
  </div>
) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() =>
                  setExpandedPaymentId(expandedPaymentId === payment.id ? null : payment.id)
                }
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">
                        {obligation.obligation_type_name || 'Obligación'}
                      </p>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {payment.payment_method_name || 'Payment Method'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Date: {formatDate(payment.date)}
                    </p>
                    {/* Mostrar nombre de la obligación aquí */}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>

                    {expandedPaymentId === payment.id && (
                      <div className="flex items-center gap-1">
                        {console.log('Payment to edit:', payment)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPayment(payment);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Payment"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePayment(payment.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Payment"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Detalles adicionales */}
                {expandedPaymentId === payment.id && (
                  <div className="mt-4 border-t pt-3 text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-medium">Entidad:</span> {obligation.entity_name}
                    </div>
                    <div>
                      <span className="font-medium">Temporality:</span> {obligation.temporality}
                    </div>
                    {payment.voucher_url && (
                      <div>
                        <button
                            type="button"
                            onClick={() => handleOpenDocument(payment.voucher_url)}
                          className="cursor-pointer text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Voucher
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editingObligation && (
        <ObligationEditModal
          obligation={editingObligation}
          onClose={() => setEditingObligation(null)}
          onSave={handleSaveObligation}
          isLoading={isSavingObligation}
        />
      )}

      {editingPayment && (
        <PaymentEditModal
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onSave={handleSavePayment}
          isLoading={isSavingPayment}
        />
      )}
    </div>
  );
};

export default ObligationDetailPage;

