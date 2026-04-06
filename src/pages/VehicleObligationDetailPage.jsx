import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import Modal from '../components/UI/Modal';
import VehicleObligationEditModal from '../components/Vehicles/VehicleObligationEditModal';
import {
  addPayVehicleObligation,
  getVehicleById,
  getVehicleObligationPayments,
  getVehicleObligations,
  openProtectedMedia,
  updatePayVehicleObligation,
  deletePayVehicleObligation,
  updateVehicleObligation
} from '../api/vehicles.api';
import { getObligationTypes, getPaymentMethods } from '../api/finance.api';

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

const VehicleObligationDetailPage = () => {
  const { id, obligationId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [obligation, setObligation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [obligationTypes, setObligationTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isEditingObligation, setIsEditingObligation] = useState(false);
  const [isUpdatingObligation, setIsUpdatingObligation] = useState(false);

  const [form, setForm] = useState({
    payment_method: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    voucher: null,
  });
  const [editForm, setEditForm] = useState({
    payment_method: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    voucher: null,
  });
  const [obligationForm, setObligationForm] = useState({
    entity_name: '',
    obligation_type: '',
    due_date: '',
    amount: '',
    temporality: 'annual',
    file: null,
  });

  const sanitizePkValue = (value) => String(value ?? '').trim().replace(/^"+|"+$/g, '');

  const parsePkToNumber = (value) => {
    const cleaned = sanitizePkValue(value);
    const parsed = Number(cleaned);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
  };

  const getObligationTypeId = (targetObligation) => {
    if (!targetObligation) return '';

    if (typeof targetObligation.obligation_type === 'object') {
      return targetObligation.obligation_type?.id != null ? sanitizePkValue(targetObligation.obligation_type.id) : '';
    }

    if (targetObligation.obligation_type != null) {
      return sanitizePkValue(targetObligation.obligation_type);
    }

    return targetObligation.obligation_type_id != null ? sanitizePkValue(targetObligation.obligation_type_id) : '';
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehicleData, obligationsData, methodsData, obligationTypesData] = await Promise.all([
        getVehicleById(id),
        getVehicleObligations(id),
        getPaymentMethods(),
        getObligationTypes(),
      ]);

      const selected = (Array.isArray(obligationsData) ? obligationsData : []).find(
        (item) => String(item.id) === String(obligationId),
      );

      if (!selected) {
        toast.error('Obligation not found');
        navigate(`/vehicles/${id}/obligations`);
        return;
      }

      const paymentsData = await getVehicleObligationPayments(id, obligationId);

      setVehicle(vehicleData);
      setObligation(selected);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setPaymentMethods(Array.isArray(methodsData) ? methodsData : []);
      setObligationTypes(
        Array.isArray(obligationTypesData)
          ? obligationTypesData.map((type) => ({ ...type, id: sanitizePkValue(type?.id) }))
          : [],
      );
    } catch (error) {
      console.error('Error loading obligation detail:', error);
      toast.error('Error loading obligation detail');
      navigate(`/vehicles/${id}/obligations`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, obligationId]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const pending = Number(obligation?.pending || 0);
  const totalAmount = Number(obligation?.amount || 0);
  const totalPaid = Number(obligation?.total_paid || 0);
  const isCompleted = Boolean(obligation?.is_fully_paid) || pending <= 0;
  const progress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.payment_method || !form.date || !form.amount) {
      toast.error('Payment method, date and amount are required');
      return;
    }

    if (Number(form.amount) > pending) {
      toast.error(`Payment exceeds pending amount (${formatCurrency(pending)})`);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = form.voucher
        ? (() => {
            const formData = new FormData();
            formData.append('payment_method', String(form.payment_method));
            formData.append('date', form.date);
            formData.append('amount', String(form.amount));
            formData.append('voucher', form.voucher);
            return formData;
          })()
        : {
            payment_method: Number(form.payment_method),
            date: form.date,
            amount: String(form.amount),
          };

      await addPayVehicleObligation(id, obligationId, payload);
      toast.success('Payment registered successfully');
      setForm({ payment_method: '', date: new Date().toISOString().split('T')[0], amount: '', voucher: null });
      await loadData();
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error(getErrorMessage(error, 'Error adding payment'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditObligation = () => {
    if (!obligation) return;

    const amountValue = Number(obligation?.amount || 0);

    setObligationForm({
      entity_name: obligation?.entity_name || '',
      obligation_type: getObligationTypeId(obligation),
      due_date: obligation?.due_date ? String(obligation.due_date).slice(0, 10) : '',
      amount: Number.isFinite(amountValue) ? amountValue.toFixed(2) : '',
      temporality: obligation?.temporality || 'annual',
      file: null,
    });

    setIsEditingObligation(true);
  };

  const handleCloseEditObligation = () => {
    setIsEditingObligation(false);
    setObligationForm({
      entity_name: '',
      obligation_type: '',
      due_date: '',
      amount: '',
      temporality: 'annual',
      file: null,
    });
  };

  const handleObligationFieldChange = (field, value) => {
    setObligationForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateObligation = async (event) => {
    event.preventDefault();

    if (!obligation?.id) {
      toast.error('Obligation not found');
      return;
    }

    if (!obligationForm.entity_name || !obligationForm.obligation_type || !obligationForm.due_date || !obligationForm.amount) {
      toast.error('Entity, type, due date and amount are required');
      return;
    }

    const parsedAmount = Number(obligationForm.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a valid number greater than 0');
      return;
    }



    const totalPaidAmount = Number(obligation?.total_paid || 0);
    if (parsedAmount < totalPaidAmount) {
      toast.error(`Amount cannot be less than total paid (${formatCurrency(totalPaidAmount)})`);
      return;
    }

    const obligationTypePk = parsePkToNumber(obligationForm.obligation_type);
    if (!Number.isInteger(obligationTypePk)) {
      toast.error('Invalid obligation type selected');
      return;
    }

    const normalizedAmount = parsedAmount.toFixed(2);

    try {
      setIsUpdatingObligation(true);

      const payload = obligationForm.file
        ? (() => {
            const formData = new FormData();
            formData.append('entity_name', obligationForm.entity_name);
            formData.append('obligation_type', String(obligationTypePk));
            formData.append('due_date', obligationForm.due_date);
            formData.append('amount', normalizedAmount);
            formData.append('temporality', obligationForm.temporality);
            formData.append('file', obligationForm.file);
            return formData;
          })()
        : {
            entity_name: obligationForm.entity_name,
            obligation_type: obligationTypePk,
            due_date: obligationForm.due_date,
            amount: normalizedAmount,
            temporality: obligationForm.temporality,
          };

      await updateVehicleObligation(obligation.id, payload);
      toast.success('Obligation updated successfully');
      handleCloseEditObligation();
      await loadData();
    } catch (error) {
      console.error('Error updating obligation:', error);
      toast.error(getErrorMessage(error, 'Error updating obligation'));
    } finally {
      setIsUpdatingObligation(false);
    }
  };

const totalPaidFinal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0); 
  const getPaymentMethodId = (payment) => {
    if (!payment) return '';

    if (typeof payment.payment_method === 'object') {
      return payment.payment_method?.id != null ? String(payment.payment_method.id) : '';
    }

    return payment.payment_method != null ? String(payment.payment_method) : '';
  };

  const handleEditPayment = (payment) => {
    const amountValue = Number(payment?.amount || 0);
    setEditingPayment(payment);
    setEditForm({
      payment_method: getPaymentMethodId(payment),
      date: payment?.date ? String(payment.date).slice(0, 10) : new Date().toISOString().split('T')[0],
      amount: Number.isFinite(amountValue) ? amountValue.toFixed(2) : '',
      voucher: null,
    });
  };

  const handleCloseEditModal = () => {
    setEditingPayment(null);
    setEditForm({
      payment_method: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      voucher: null,
    });
  };

  const handleUpdatePayment = async (event) => {
    event.preventDefault();

    if (!editingPayment?.id) {
      toast.error('Payment not found');
      return;
    }

    if (!editForm.payment_method || !editForm.date || !editForm.amount) {
      toast.error('Payment method, date and amount are required');
      return;
    }

    const parsedAmount = Number(editForm.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a valid number greater than 0');
      return;
    }

    const currentAmount = Number(editingPayment.amount || 0);
    const maxAllowed = Number(pending) + (Number.isFinite(currentAmount) ? currentAmount : 0);
    if (parsedAmount > maxAllowed) {
      toast.error(`Payment exceeds allowed amount (${formatCurrency(maxAllowed)})`);
      return;
    }

    const normalizedAmount = parsedAmount.toFixed(2);

    try {
      setIsUpdatingPayment(true);

      const payload = editForm.voucher
        ? (() => {
            const formData = new FormData();
            formData.append('payment_method', String(Number(editForm.payment_method)));
            formData.append('date', editForm.date);
            formData.append('amount', normalizedAmount);
            formData.append('voucher', editForm.voucher);
            return formData;
          })()
        : {
            payment_method: Number(editForm.payment_method),
            date: editForm.date,
            amount: normalizedAmount,
          };

      await updatePayVehicleObligation(editingPayment.id, payload);
      toast.success('Payment updated successfully');
      handleCloseEditModal();
      await loadData();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error(getErrorMessage(error, 'Error updating payment'));
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!paymentId) {
      toast.error('Payment not found');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this payment?')) return;

    try {
      await deletePayVehicleObligation(paymentId);
      toast.success('Payment deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error(getErrorMessage(error, 'Error deleting payment'));
    }
  };

  if (loading) return <Loader />;
  if (!obligation) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/vehicles/${id}/obligations`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to obligations
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Obligation Detail</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Vehicle: <span className="font-semibold">{vehicle?.brand} {vehicle?.model}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {obligation.obligation_type_name.charAt(0).toUpperCase() + obligation.obligation_type_name.slice(1) || 'Obligation'}
            </h2>
            <p className="text-gray-600">{obligation.entity_name}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isCompleted ? 'Paid' : 'Pending'}
            </span>
            <button
              type="button"
              onClick={handleOpenEditObligation}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-medium"
            >
              Edit Obligation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Due Date</p>
            <p className="text-lg font-semibold text-gray-900">{obligation.due_date}</p>
          </div>
          {/** 
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
*/}
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(pending)}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Payment Progress</p>
            <p className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={`h-3 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Periodicity:</span> {obligation.temporality}</p>
          {obligation.file && (
            <button
              type="button"
              onClick={() => openProtectedMedia(obligation.file)}
              className="text-blue-600 hover:text-blue-700"
            >
              Open obligation file
            </button>
          )}
        </div>
      </div>

      {!isCompleted && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              value={form.payment_method}
              onChange={(e) => setForm((prev) => ({ ...prev, payment_method: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            >
              <option value="">Select method...</option>
              {paymentMethods
              .filter((method)=> method.name == 'cash' || method.name == 'transfer' || method.name == 'card' || method.name == 'check' || method.name == 'zelle' || method.name == 'checking account')
              .map((method) => (
                <option key={method.id} value={method.id}>
                  {String(method.name || '').charAt(0).toUpperCase() + String(method.name || '').slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="1000000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher (optional)</label>
            <input
              type="file"
              onChange={(e) => setForm((prev) => ({ ...prev, voucher: e.target.files?.[0] || null }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Add Payment'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History ({payments.length})</h3>
        <span className="text-lg text-gray-700 font-medium">
              Total paid: {formatCurrency(totalPaidFinal)}
            </span>
            </div>
        {payments.length === 0 ? (
          <p className="text-gray-600">No payments registered yet.</p>
        ) : (
           <>
            
  
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <p><span className="font-medium text-gray-700">Method:</span> {payment.payment_method_name}</p>
                  <p><span className="font-medium text-gray-700">Date:</span> {payment.date}</p>
                  <p><span className="font-medium text-gray-700">Amount:</span> {formatCurrency(payment.amount)}</p>
                  {payment.voucher ? (
                    <button
                      type="button"
                      onClick={() => openProtectedMedia(payment.voucher)}
                      className="text-blue-600 hover:text-blue-700 text-left"
                    >
                      Open voucher
                    </button>
                  ) : (
                    <p><span className="font-medium text-gray-700">Voucher:</span> No file</p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditPayment(payment)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePayment(payment.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
        
      </div>

      <Modal isOpen={Boolean(editingPayment)} onClose={handleCloseEditModal} title="Edit Payment">
        <form onSubmit={handleUpdatePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              value={editForm.payment_method}
              onChange={(e) => setEditForm((prev) => ({ ...prev, payment_method: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            >
              <option value="">Select method...</option>
              {paymentMethods
                .filter((method) => method.name === 'cash' || method.name === 'transfer' || method.name === 'card' || method.name === 'check' || method.name === 'zelle' || method.name === 'checking account')
                .map((method) => (
                  <option key={method.id} value={method.id}>
                    {String(method.name || '').charAt(0).toUpperCase() + String(method.name || '').slice(1)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editForm.amount}
              onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="1000000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher (optional)</label>
            {(editingPayment?.voucher || editingPayment?.voucher_url) && (
              <button
                type="button"
                onClick={() => openProtectedMedia(editingPayment?.voucher || editingPayment?.voucher_url)}
                className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
              >
                View current voucher
              </button>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setEditForm((prev) => ({ ...prev, voucher: e.target.files?.[0] || null }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to keep current voucher.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCloseEditModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isUpdatingPayment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isUpdatingPayment}
            >
              {isUpdatingPayment ? 'Saving...' : 'Update Payment'}
            </button>
          </div>
        </form>
      </Modal>

      <VehicleObligationEditModal
        isOpen={isEditingObligation}
        onClose={handleCloseEditObligation}
        onSubmit={handleUpdateObligation}
        isSubmitting={isUpdatingObligation}
        form={obligationForm}
        obligationTypes={obligationTypes}
        hasCurrentFile={Boolean(obligation?.file)}
        onOpenCurrentFile={() => {
          if (obligation?.file) {
            openProtectedMedia(obligation.file);
          }
        }}
        onFieldChange={handleObligationFieldChange}
        onFileChange={(file) => handleObligationFieldChange('file', file)}
      />
    </div>
  );
};

export default VehicleObligationDetailPage;
