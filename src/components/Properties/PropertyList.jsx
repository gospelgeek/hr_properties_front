import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onDelete, showRestoreButton = false, onRestore }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No hay propiedades para mostrar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onDelete={onDelete}
          showRestoreButton={showRestoreButton}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
};

export default PropertyList;
