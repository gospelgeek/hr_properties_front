import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import ObligationCard from '../components/Finance/ObligationCard';
import { getObligations } from '../api/finance.api';

const ObligationsPage = () => {
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    temporality: '',
    search: '',
    ordering: '-due_date'
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadObligations();
  }, [filters]);

  const loadObligations = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.temporality) params.temporality = filters.temporality;
      if (filters.search) params.search = filters.search;
      if (filters.ordering) params.ordering = filters.ordering;
      
      const data = await getObligations(params);
      setObligations(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error loading obligations:', error);
      toast.error('Error loading obligations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Financial Obligations</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your obligations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by entity..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periodicity</label>
            <select
              value={filters.temporality}
              onChange={(e) => setFilters({ ...filters, temporality: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="monthly">Monthly</option>
              <option value="bimonthly">Bimonthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One Time</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order by</label>
            <select
              value={filters.ordering}
              onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-due_date">Most Recent Date</option>
              <option value="due_date">Oldest Date</option>
              <option value="-amount">Highest Amount</option>
              <option value="amount">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : obligations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No obligations</h3>
          <p className="text-gray-600 mb-4">Add obligations from properties</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-2 text-sm font-medium"
          >
            View Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obligations.map((obligation) => (
            <ObligationCard key={obligation.id} obligation={obligation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ObligationsPage;
