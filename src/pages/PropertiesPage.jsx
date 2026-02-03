import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyList from '../components/Properties/PropertyList';
import Loader from '../components/UI/Loader';
import { getProperties, deleteProperty } from '../api/properties.api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFilter, setUseFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, [useFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = useFilter ? { use: useFilter } : {};
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your properties</p>
        </div>
        <div className="flex gap-3">
          <select
            value={useFilter}
            onChange={(e) => setUseFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="rental">Rental</option>
            <option value="personal">Personal</option>
            <option value="commercial">Commercial</option>
          </select>
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

      {loading ? (
        <Loader />
      ) : (
        <PropertyList properties={properties} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default PropertiesPage;
