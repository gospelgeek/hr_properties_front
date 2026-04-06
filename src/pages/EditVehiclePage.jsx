import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import VehicleForm from '../components/Vehicles/VehicleForm';
import { getVehicleById, updateVehicle } from '../api/vehicles.api';

const EditVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const data = await getVehicleById(id);
      setVehicle(data);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      toast.error('Error loading vehicle');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateVehicle(id, data);
      toast.success('Vehicle updated successfully');
      navigate(`/vehicles/${id}`);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Error updating vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Vehicle not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/vehicles/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to details
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Vehicle</h1>

      <VehicleForm initialData={vehicle} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default EditVehiclePage;
