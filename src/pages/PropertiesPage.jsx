import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyList from '../components/Properties/PropertyList';
import Loader from '../components/UI/Loader';
import { getProperties, deleteProperty } from '../api/properties.api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isFirstLoad = useRef(true); // Para evitar doble carga al montar
  
  // Filters state - SEPARADOS CORRECTAMENTE
  const [useFilter, setUseFilter] = useState('');
  const [rentalStatusFilter, setRentalStatusFilter] = useState(''); // Para Rental Status
  const [rentalTypeFilter, setRentalTypeFilter] = useState(''); // Para Rental Type

// 1. Sincroniza los filtros locales con la URL SOLO al montar el componente
useEffect(() => {
  const use = searchParams.get('use') || '';
  const rentalStatus = searchParams.get('rental_status') || '';
  const rentalType = searchParams.get('rental_type') || '';
  
  setUseFilter(use);
  setRentalStatusFilter(rentalStatus);
  setRentalTypeFilter(rentalType);
  // 🚩 Carga propiedades aquí con los filtros de la URL
  loadPropertiesFromParams(use, rentalStatus, rentalType);
  isFirstLoad.current = false; // Ya se hizo la carga inicial
  // eslint-disable-next-line
}, []);

const loadPropertiesFromParams = async (use, rentalStatus, rentalType) => {
  try {
    setLoading(true);
    const params = {};
    if (use) params.use = use;
    if (rentalStatus) params.rental_status = rentalStatus;
    if (rentalType) params.rental_type = rentalType;
    const data = await getProperties(params);
    setProperties(data);
  } catch (error) {
    toast.error('Error loading properties');
  } finally {
    setLoading(false);
  }
};

// 2. Cuando cambian los filtros locales, actualiza la URL y carga propiedades
useEffect(() => {
  if (isFirstLoad.current) return; // Evita carga doble al montar

  // Solo carga si al menos uno de los filtros tiene valor
  if (!useFilter && !rentalStatusFilter && !rentalTypeFilter) return;

  const params = {};
  if (useFilter) params.use = useFilter;
  if (rentalStatusFilter) params.rental_status = rentalStatusFilter;
  if (rentalTypeFilter) params.rental_type = rentalTypeFilter;
  
  setSearchParams(params);
  loadPropertiesFromParams(useFilter, rentalStatusFilter, rentalTypeFilter);
  // eslint-disable-next-line
}, [useFilter, rentalStatusFilter, rentalTypeFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = {};
      if (useFilter) params.use = useFilter;
      if (rentalStatusFilter) params.rental_status = rentalStatusFilter;
      if (rentalTypeFilter) params.rental_type = rentalTypeFilter;
      
      const data = await getProperties(params);
      console.log('Loaded properties with filters:', params, data);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      toast.success('Property deleted successfully');
      loadProperties(); // Reload list
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const clearAllFilters = () => {
    setUseFilter('');
    setRentalStatusFilter('');
    setRentalTypeFilter('');
    setSearchParams({});
  };

  const hasActiveFilters = useFilter || rentalStatusFilter || rentalTypeFilter;
  console.log({ useFilter, rentalStatusFilter, rentalTypeFilter });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your properties</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/create')}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Property</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Property Use Filter */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <select
              value={useFilter}
              onChange={(e) => setUseFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">All Types</option>
              <option value="rental">Rental</option>
              <option value="personal">Personal</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Rental Status Filters */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rental Status</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="rentalStatus"
                  value="occupied"
                  checked={rentalStatusFilter === 'occupied'}
                  onChange={() => setRentalStatusFilter('occupied')}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatusFilter === 'occupied' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Occupied
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="rentalStatus"
                  value="available"
                  checked={rentalStatusFilter === 'available'}
                  onChange={() => setRentalStatusFilter('available')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatusFilter === 'available' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Available
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="rentalStatus"
                  value="ending_soon"
                  checked={rentalStatusFilter === 'ending_soon'}
                  onChange={() => setRentalStatusFilter('ending_soon')}
                  className="w-5 h-5 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatusFilter === 'ending_soon' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Ending soon
                </span>
              </label>
            </div>
          </div>

          {/* Rental Type Filters */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="rentalType"
                  value=""
                  checked={rentalTypeFilter === ''}
                  onChange={() => setRentalTypeFilter('')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalTypeFilter === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  All
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="rentalType"
                  value="monthly"
                  checked={rentalTypeFilter === 'monthly'}
                  onChange={() => setRentalTypeFilter('monthly')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalTypeFilter === 'monthly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Monthly
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name="rentalType"
                  value="airbnb"
                  checked={rentalTypeFilter === 'airbnb'}
                  onChange={() => setRentalTypeFilter('airbnb')}
                  className="w-5 h-5 text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalTypeFilter === 'airbnb' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Airbnb
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <PropertyList properties={properties} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default PropertiesPage;