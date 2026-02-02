import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPaymentMethods } from '../../api/finance.api';
import toast from 'react-hot-toast';

const PaymentForm = ({ onSubmit, isLoading, maxAmount }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      payment_method: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      voucher_url: ''
    }
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const data = await getPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
      toast.error('Error al cargar métodos de pago');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Pago</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago *
          </label>
          <select
            {...register('payment_method', { required: 'El método es obligatorio' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar método...</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
          </select>
          {errors.payment_method && (
            <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { 
              required: 'El monto es obligatorio',
              min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
              max: maxAmount ? { value: maxAmount, message: `El monto no puede exceder ${maxAmount}` } : undefined
            })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
          {maxAmount && (
            <p className="mt-1 text-xs text-gray-500">Monto máximo: ${maxAmount.toLocaleString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Pago *
          </label>
          <input
            type="date"
            {...register('date', { required: 'La fecha es obligatoria' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Comprobante (opcional)
          </label>
          <input
            type="url"
            {...register('voucher_url')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Guardando...' : 'Agregar Pago'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
