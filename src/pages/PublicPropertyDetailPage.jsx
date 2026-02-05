import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import { getProperty } from '../api/properties.api';

const PublicPropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await getProperty(id);
      setProperty(data);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <button
            onClick={() => navigate('/public-properties')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <button
                onClick={() => navigate('/public-properties')}
                className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to properties
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{property.name || property.address}</h1>
              {property.address && (
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.address}, {property.city}, {property.state}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors px-6 py-3 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {property.image_url && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={property.image_url}
                  alt={property.name || property.address}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Property Details */}
            {property.details && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.details.bedrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="font-semibold text-gray-900">{property.details.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.details.bathrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="font-semibold text-gray-900">{property.details.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.details.area && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-semibold text-gray-900">{property.details.area} m²</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-3">
                {property.use && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900 capitalize">{property.use}</span>
                  </div>
                )}
                {property.rental_status && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      property.rental_status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.rental_status === 'available' ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                )}
                {property.rental_type && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Rental Type</span>
                    <span className="font-medium text-gray-900 capitalize">{property.rental_type}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Interested in this property?
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors py-3 font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              Need more information? {' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </button>
              {' or '}
              <button 
                onClick={() => navigate('/public-properties')} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                view more properties
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPropertyDetailPage;
