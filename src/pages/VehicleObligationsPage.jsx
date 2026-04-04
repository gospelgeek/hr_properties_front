import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import VehicleObligationCard from '../components/Vehicles/VehicleObligationCard';
import { getVehicleById, getVehicleObligations } from '../api/vehicles.api';

const VehicleObligationsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [vehicleData, obligationsData] = await Promise.all([getVehicleById(id), getVehicleObligations(id)]);
        setVehicle(vehicleData);
        setObligations(Array.isArray(obligationsData) ? obligationsData : []);
      } catch (error) {
        console.error('Error loading obligations:', error);
        toast.error('Error loading obligations');
        navigate(`/vehicles/${id}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
        <div>
          <Link to={`/vehicles/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to vehicle
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicle Obligations</h1>
          <p className="text-gray-600 mt-1">{vehicle?.brand} {vehicle?.model}</p>
        </div>
        <button
          onClick={() => navigate(`/vehicles/${id}/add-obligation`)}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-4 py-2.5"
        >
          Add Obligation
        </button>
      </div>

      {obligations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No obligations registered for this vehicle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obligations.map((item) => (
            <VehicleObligationCard key={item.id} obligation={item} vehicleId={id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleObligationsPage;
