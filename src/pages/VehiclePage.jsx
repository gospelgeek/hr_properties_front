import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import VehicleDetails from '../components/Vehicles/VehicleDetails';
import { deleteVehicle, getVehicleById } from '../api/vehicles.api';

const VehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await deleteVehicle(id);
      toast.success('Vehicle deleted successfully');
      navigate('/vehicles');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Error deleting vehicle');
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
    <div>
      <div className="mb-6">
        <Link to="/vehicles" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to vehicles</span>
        </Link>
      </div>

      <VehicleDetails vehicle={vehicle} onReload={loadVehicle} onDelete={handleDelete} />
    </div>
  );
};

export default VehiclePage;
