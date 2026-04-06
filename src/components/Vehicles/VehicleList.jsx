import React from 'react';
import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles }) => {
  if (!vehicles.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h6m-6-4h6m-6-4h6m5 9H4a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
        <p className="text-gray-600">Try adjusting filters or create a new vehicle.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
