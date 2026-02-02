import React from 'react';
import { useForm } from 'react-hook-form';

const PropertyForm = ({ initialData, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData ? {
      name: initialData.name || '',
      use: initialData.use || '',
      address: initialData.address || '',
      ubication: initialData.ubication || '',
      zip_code: initialData.zip_code || '',
      type_building: initialData.type_building || '',
      city: initialData.city || '',
      bedrooms: initialData.details?.bedrooms || '',
      bathrooms: initialData.details?.bathrooms || '',
      floors: initialData.details?.floors || '',
      observations: initialData.details?.observations || '',
      buildings: initialData.details?.buildings || ''
    } : {}
  });

  const handleFormSubmit = (data) => {
    // Transformar los datos al formato que espera la API
    const formattedData = {
      name: data.name,
      use: data.use,
      address: data.address,
      ubication: data.ubication,
      zip_code: data.zip_code,
      type_building: data.type_building,
      city: data.city,
      details: {
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        floors: parseInt(data.floors) || 0,
        observations: data.observations || '',
        buildings: parseInt(data.buildings) || 0
      }
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            {...register('name', { required: 'El nombre es requerido' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ej: Casa2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Uso *
          </label>
          <select
            {...register('use', { required: 'El uso es requerido' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Selecciona un uso</option>
            <option value="personal">Personal</option>
            <option value="arrendamiento">Arrendamiento</option>
            <option value="comercial">Comercial</option>
          </select>
          {errors.use && (
            <p className="text-red-600 text-sm mt-1">{errors.use.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <input
            {...register('address', { required: 'La dirección es requerida' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ej: calle siempre viva 2"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <input
            {...register('ubication')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ej: 3.402674, -76.530746"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código postal
            </label>
            <input
              {...register('zip_code')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ej: 58"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              {...register('city')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ej: Boston"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de edificio *
          </label>
          <select
            {...register('type_building', { required: 'El tipo de edificio es requerido' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Selecciona un tipo</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
          </select>
          {errors.type_building && (
            <p className="text-red-600 text-sm mt-1">{errors.type_building.message}</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habitaciones
              </label>
              <input
                type="number"
                {...register('bedrooms')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ej: 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baños
              </label>
              <input
                type="number"
                {...register('bathrooms')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ej: 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pisos
              </label>
              <input
                type="number"
                {...register('floors')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ej: 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edificios
              </label>
              <input
                type="number"
                {...register('buildings')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ej: 1"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              {...register('observations')}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Guardando...' : initialData ? 'Actualizar Propiedad' : 'Crear Propiedad'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
