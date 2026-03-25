import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getPaymentMethods } from '../../api/finance.api';
import { openProtectedMedia } from '../../api/properties.api';

const getPaymentMethodId = (paymentMethod) => {
  if (paymentMethod == null) return '';
  if (typeof paymentMethod === 'object') {
    return paymentMethod.id != null ? String(paymentMethod.id) : '';
  }
  return String(paymentMethod);
};

const normalizePaymentForm = (payment = {}) => ({
  payment_method: getPaymentMethodId(payment.payment_method),
  payment_location: payment.payment_location || '',
  amount: payment.amount || '',
  date: payment.date ? String(payment.date).slice(0, 10) : new Date().toISOString().split('T')[0],
  voucher_url: null,
});

function PaymentEditModal({ payment, onClose, onSave, isLoading = false }) {
  const [paymentMethods, setPaymentMethods] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: normalizePaymentForm(payment),
  });

  const paymentMethod = watch('payment_method');

  useEffect(() => {
    reset(normalizePaymentForm(payment));
  }, [payment, reset]);

  useEffect(() => {
    if (!paymentMethods.length) return;

    const methodId = getPaymentMethodId(payment?.payment_method);
    if (!methodId) return;

    // Re-apply selected method after options are loaded.
    setValue('payment_method', methodId, { shouldDirty: false, shouldValidate: false });
  }, [payment?.payment_method, paymentMethods, setValue]);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const data = await getPaymentMethods();
        setPaymentMethods(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast.error('Error loading payment methods');
      }
    };

    loadPaymentMethods();
  }, []);

  useEffect(() => {
    const selected = paymentMethods.find((m) => String(m.id) === String(paymentMethod));
    if (!selected) {
      return;
    }

    if (selected.name.toLowerCase() !== 'cash') {
      setValue('payment_location', 'online');
    }
  }, [paymentMethod, paymentMethods, setValue]);

  const submitPayment = async (data) => {
    const selectedMethod = paymentMethods.find((m) => String(m.id) === String(data.payment_method));
    const isCashMethod = selectedMethod?.name?.toLowerCase() === 'cash';

    if (!isCashMethod) {
      data.payment_location = 'online';
    }

    if (data.voucher_url && data.voucher_url.length > 0 && data.voucher_url[0]) {
      const formData = new FormData();
      formData.append('payment_method', Number(data.payment_method));
      formData.append('payment_location', data.payment_location);
      formData.append('amount', Number(data.amount));
      formData.append('date', data.date);
      formData.append('voucher_url', data.voucher_url[0]);
      await onSave(formData);
      return;
    }

    const payload = {
      payment_method: Number(data.payment_method),
      payment_location: data.payment_location,
      amount: Number(data.amount),
      date: data.date,
    };

    await onSave(payload);
  };

  const selectedMethod = paymentMethods.find((m) => String(m.id) === String(paymentMethod));
  const showCashLocationSelect = selectedMethod?.name?.toLowerCase() === 'cash';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(submitPayment)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              {...register('payment_method', { required: 'The method is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select method...</option>
              {paymentMethods
                .map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name.charAt(0).toUpperCase() + method.name.slice(1)}
                  </option>
                ))}
            </select>
            {errors.payment_method && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Location *</label>
            {showCashLocationSelect ? (
              <select
                {...register('payment_location', { required: 'Payment location is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select location...</option>
                <option value="office">Office</option>
                <option value="daycare">Daycare</option>
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={selectedMethod ? 'Online' : ''}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                {...register('payment_location', { required: 'Payment location is required' })}
              />
            )}
            {errors.payment_location && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register('amount', {
                required: 'The amount is required',
                min: { value: 0.01, message: 'The amount must be greater than 0' },
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
            <input
              type="date"
              {...register('date', { required: 'The date is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher (optional)</label>
            {payment?.voucher_url && (
              <button
                type="button"
                onClick={() => openProtectedMedia(payment.voucher_url)}
                className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View current voucher
              </button>
            )}
            <input
              type="file"
              {...register('voucher_url')}
              accept="image/*,.pdf"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to keep current voucher. Upload a file to replace it.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Update Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentEditModal;
