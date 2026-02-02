import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getObligationTypes } from '../../api/finance.api';
import toast from 'react-hot-toast';

const ObligationForm = ({ initialData, onSubmit, isLoading }) => {
  const [obligationTypes, setObligationTypes] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      obligation_type: '',
      entity_name: '',
      amount: '',
      due_date: '',
      temporality: 'monthly'
    }
  });

  useEffect(() => {
    loadObligationTypes();
  }, []);

  const loadObligationTypes = async () => {
    try {
      const data = await getObligationTypes();
      setObligationTypes(data);
    } catch (error) {
      console.error('Error al cargar tipos de obligación:', error);
      toast.error('Error al cargar tipos de obligación');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Obligación *
          </label>
          <select
            {...register('obligation_type', { required: 'El tipo es obligatorio' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar tipo...</option>
            {obligationTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {errors.obligation_type && (
            <p className="mt-1 text-sm text-red-600">{errors.obligation_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entidad *
          </label>
          <input
            type="text"
            {...register('entity_name', { required: 'La entidad es obligatoria' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: EAAB, EPM, etc."
          />
          {errors.entity_name && (
            <p className="mt-1 text-sm text-red-600">{errors.entity_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: 'El monto es obligatorio', min: { value: 0, message: 'El monto debe ser positivo' } })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Vencimiento *
          </label>
          <input
            type="date"
            {...register('due_date', { required: 'La fecha es obligatoria' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Periodicidad *
          </label>
          <select
            {...register('temporality', { required: 'La periodicidad es obligatoria' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Mensual</option>
            <option value="bimonthly">Bimestral</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
            <option value="one_time">Única vez</option>
          </select>
          {errors.temporality && (
            <p className="mt-1 text-sm text-red-600">{errors.temporality.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Obligación'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ObligationForm;
