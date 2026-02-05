import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getTenants, createTenant } from '../../api/rentals.api';
import toast from 'react-hot-toast';
import Modal from '../UI/Modal';
import TenantForm from './TenantForm';

const RentalForm = ({ initialData, onSubmit, isLoading }) => {
  const [tenants, setTenants] = useState([]);
  const [rentalType, setRentalType] = useState(initialData?.rental_type || 'monthly');
  const [status, setStatus] = useState(initialData?.status || 'available');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      status: 'available',
      tenant: '',
      rental_type: 'monthly',
      check_in: '',
      check_out: '',
      amount: '',
      people_count: 1,
      deposit_amount: '',
      is_refundable: true,
      url_files: null,
      is_paid: false
    }
  });

  const watchRentalType = watch('rental_type');
  const watchStatus = watch('status');

  useEffect(() => {
    setRentalType(watchRentalType);
  }, [watchRentalType]);

  useEffect(() => {
    setStatus(watchStatus);
    if (watchStatus === 'available') {
      setValue('tenant', '');
    }
  }, [watchStatus, setValue]);

  useEffect(() => {
    loadTenants();
  }, []);

const handleCreateTenant = async (tenantData) => {
    try {
      setIsCreatingTenant(true);
      const newTenant = await createTenant(tenantData);
      toast.success('Tenant created successfully');
      await loadTenants(); // Recargar lista de tenants
      setValue('tenant', newTenant.id); // Seleccionar automáticamente el nuevo tenant
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('Error creating tenant');
    } finally {
      setIsCreatingTenant(false);
    }
  };

  const loadTenants = async () => {
    try {
      const data = await getTenants();
      setTenants(data);
    } catch (error) {
      console.error('Error loading tenants:', error);
    

    toast.error('Error loading tenants');
    }
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      status: data.status,
      rental_type: data.rental_type,
      check_in: data.check_in,
      check_out: data.check_out,
      amount: parseFloat(data.amount),
      people_count: parseInt(data.people_count)
    };

    // Solo agregar tenant si el status es 'ocupada'
    if (data.status === 'occupied' && data.tenant) {
      formattedData.tenant = parseInt(data.tenant);
    }

    if (data.rental_type === 'monthly') {
      formattedData.monthly_data = {
        deposit_amount: parseFloat(data.deposit_amount),
        is_refundable: data.is_refundable
      };
      
      // Si hay un archivo seleccionado
      if (data.url_files && data.url_files[0]) {
        formattedData.url_files = data.url_files[0];
      }
    } else {
      formattedData.airbnb_data = {
        is_paid: data.is_paid
      };
    }

    onSubmit(formattedData);
  };

  return (
    <>
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {status === 'occupied' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tenant *
              </label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Tenant
              </button>
            </div>
            <select
              {...register('tenant', { required: status === 'occupied' ? 'You must select a tenant' : false })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a tenant...</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} {tenant.lastname}
                </option>
              ))}
            </select>
            {errors.tenant && (
              <p className="mt-1 text-sm text-red-600">{errors.tenant.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rental Type *
          </label>
          <select
            {...register('rental_type', { required: 'Rental type is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="airbnb">Airbnb</option>
          </select>
          {errors.rental_type && (
            <p className="mt-1 text-sm text-red-600">{errors.rental_type.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in *
            </label>
            <input
              type="date"
              {...register('check_in', { required: 'Date is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.check_in && (
              <p className="mt-1 text-sm text-red-600">{errors.check_in.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out *
            </label>
            <input
              type="date"
              {...register('check_out', { required: 'Date is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.check_out && (
              <p className="mt-1 text-sm text-red-600">{errors.check_out.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Amount is required', min: { value: 0, message: 'Must be positive' } })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People *
            </label>
            <input
              type="number"
              {...register('people_count', { required: 'This field is required', min: { value: 1, message: 'Minimum 1' } })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
            />
            {errors.people_count && (
              <p className="mt-1 text-sm text-red-600">{errors.people_count.message}</p>
            )}
          </div>
        </div>

        {rentalType === 'monthly' && (
          <div className="border-t pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Monthly Rental Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('deposit_amount', { required: rentalType === 'monthly', min: 0 })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('is_refundable')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Refundable Deposit
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Files (optional)
                </label>
                <input
                  type="file"
                  {...register('url_files')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="mt-1 text-xs text-gray-500">Allowed formats: PDF, DOC, DOCX, JPG, PNG</p>
              </div>
            </div>
          </div>
        )}

        {rentalType === 'airbnb' && (
          <div className="border-t pt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Airbnb Data</h3>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('is_paid')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Payment Received
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Rental' : 'Create Rental'}
        </button>
      </div>

     
    </form>
     {/* Modal para crear tenant */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Tenant"
      >
        <TenantForm
          onSubmit={handleCreateTenant}
          isLoading={isCreatingTenant}
        />
      </Modal>
    </>
  );
};

export default RentalForm;
