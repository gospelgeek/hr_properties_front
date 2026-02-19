import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import RentalForm from '../components/Rentals/RentalForm';
import { getPropertyRental, updatePropertyRental } from '../api/rentals.api';
import { getProperty } from '../api/properties.api';

const EditRentalPage = () => {
  const { id, rentalId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [propertyData, rentalData] = await Promise.all([
          getProperty(id),
          getPropertyRental(id, rentalId)
        ]);
        setProperty(propertyData);
        setRental(rentalData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading rental');
        navigate(`/property/${id}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, rentalId, navigate]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updatePropertyRental(id, rentalId, data);
      toast.success('Rental updated successfully');
      navigate(`/property/${id}/rentals/${rentalId}`);
    } catch (error) {
      console.error('Error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.detail || 'Error updating rental');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!property || !rental) return null;

  // Preparar initialData con todos los campos del rental
  const initialData = {
    tenant: rental.tenant?.id || '',
    rental_type: property.rental_type,
    check_in: rental.check_in || '',
    check_out: rental.check_out || '',
    amount: rental.amount || '',
    people_count: rental.people_count || '',
    deposit_amount: rental.monthly_data?.deposit_amount || rental.airbnb_data?.deposit_amount || '',
    is_refundable: rental.monthly_data?.is_refundable || false,
    is_paid: rental.airbnb_data?.is_paid || false
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/property/${id}/rentals/${rentalId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Rental
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Rental</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Edit rental for: <span className="font-semibold">{property.name || property.address}</span>
        </p>
      </div>

      <RentalForm 
        initialData={initialData}
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
};

export default EditRentalPage;
