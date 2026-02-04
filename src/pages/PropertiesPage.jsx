import React, { useEffect, useState } from 'react';
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
  
  // Filters state
  const [useFilter, setUseFilter] = useState('');
  const [rentalStatusFilters, setRentalStatusFilters] = useState([]);
  const [rentalTypeFilters, setRentalTypeFilters] = useState([]);

  useEffect(() => {
    // Sync filters from URL params
    const use = searchParams.get('use') || '';
    const rentalStatus = searchParams.get('rental_status');
    const rentalType = searchParams.get('rental_type');
    
    setUseFilter(use);
    setRentalStatusFilters(rentalStatus ? rentalStatus.split(',') : []);
    setRentalTypeFilters(rentalType ? rentalType.split(',') : []);
  }, [searchParams]);

  useEffect(() => {
    // Update URL when filters change
    const params = {};
    if (useFilter) params.use = useFilter;
    if (rentalStatusFilters.length > 0) params.rental_status = rentalStatusFilters.join(',');
    if (rentalTypeFilters.length > 0) params.rental_type = rentalTypeFilters.join(',');
    
    setSearchParams(params);
    loadProperties();
  }, [useFilter, rentalStatusFilters, rentalTypeFilters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = {};
      if (useFilter) params.use = useFilter;
      if (rentalStatusFilters.length > 0) params.rental_status = rentalStatusFilters.join(',');
      if (rentalTypeFilters.length > 0) params.rental_type = rentalTypeFilters.join(',');
      
      const data = await getProperties(params);
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

  const toggleRentalStatusFilter = (status) => {
    setRentalStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleRentalTypeFilter = (type) => {
    setRentalTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setUseFilter('');
    setRentalStatusFilters([]);
    setRentalTypeFilters([]);
    setSearchParams({});
  };

  const hasActiveFilters = useFilter || rentalStatusFilters.length > 0 || rentalTypeFilters.length > 0;
console.log({ useFilter, rentalStatusFilters, rentalTypeFilters });
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
              <button
                onClick={() => toggleRentalStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatusFilters.includes('all')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => toggleRentalStatusFilter('occupied')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatusFilters.includes('occupied')
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Occupied
              </button>
              <button
                onClick={() => toggleRentalStatusFilter('available')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatusFilters.includes('available')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
            </div>
          </div>

          {/* Rental Type Filters */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleRentalTypeFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalTypeFilters.includes('all')
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => toggleRentalTypeFilter('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalTypeFilters.includes('monthly')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => toggleRentalTypeFilter('airbnb')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalTypeFilters.includes('airbnb')
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Airbnb
              </button>
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
