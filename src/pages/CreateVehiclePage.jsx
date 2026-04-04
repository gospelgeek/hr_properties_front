import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import VehicleForm from '../components/Vehicles/VehicleForm';
import { createVehicle } from '../api/vehicles.api';

const CreateVehiclePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await createVehicle(data);
      toast.success('Vehicle created successfully');
      navigate('/vehicles');
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Error creating vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/vehicles" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to vehicles
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Vehicle</h1>

      <VehicleForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default CreateVehiclePage;
