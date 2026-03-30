import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPaymentMethods } from '../../api/finance.api';
import toast from 'react-hot-toast';

const parseAmountInput = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN;
  }

  const raw = String(value ?? '').trim().replace(/\s/g, '');
  if (!raw) return NaN;

  const lastComma = raw.lastIndexOf(',');
  const lastDot = raw.lastIndexOf('.');
  const decimalSeparator = lastComma > lastDot ? ',' : '.';

  let normalized = raw;
  if (lastComma !== -1 || lastDot !== -1) {
    if (decimalSeparator === ',') {
      normalized = raw.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = raw.replace(/,/g, '');
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const PaymentForm = ({ onSubmit, isLoading, maxAmount }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const safeMaxAmount =
    typeof maxAmount === 'number' && Number.isFinite(maxAmount)
      ? Number(maxAmount.toFixed(2))
      : undefined;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      payment_method: '',
      payment_location: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      voucher_url: ''
    }
  });
const paymentMethod = watch('payment_method');
  useEffect(() => {
    loadPaymentMethods();

  }, []);

  const loadPaymentMethods = async () => {
    try {
      const data = await getPaymentMethods();
      console.log('Loaded payment methods:', data);
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Error loading payment methods');
    }
  };


    // Watch payment_method to control payment_location
 useEffect(() => {
  const selected = paymentMethods.find(m => String(m.id) === String(paymentMethod));
  if (selected) {
    if (selected.name.toLowerCase() !== 'cash') {
      setValue('payment_location', 'online');
    } else {
      setValue('payment_location', '');
    }
  } else {
    setValue('payment_location', '');
  }
}, [paymentMethod, paymentMethods, setValue])


const handlePaymentSubmit = async (data) => {
  try {
    const parsedAmount = parseAmountInput(data.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    const normalizedAmount = Number(parsedAmount.toFixed(2));

    // Si hay archivo, usa FormData
    if (data.voucher_url && data.voucher_url.length > 0 && data.voucher_url[0]) {
      const formData = new FormData();
      formData.append("payment_method", Number(data.payment_method));
      formData.append("payment_location", data.payment_location);
      formData.append("amount", normalizedAmount.toFixed(2));
      formData.append("date", data.date);
      formData.append("voucher_url", data.voucher_url[0]);
     //for (let pair of formData.entries()) {
     //  console.log(pair[0], pair[1]);
     //}
      await onSubmit(formData);
    } else {
      // Si no hay archivo, envía JSON
      const payload = {
        payment_method: Number(data.payment_method),
        payment_location: data.payment_location,
        amount: normalizedAmount,
        date: data.date,
      };
      //console.log('📤 JSON payload being sent to backend:', payload);
      await onSubmit(payload);
    }
  } catch (error) {
    toast.error(error?.message || "Error al registrar el pago");
  }
};

  return (
    <form onSubmit={handleSubmit(handlePaymentSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment</h3>
      
      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method *
          </label>
          <select
            {...register('payment_method', { required: 'The method is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select method...</option>
            {paymentMethods
            .filter((method)=> method.name == 'cash' || method.name == 'transfer' || method.name == 'card' || method.name == 'check' || method.name == 'zelle' || method.name == 'checking account')
            .map((method) => (
              <option key={method.id} value={method.id}>{method.name.charAt(0).toUpperCase()+method.name.slice(1)}</option>
            ))}
          </select>
          {errors.payment_method && (
            <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
          )}
        </div>

       <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Payment Location *
  </label>
  {(() => {
    // Busca el método seleccionado por id
    const selectedMethod = paymentMethods.find(
      (m) => String(m.id) === String(paymentMethod)
    );
    if (selectedMethod && selectedMethod.name.toLowerCase() === 'cash') {
      // Si es cash, muestra el select
      return (
        <select
          {...register('payment_location', { required: 'Payment location is required' })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select location...</option>
          <option value="office">Office</option>
          <option value="daycare">Daycare</option>
        </select>
      );
    } else if (selectedMethod) {
      // Si es otro método, muestra Online
      return (
        <input
          type="text"
          value="Online"
          readOnly
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
          {...register('payment_location', { required: 'Payment location is required' })}
        />
      );
    } else {
      // Si no hay método seleccionado, muestra un input vacío y deshabilitado
      return (
        <input
          type="text"
          value=""
          disabled
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-400"
        />
      );
    }
  })()}
  {errors.payment_location && (
    <p className="mt-1 text-sm text-red-600">{errors.payment_location.message}</p>
  )}
</div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <input
            type="text"
            inputMode="decimal"
            {...register('amount', { 
              required: 'The amount is required',
              validate: (value) => {
                const parsed = parseAmountInput(value);
                if (!Number.isFinite(parsed)) return 'Enter a valid amount';
                if (parsed <= 0) return 'The amount must be greater than 0';
                if (safeMaxAmount !== undefined && parsed > safeMaxAmount + 0.000001) {
                  return `The amount cannot exceed ${safeMaxAmount}`;
                }
                return true;
              }
            })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00 o 1.999,98"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
          {safeMaxAmount !== undefined && (
            <p className="mt-1 text-xs text-gray-500">Maximum amount: ${safeMaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Date *
          </label>
          <input
            type="date"
            {...register('date', { required: 'The date is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voucher (optional)
          </label>
          <input
            type="file"
            {...register('voucher_url')}
            accept="image/*,.pdf"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">Accepted formats: Images (JPG, PNG) or PDF</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Add Payment'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
