import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import {
  addPayVehicleObligation,
  getVehicleById,
  getVehicleObligationPayments,
  getVehicleObligations,
  openProtectedMedia,
} from '../api/vehicles.api';
import { getPaymentMethods } from '../api/finance.api';

const VehicleObligationDetailPage = () => {
  const { id, obligationId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [obligation, setObligation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    payment_method: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    voucher: null,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehicleData, obligationsData, methodsData] = await Promise.all([
        getVehicleById(id),
        getVehicleObligations(id),
        getPaymentMethods(),
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
      toast.error(error?.response?.data?.error || 'Error adding payment');
    } finally {
      setIsSubmitting(false);
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
              {obligation.obligation_type_name || 'Obligation'}
            </h2>
            <p className="text-gray-600">{obligation.entity_name}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isCompleted ? 'Paid' : 'Pending'}
          </span>
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
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
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
              {paymentMethods.map((method) => (
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History ({payments.length})</h3>

        {payments.length === 0 ? (
          <p className="text-gray-600">No payments registered yet.</p>
        ) : (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleObligationDetailPage;
