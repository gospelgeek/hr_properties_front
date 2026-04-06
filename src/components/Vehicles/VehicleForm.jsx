import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import autoImg from '../../assets/auto.png';

const vehicleTypeOptions = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'sport', label: 'Sport' },
  { value: 'permanent_use', label: 'Permanent Use' },
  { value: 'water', label: 'Water' },
];

const parseResponsibleIds = (value) => {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
};

const VehicleForm = ({ initialData, onSubmit, isLoading }) => {
  const defaultResponsibleIds = useMemo(() => {
    if (!initialData?.responsibles?.length) return '';
    return initialData.responsibles.map((item) => item.id).filter(Boolean).join(', ');
  }, [initialData]);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialData?.photo || autoImg);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          owner: initialData.owner || '',
          type: initialData.type || '',
          purchase_date: initialData.purchase_date || '',
          purchase_price: initialData.purchase_price || '',
          brand: initialData.brand || '',
          model: initialData.model || '',
          responsible_ids: defaultResponsibleIds,
        }
      : {
          owner: '',
          type: '',
          purchase_date: '',
          purchase_price: '',
          brand: '',
          model: '',
          responsible_ids: '',
        },
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitForm = (data) => {
    const responsibleIds = parseResponsibleIds(data.responsible_ids);

    const payload = {
      owner: data.owner,
      type: data.type,
      purchase_date: data.purchase_date,
      purchase_price: String(data.purchase_price),
      brand: data.brand,
      model: data.model,
    };

    if (responsibleIds.length > 0) {
      payload.responsible_ids = responsibleIds;
    }

    if (photoFile) {
      const formData = new FormData();
      formData.append('owner', payload.owner);
      formData.append('type', payload.type);
      formData.append('purchase_date', payload.purchase_date);
      formData.append('purchase_price', payload.purchase_price);
      formData.append('brand', payload.brand);
      formData.append('model', payload.model);
      responsibleIds.forEach((id) => formData.append('responsible_ids', String(id)));
      formData.append('photo', photoFile);
      onSubmit(formData);
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner *</label>
            <input
              {...register('owner', { required: 'Owner is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Inversiones ABC S.A.S"
            />
            {errors.owner && <p className="text-red-600 text-sm mt-1">{errors.owner.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
            <select
              {...register('type', { required: 'Vehicle type is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              {vehicleTypeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
            <input
              {...register('brand', { required: 'Brand is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Toyota"
            />
            {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
            <input
              {...register('model', { required: 'Model is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Hilux"
            />
            {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
            <input
              type="date"
              {...register('purchase_date', { required: 'Purchase date is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.purchase_date && <p className="text-red-600 text-sm mt-1">{errors.purchase_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('purchase_price', {
                required: 'Purchase price is required',
                min: { value: 0, message: 'Purchase price must be greater than or equal to 0' },
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="158000000.00"
            />
            {errors.purchase_price && <p className="text-red-600 text-sm mt-1">{errors.purchase_price.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {photoPreview && (
            <div className="mt-3">
              <img src={photoPreview} alt="Vehicle preview" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Vehicle' : 'Create Vehicle'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VehicleForm;
