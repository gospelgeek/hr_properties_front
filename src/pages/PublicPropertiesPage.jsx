import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyList from '../components/Properties/PropertyList';
import Loader from '../components/UI/Loader';
import { getProperties } from '../api/properties.api';
import { useAuth } from '../context/AuthContext';

const PublicPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadAvailableProperties();
  }, []);

  const loadAvailableProperties = async () => {
    try {
      setLoading(true);
      // Filtrar solo propiedades disponibles
      const data = await getProperties({ rental_status: 'available' });
      //console.log('Loaded properties:', data);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Properties</h1>
              <p className="text-gray-600">Explore our rental properties</p>
            </div>
              {!isAuthenticated() && (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-3 font-medium shadow-sm hover:shadow-md"
            >
              Login
            </button>
              )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Loader />
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties available</h3>
            <p className="text-gray-600">Check back soon for new options</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{properties.length}</span> {properties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <PropertyList properties={properties} onDelete={null} isPublic={true} />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Interested in a property? <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium">Login</button> for more information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPropertiesPage;
