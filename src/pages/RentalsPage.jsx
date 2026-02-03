import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import RentalCard from '../components/Rentals/RentalCard';
import { getRentals } from '../api/rentals.api';

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await getRentals();
      setRentals(data);
    } catch (error) {
      console.error('Error loading rentals:', error);
      toast.error('Error loading rentals');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRentals = () => {
    const today = new Date();
    
    if (filter === 'active') {
      return rentals.filter(rental => {
        const checkOut = new Date(rental.check_out);
        return checkOut >= today;
      });
    } else if (filter === 'ended') {
      return rentals.filter(rental => {
        const checkOut = new Date(rental.check_out);
        return checkOut < today;
      });
    } else if (filter === 'monthly') {
      return rentals.filter(rental => rental.rental_type === 'monthly');
    } else if (filter === 'airbnb') {
      return rentals.filter(rental => rental.rental_type === 'airbnb');
    }
    
    return rentals;
  };

  const filteredRentals = getFilteredRentals();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Rentals</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your rentals</p>
        </div>
        <button
          onClick={() => navigate('/tenants')}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-5 py-3 font-medium"
        >
          Manage Tenants
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('ended')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'ended'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Ended
        </button>
        <button
          onClick={() => setFilter('monthly')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setFilter('airbnb')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'airbnb'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Airbnb
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : filteredRentals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Create rentals from properties of type rental'
              : `No rentals ${filter === 'active' ? 'active' : filter === 'ended' ? 'ended' : filter}`}
          </p>
          <button
            onClick={() => navigate('/')}
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
