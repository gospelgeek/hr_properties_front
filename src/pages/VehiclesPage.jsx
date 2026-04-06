import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import VehicleList from '../components/Vehicles/VehicleList';
import { getVehicles } from '../api/vehicles.api';

const vehicleTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'sport', label: 'Sport' },
  { value: 'permanent_use', label: 'Permanent Use' },
  { value: 'water', label: 'Water' },
];

const VehiclesPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Error loading vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const normalizedTypeFilter = String(typeFilter || '').toLowerCase();
    const term = searchTerm.trim().toLowerCase();

    let currentVehicles = vehicles;

    if (normalizedTypeFilter) {
      currentVehicles = currentVehicles.filter((vehicle) => {
        const vehicleType = String(vehicle?.type || vehicle?.vehicle_type || '').toLowerCase();
        return vehicleType === normalizedTypeFilter;
      });
    }

    if (!term) return currentVehicles;

    return currentVehicles.filter((vehicle) => {
      const responsibleNames = (vehicle.responsibles || []).map((item) => String(item?.name || '').toLowerCase()).join(' ');
      return (
        String(vehicle?.owner || '').toLowerCase().includes(term) ||
        String(vehicle?.brand || '').toLowerCase().includes(term) ||
        String(vehicle?.model || '').toLowerCase().includes(term) ||
        responsibleNames.includes(term)
      );
    });
  }, [vehicles, searchTerm, typeFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Vehicles</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your vehicles</p>
        </div>
        <button
          onClick={() => navigate('/vehicles/create')}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm hover:shadow-md whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Vehicle</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-45"
            >
              {vehicleTypeOptions.map((item) => (
                <option key={item.value || 'all'} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 max-w-xl relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by owner, brand, model or responsible..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm placeholder-gray-500 text-sm font-medium transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? <Loader /> : <VehicleList vehicles={filteredVehicles} />}
    </div>
  );
};

export default VehiclesPage;
