import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import RentalCard from '../components/Rentals/RentalCard';
import { getRentals } from '../api/rentals.api';

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentalStatus, setRentalStatus] = useState('all');
  const [rentalType, setRentalType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await getRentals();
      //console.log('Loaded rentals:', data);
      setRentals(data);
    } catch (error) {
      console.error('Error loading rentals:', error);
      toast.error('Error loading rentals');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRentals = () => {
    let filtered = rentals;

    // Rental Status filter
    if (rentalStatus === 'occupied') {
      filtered = filtered.filter(rental => rental.status === 'occupied');
    } else if (rentalStatus === 'available') {
      filtered = filtered.filter(rental => rental.status === 'available');
    } else if (rentalStatus === 'ending_soon') {
      const today = new Date();
      filtered = filtered.filter(rental => {
        const checkOut = new Date(rental.check_out);
        const diffDays = (checkOut - today) / (1000 * 60 * 60 * 24);
        return rental.status === 'occupied' && diffDays <= 30 && diffDays >= 0;
      });
    }

    // Rental Type filter
    if (rentalType === 'monthly') {
      filtered = filtered.filter(rental => rental.rental_type === 'monthly');
    } else if (rentalType === 'airbnb') {
      filtered = filtered.filter(rental => rental.rental_type === 'airbnb');
    }

    return filtered;
  };

  const filteredRentals = getFilteredRentals();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Rentals</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your rentals</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Rental Status - Izquierda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rental Status</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rentalStatus"
                  value="occupied"
                  checked={rentalStatus === 'occupied'}
                  onChange={() => setRentalStatus('occupied')}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatus === 'occupied'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  Occupied
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rentalStatus"
                  value="available"
                  checked={rentalStatus === 'available'}
                  onChange={() => setRentalStatus('available')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatus === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  Available
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rentalStatus"
                  value="ending_soon"
                  checked={rentalStatus === 'ending_soon'}
                  onChange={() => setRentalStatus('ending_soon')}
                  className="w-5 h-5 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalStatus === 'ending_soon'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  Ending soon
                </span>
              </label>
            </div>
          </div>

          {/* Rental Type - Derecha */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rentalType"
                  value="all"
                  checked={rentalType === 'all'}
                  onChange={() => setRentalType('all')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  All
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rentalType"
                  value="monthly"
                  checked={rentalType === 'monthly'}
                  onChange={() => setRentalType('monthly')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalType === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  Monthly
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rentalType"
                  value="airbnb"
                  checked={rentalType === 'airbnb'}
                  onChange={() => setRentalType('airbnb')}
                  className="w-5 h-5 text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  rentalType === 'airbnb'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  Airbnb
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : filteredRentals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals</h3>
          <p className="text-gray-600 mb-4">
            {rentalStatus === 'all' 
              ? 'Create rentals from properties of type rental'
              : `No rentals ${rentalStatus === 'available' ? 'available' : rentalStatus === 'occupied' ? 'occupied' : rentalStatus}`}
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-2 text-sm font-medium"
          >
            View Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} propertyId={rental.property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalsPage;