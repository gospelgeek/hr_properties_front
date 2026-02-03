import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import { getProperty, getPropertyFinancials } from '../api/properties.api';

const PropertyFinancialPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propertyData, financialsData] = await Promise.all([
        getProperty(id),
        getPropertyFinancials(id)
      ]);
      setProperty(propertyData);
      setFinancials(financialsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading financial data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <Loader />;
  }

  if (!property || !financials) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Property not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/property/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-gray-600 mt-1">Financial Balance</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Income Row */}
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div>
                <div className="text-base font-semibold text-gray-900">Total Income</div>
                {financials.income_breakdown && (
                  <div className="text-sm text-gray-500 mt-1">
                    Rentals: {formatCurrency(financials.income_breakdown.rentals || 0)}
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(financials.total_income || 0)}
              </div>
            </div>

            {/* Expenses Row */}
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div>
                <div className="text-base font-semibold text-gray-900">Total Expenses</div>
                {financials.expense_breakdown && (
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <div>Obligations: {formatCurrency(financials.expense_breakdown.obligations || 0)}</div>
                    <div>Repairs: {formatCurrency(financials.expense_breakdown.repairs || 0)}</div>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-red-600">
                {formatCurrency(financials.total_expenses || 0)}
              </div>
            </div>

            {/* Balance Row */}
            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-6">
              <div className="text-lg font-bold text-gray-900">Net Balance</div>
              <div className={`text-4xl font-bold ${
                (financials.net_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(financials.net_balance || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      
    </div>
  );
};

export default PropertyFinancialPage;
