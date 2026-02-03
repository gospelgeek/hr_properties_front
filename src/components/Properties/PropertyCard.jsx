import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onDelete, showRestoreButton = false, onRestore }) => {
  const isActive = showRestoreButton ? false : (property.is_active !== false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Property Image */}
      {property.image_url && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={property.image_url}
            alt={property.name || property.address}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>';
            }}
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1 min-w-0">
            {property.name || property.address}
          </h2>
          {!showRestoreButton && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'Active' : 'Deleted'}
            </span>
          )}
        </div>

        {property.address && (
          <p className="text-gray-600 text-sm flex items-start gap-2 mb-4">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="flex-1">{property.address+", "+property.city+", "+property.state}</span>
          </p>
        )}

        {/* Quick Info */}
        {property.details && (
          <div className="flex flex-wrap gap-4 mb-5">
            {property.details.bedrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">{property.details.bedrooms} bed</span>
              </div>
            )}
            {property.details.bathrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11h6v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z" />
                </svg>
                <span className="font-medium">{property.details.bathrooms} bath</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-5 border-t border-gray-100 mt-5">
          {showRestoreButton ? (
            <>
              <Link
                to={`/property/${property.id}`}
                className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium px-4 py-2.5 text-sm"
              >
                View Details
              </Link>
              <button
                onClick={() => onRestore(property.id)}
                className="flex-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium px-4 py-2.5 text-sm"
              >
                Restore
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/property/${property.id}`}
                className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium px-4 py-2.5 text-sm"
              >
                View Details
              </Link>
              <Link
                to={`/edit/${property.id}`}
                className="flex-1 sm:flex-none border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2.5 text-sm text-center"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(property.id)}
                className="flex-1 sm:flex-none bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium px-4 py-2.5 text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
