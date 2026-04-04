import React from 'react';
import { Link } from 'react-router-dom';
import autoImg from '../../assets/auto.png';

const vehicleTypeLabels = {
  commercial: 'Commercial',
  sport: 'Sport',
  permanent_use: 'Permanent Use',
  water: 'Water',
};

const vehicleTypeBadgeClass = {
  commercial: 'bg-amber-100 text-amber-800',
  sport: 'bg-red-100 text-red-800',
  permanent_use: 'bg-blue-100 text-blue-800',
  water: 'bg-cyan-100 text-cyan-800',
};

const VehicleCard = ({ vehicle }) => {
  const type = String(vehicle?.type || '').toLowerCase();
  const typeLabel = vehicleTypeLabels[type] || 'Unknown';
  const badgeClass = vehicleTypeBadgeClass[type] || 'bg-gray-100 text-gray-700';

  const responsibles = Array.isArray(vehicle?.responsibles) ? vehicle.responsibles : [];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="aspect-5/2 bg-gray-100 overflow-hidden">
        <img
          src={vehicle?.photo || autoImg}
          alt={`${vehicle?.brand || ''} ${vehicle?.model || ''}`.trim() || 'Vehicle photo'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = autoImg;
          }}
        />
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1 min-w-0">
            {vehicle?.brand || 'Unknown brand'} {vehicle?.model || ''}
          </h2>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
            {typeLabel}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium text-gray-800">Owner:</span> {vehicle?.owner || 'Not specified'}
        </p>

        <p className="text-sm text-gray-600 mb-5">
          <span className="font-medium text-gray-800">Responsible:</span>{' '}
          {responsibles.length > 0
            ? responsibles.slice(0, 2).map((item) => item?.name).filter(Boolean).join(', ')
            : 'Not assigned'}
          {responsibles.length > 2 ? '...' : ''}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="w-full inline-flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-4 py-2.5 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
