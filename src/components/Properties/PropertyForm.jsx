import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const PropertyForm = ({ initialData, onSubmit, isLoading }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData ? {
      name: initialData.name || '',
      use: initialData.use || '',
      address: initialData.address || '',
      map_url: initialData.map_url || '',
      image_url: initialData.image_url || '',
      zip_code: initialData.zip_code || '',
      type_building: initialData.type_building || '',
      state: initialData.state || '',
      city: initialData.city || '',
      bedrooms: initialData.details?.bedrooms || '',
      bathrooms: initialData.details?.bathrooms || '',
      floors: initialData.details?.floors || '',
      observations: initialData.details?.observations || '',
      buildings: initialData.details?.buildings || ''
    } : {}
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data) => {
    // Transform data to API format (JSON)
    const formattedData = {
      name: data.name,
      use: data.use,
      address: data.address,
      type_building: data.type_building,
      map_url: data.map_url || '',
      zip_code: data.zip_code || '',
      state: data.state || '',
      city: data.city || '',
      details: {
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        floors: parseInt(data.floors) || 0,
        observations: data.observations || '',
        buildings: parseInt(data.buildings) || 0
      }
    };
    
    // If there's an image file, we need to send FormData
    if (imageFile) {
      const formData = new FormData();
      
      // Add main fields
      formData.append('name', formattedData.name);
      formData.append('use', formattedData.use);
      formData.append('address', formattedData.address);
      formData.append('type_building', formattedData.type_building);
      formData.append('map_url', formattedData.map_url);
      formData.append('zip_code', formattedData.zip_code);
      formData.append('state', formattedData.state);
      formData.append('city', formattedData.city);
      
      // Add details fields individually
      formData.append('details.bedrooms', formattedData.details.bedrooms);
      formData.append('details.bathrooms', formattedData.details.bathrooms);
      formData.append('details.floors', formattedData.details.floors);
      formData.append('details.buildings', formattedData.details.buildings);
      formData.append('details.observations', formattedData.details.observations);
      
      // Add the image file
      formData.append('image_url', imageFile);
      
      onSubmit(formData);
    } else {
      // No image, send as JSON
      onSubmit(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ex: House 2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use *
          </label>
          <select
            {...register('use', { required: 'Use is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Select a use</option>
            <option value="personal">Personal</option>
            <option value="rental">Rental</option>
            <option value="commercial">Commercial</option>
          </select>
          {errors.use && (
            <p className="text-red-600 text-sm mt-1">{errors.use.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            {...register('address', { required: 'Address is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ex: 123 Main Street"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map URL
          </label>
          <input
            {...register('map_url')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Ex: https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-gray-500 text-xs mt-1">Google Maps embed URL (iframe src)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <p className="text-gray-500 text-xs mt-1">Select the main property image</p>
          {imagePreview && (
            <div className="mt-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <input
              {...register('zip_code')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ej: 58"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              {...register('state')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ex: California"
            />
          </div>
        

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              {...register('city')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ex: Boston"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Type *
          </label>
          <select
            {...register('type_building', { required: 'Building type is required' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Select a type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="office">Office</option>
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
                Bedrooms
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
                Bathrooms
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
                Floors
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
                Buildings
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
              Observations
            </label>
            <textarea
              {...register('observations')}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Additional observations..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
