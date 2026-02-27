import React from 'react';
import { useForm } from 'react-hook-form';

const TenantForm = ({ initialData, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      lastname: '',
      email: '',
      birth_year: '',
      phone1: '',
      phone2: '',
      observations: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Juan"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              {...register('lastname', { required: 'Last name is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pérez"
            />
            {errors.lastname && (
              <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email', { 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email'
              }
            })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>


<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Year *
          </label>
          <input
            type="number"
            {...register('birth_year', { 
              required: 'Birth year is required',
              valueAsNumber: true,
              min: { value: 1900, message: 'Birth year must be after 1900' },
              max: { value: new Date().getFullYear(), message: 'Birth year cannot be in the future' }
            })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1990"
          />
          {errors.birth_year && (
            <p className="mt-1 text-sm text-red-600">{errors.birth_year.message}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            {...register('phone1', { required: 'Phone is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="3001234567"
          />
          {errors.phone1 && (
            <p className="mt-1 text-sm text-red-600">{errors.phone1.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone 2 (optional)
          </label>
          <input
            type="tel"
            {...register('phone2')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="3001234567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observations (optional)
          </label>
          <textarea
            {...register('observations')}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Additional notes about the tenant..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Tenant' : 'Create Tenant'}
        </button>
      </div>
    </form>
  );
};

export default TenantForm;
