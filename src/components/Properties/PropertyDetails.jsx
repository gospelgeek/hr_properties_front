import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPropertyRepairsCost, getPropertyFinancials } from '../../api/properties.api';
import DeletePropertyButton from './DeletePropertyButton';

const PropertyDetails = ({ property, onDelete }) => {
  const [showInventory, setShowInventory] = useState(false);
  const [showRepairs, setShowRepairs] = useState(false);
  const [showLaws, setShowLaws] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [repairsCost, setRepairsCost] = useState(null);
  const [loadingRepairsCost, setLoadingRepairsCost] = useState(false);
  const [showFinancials, setShowFinancials] = useState(false);
  const [financials, setFinancials] = useState(null);
  const [loadingFinancials, setLoadingFinancials] = useState(false);

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
console.log('Rendering PropertyDetails with property:', property);
  useEffect(() => {
    if (property && property.id) {
      loadRepairsCost();
    }
  }, [property]);

  const loadRepairsCost = async () => {
    try {
      setLoadingRepairsCost(true);
      const data = await getPropertyRepairsCost(property.id);
      setRepairsCost(data);
    } catch (error) {
      console.error('Error loading repairs cost:', error);
    } finally {
      setLoadingRepairsCost(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const loadFinancials = async () => {
    try {
      setLoadingFinancials(true);
      const data = await getPropertyFinancials(property.id);
      setFinancials(data);
    } catch (error) {
      console.error('Error loading financials:', error);
    } finally {
      setLoadingFinancials(false);
    }
  };

  const handleToggleFinancials = async () => {
    if (!showFinancials && !financials) {
      await loadFinancials();
    }
    setShowFinancials(!showFinancials);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Property Image */}
      {property.image_url && (
        <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-100 overflow-hidden">
          <img
            src={property.image_url}
            alt={property.name || property.address}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700"><svg class="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>';
            }}
          />
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.name}</h1>
        <p className="flex items-center gap-2 text-blue-100">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.address+", "+property.city+", "+property.state+", "+property.zip_code}</span>
        </p>
        {/* Action buttons in header */}
        <div className="flex flex-wrap gap-3 mt-6 justify-between items-center">
          <button
            onClick={handleToggleFinancials}
            className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showFinancials ? 'Hide Financials' : 'View Financials'}
          </button>
          
          <div className="flex gap-3">
            <Link
              to={`/edit/${property.id}`}
              className="bg-white text-blue-700 rounded-lg hover:bg-white-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Property
            </Link>
            {onDelete && <DeletePropertyButton propertyId={property.id} onDelete={onDelete} />}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Toggle between General Info and Financials */}
        {!showFinancials ? (
          <>
            {/* General Information */}
            <div className="mb-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Columna izquierda: cuadros pequeños */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 ">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rental Type</div>
        <div className="text-xl font-semibold text-gray-900">{property.rental_type ? property.rental_type.charAt(0).toUpperCase() + property.rental_type.slice(1) : 'Not specified'}</div>
      </div>
    </div>
    {/* Columna derecha: mapa */}
    {property.map_url && (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 h-64">
          <iframe
            src={property.map_url}
            width="100%"
            height="100%"
            style={{ border: 0 }}
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
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.details.bedrooms !== null && property.details.bedrooms !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Bedrooms</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.bedrooms}</div>
                </div>
              )}
              {property.details.bathrooms !== null && property.details.bathrooms !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Bathrooms</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.bathrooms}</div>
                </div>
              )}
              {property.details.half_bathrooms !== null && property.details.half_bathrooms !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Half Bathrooms</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.half_bathrooms}</div>
                </div>
              )}
              {property.details.floors !== null && property.details.floors !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Floors</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.floors}</div>
                </div>
              )}
              {property.details.buildings !== null && property.details.buildings !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Storage</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.buildings}</div>
                </div>
              )}
            </div>
            {property.details.observations && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-4 rounded">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <strong className="text-blue-900">Observations:</strong>
                    <p className="text-blue-800 mt-1">{property.details.observations}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          <>
            {/* Financial Information */
            //console.log(financials)
            }
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Financial Balance</h2>
                <button
                  onClick={() => setShowFinancials(false)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Details
                </button>
              </div>

              {loadingFinancials ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : financials ? (
                <div className="space-y-4">
                  {/* Income Row */}
                 {/* Income Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <div className="text-base font-semibold text-gray-900">Total Income</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(financials.income?.total || 0)}
          </div>
        </div>
                    
                        {/* Rental Payments */}
        {financials.income?.rental_payments?.map(item => (
          <details key={item.id} className="mb-2">
            <summary className="cursor-pointer flex justify-between items-center px-2 py-1 rounded hover:bg-blue-50">
              <span className="text-sm text-gray-700">Rental Payment #{item.id}</span>
              <span className="font-semibold text-green-700">{formatCurrency(item.amount)}</span>
            </summary>
            <div className="ml-4 mt-1 text-xs text-gray-600 bg-blue-50 rounded p-2">
              {/* Personaliza los campos según tu modelo */}
              <div>Date: {item.date}</div>
              <div>Location: {item.payment_location}</div>
            </div>
          </details>
        ))}
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <div className="text-base font-semibold text-gray-900">Total Expenses</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(financials.expenses?.total || 0)}
          </div>
        </div>
         {/* Obligation Payments */}
        {financials.expenses?.obligation_payments?.map(item => (
          <details key={item.id} className="mb-2">
            <summary className="cursor-pointer flex justify-between items-center px-2 py-1 rounded hover:bg-red-50">
              <span className="text-sm text-gray-700">Obligation Payment #{item.id}</span>
              <span className="font-semibold text-red-700">{formatCurrency(item.amount)}</span>
            </summary>
            <div className="ml-4 mt-1 text-xs text-gray-600 bg-red-50 rounded p-2">
              <div>{item.obligation_name}</div>
              <div>Date: {item.date}</div>
              <div>Payment method: {item.payment_method_name.charAt(0).toUpperCase()+item.payment_method_name.slice(1)}</div>
            </div>
          </details>
        ))}
         {/* Repairs */}
        {financials.expenses?.repairs?.map(item => (
          <details key={item.id} className="mb-2">
            <summary className="cursor-pointer flex justify-between items-center px-2 py-1 rounded hover:bg-yellow-50">
              <span className="text-sm text-gray-700">Repair #{item.id}</span>
              <span className="font-semibold text-red-700">{formatCurrency(item.cost)}</span>
            </summary>
            <div className="ml-4 mt-1 text-xs text-gray-600 bg-yellow-50 rounded p-2">
              <div>Date: {item.date}</div>
              <div>Description: {item.description}</div>
            </div>
          </details>
        ))}
      </div>
                  {/* Balance Row */}
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-6 shadow-md">
                    <div className="text-lg font-bold text-gray-900">Net Balance</div>
                    <div className={`text-4xl font-bold ${
                      (financials.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(financials.balance || 0)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No financial data available
                </div>
              )}
            </div>
          </>
        )}
        
        {!showFinancials && (
          <>
        {/* Multimedia Files */}
        {property.media && property.media.length >= 0 && (
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
                  <Link 
            to={`/property/${property.id}/upload-media`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium px-4 py-2 text-sm inline-flex items-center gap-2 mb-4 mt-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Media
          </Link>
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
        {/* Repairs */}
        {property.repairs && property.repairs.length >= 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowRepairs(!showRepairs)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Repairs ({property.repairs.length})
                  </h3>
                  {repairsCost && (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                      Total: {formatCurrency(  property.repairs.reduce((sum, repair) => sum + (parseFloat(repair.cost) || 0), 0))}
                    </span>
                  )}
                  {loadingRepairsCost && (
                    <span className="text-sm text-gray-500">Loading cost...</span>
                  )}
                </div>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showRepairs ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showRepairs && (
                <div className="px-6 pb-6">
                  <Link 
            to={`/property/${property.id}/add-repair`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium px-4 py-2 text-sm inline-flex items-center gap-2 mb-4 mt-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Repair
          </Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {property.repairs.map((repair, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {repair.description || 'Repair'}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            {formatCurrency(parseFloat(repair.cost))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Date:</span> {new Date(repair.date).toLocaleDateString()}
                        </p>
                        {repair.observation && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Observation:</span> {repair.observation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory/Items */}
        {property.inventory && property.inventory.length >= 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowInventory(!showInventory)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Inventory Items ({property.inventory.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showInventory ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showInventory && (
                <div className="px-6 pb-6">
                   <Link 
            to={`/property/${property.id}/add-enser`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium px-4 py-2 text-sm inline-flex items-center gap-2 mb-4 mt-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {property.inventory.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {item.enser?.name || 'Unnamed'}
                          </h3>
                          {item.enser?.price && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                              {formatCurrency(parseFloat(item.enser.price))}
                            </span>
                          )}
                        </div>
                        {item.enser?.condition && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium text-gray-700">Condition:</span> {item.enser.condition}
                          </p>
                        )}
                        {item.url_media && (
                          <a
                            href={item.url_media}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            View image
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Laws/Documents */}
        {property.laws && property.laws.length >= 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowLaws(!showLaws)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Documents and Regulations ({property.laws.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showLaws ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLaws && (
                <div className="px-6 pb-6">
                  <Link 
            to={`/property/${property.id}/add-law`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium px-4 py-2 text-sm inline-flex items-center gap-2 mb-4 mt-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Documentation
          </Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {property.laws.map((law, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {law.entity_name || 'Unnamed Entity'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            law.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {law.is_paid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Legal Number:</span> {law.legal_number}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Amount:</span> {formatCurrency(parseFloat(law.original_amount))}
                        </p>
                        {law.url && (
                          <a
                            href={law.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            View document
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Footer Info - Only show when not in financials view */}
        {!showFinancials && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-700">Created:</span> {new Date(property.created_at).toLocaleString()}
              </div>
              {property.updated_at && (
                <div>
                  <span className="font-medium text-gray-700">Last updated:</span> {new Date(property.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
