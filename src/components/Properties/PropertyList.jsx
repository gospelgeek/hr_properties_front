import {useState,useEffect, use} from 'react';
import PropertyCard from './PropertyCard';
import { getPropertyRental, getRental, getPropertyRentals } from '../../api/rentals.api';
const PropertyList = ({ properties, onDelete, showRestoreButton = false, onRestore, isPublic = false }) => {


  const [rentals, setRentals] = useState([]);

useEffect(() => {
  async function fetchRentals() {
    const rentalsByProperty = {};
    for (const property of properties) {
      // Suponiendo que getPropertyRental retorna un array de rentals para una propiedad
      rentalsByProperty[property.id] = await getPropertyRentals(property.id);
    }
    setRentals(rentalsByProperty);
  }
  fetchRentals();
}, [properties]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No properties to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          rental={rentals[property.id] || []}
          onDelete={onDelete}
          showRestoreButton={showRestoreButton}
          onRestore={onRestore}
          isPublic={isPublic}
        />
      ))}
    </div>
  );
};

export default PropertyList;
