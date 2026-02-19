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
  const [showMedia, setShowMedia] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

const useLabels = {
  rental: "Rental",
  personal: "Personal",
  commercial: "Commercial"
}

const useLabelBuilding = {
  apartment: "Apartment",
  house: "House",
  office: "Office"
}

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

    const handlePrevMedia = () => {
    if (selectedMediaIndex > 0) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    }
  };

  const handleNextMedia = () => {
    if (selectedMediaIndex < property.media.length - 1) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
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

                {/* General Information */}
  <div className="mb-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
    {/* Columna izquierda: cuadros pequeños */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Use Type</div>
        <div className="text-xl font-semibold text-gray-900">{ useLabels[property.use] || 'Not specified'}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Building Type</div>
        <div className="text-xl font-semibold text-gray-900">{useLabelBuilding[property.type_building] || 'Not specified'}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 ">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">City</div>
        <div className="text-xl font-semibold text-gray-900">{property.city || 'Not specified'}</div>
      </div>
    </div>
    {/* Columna derecha: mapa */}
    {property.map_url && (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 h-64 max-w-full">
          <iframe
            src={property.map_url}
            width="100%"
            height="100%"
            className="w-full h-full rounded-lg"
            style={{ border: 0,  minHeight: '256px', minWidth: '100%'  }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Property Location Map"
          ></iframe>
        </div>
      </div>
    )}
  </div>
</div>

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
                   {property.details.half_bathrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Half Bathrooms</p>
                        <p className="font-semibold text-gray-900">{property.details.half_bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.details.floors && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 5 9-5-9-5-9 5zm0 7l9 5 9-5m-18 0l9 5 9-5" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Floors</p>
                        <p className="font-semibold text-gray-900">{property.details.floors}</p>
                      </div>
                    </div>
                  )}
                  {property.details.buildings && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21V9a2 2 0 012-2h2a2 2 0 012 2v12m6 0V5a2 2 0 012-2h2a2 2 0 012 2v16" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Storage</p>
                        <p className="font-semibold text-gray-900">{property.details.buildings}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
{property.media && property.media.length > 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowMedia(!showMedia)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Multimedia Files ({property.media.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showMedia ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMedia && (
                <div className="px-6 pb-6">
                  {/* Carousel View */}
                  {selectedMediaIndex !== null ? (
                    <div className="mt-4">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
                        {/* Main Media Display */}
                        <div className="relative bg-gray-900">
                          {property.media[selectedMediaIndex].media_type === 'image' && property.media[selectedMediaIndex].url && (
                            <img
                              src={property.media[selectedMediaIndex].url}
                              alt={`Media ${selectedMediaIndex + 1}`}
                              className="w-full max-h-[600px] object-contain"
                            />
                          )}
                          {property.media[selectedMediaIndex].media_type === 'video' && property.media[selectedMediaIndex].url && (
                            <video
                              src={property.media[selectedMediaIndex].url}
                              controls
                              className="w-full max-h-[600px] object-contain"
                            />
                          )}
                          {property.media[selectedMediaIndex].media_type === 'document' && (
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Navigation Arrows */}
                          {property.media.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevMedia}
                                disabled={selectedMediaIndex === 0}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={handleNextMedia}
                                disabled={selectedMediaIndex === property.media.length - 1}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}
                          
                          {/* Close Button */}
                          <button
                            onClick={() => setSelectedMediaIndex(null)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Media Info */}
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                property.media[selectedMediaIndex].media_type === 'image' ? 'bg-blue-100 text-blue-800' :
                                property.media[selectedMediaIndex].media_type === 'video' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {property.media[selectedMediaIndex].media_type === 'image' ? 'Image' :
                                 property.media[selectedMediaIndex].media_type === 'video' ? 'Video' : 'Document'}
                              </span>
                              <span className="text-sm text-gray-600">
                                {selectedMediaIndex + 1} of {property.media.length}
                              </span>
                            </div>
                            {property.media[selectedMediaIndex].url && (
                              <a
                                href={property.media[selectedMediaIndex].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Open in new tab
                              </a>
                            )}
                          </div>
                          {property.media[selectedMediaIndex].uploaded_at && (
                            <p className="text-xs text-gray-500 mt-2">
                              Uploaded: {new Date(property.media[selectedMediaIndex].uploaded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Grid View */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {property.media.map((media, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedMediaIndex(index)}
                        >
                          {/* Media Thumbnail */}
                          {media.media_type === 'image' && media.url && (
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                              <img
                                src={media.url}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          {media.media_type === 'video' && media.url && (
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          )}
                          {media.media_type === 'document' && (
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Type Badge */}
                          <div className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              media.media_type === 'image' ? 'bg-blue-100 text-blue-800' :
                              media.media_type === 'video' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {media.media_type === 'image' ? 'Image' :
                               media.media_type === 'video' ? 'Video' : 'Document'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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
                {property.status && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      property.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.status === 'available' ? 'Available' : 'Occupied'}
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
