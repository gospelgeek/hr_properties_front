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

  // Estado para desplegar items
  const [expandedIncome, setExpandedIncome] = useState({});
  const [expandedExpense, setExpandedExpense] = useState({});

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
      console.log('Financial data loaded:', financialsData);
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

  // Toggle income item
  const toggleIncomeItem = (type, id) => {
    setExpandedIncome(prev => ({
      ...prev,
      [`${type}_${id}`]: !prev[`${type}_${id}`]
    }));
  };

  // Toggle expense item
  const toggleExpenseItem = (type, id) => {
    setExpandedExpense(prev => ({
      ...prev,
      [`${type}_${id}`]: !prev[`${type}_${id}`]
    }));
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

        <div className="p-6 space-y-6">
          {/* Income Section */}
          <div>
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div className="text-base font-semibold text-gray-900">Total Income</div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(financials.income?.total || 0)}
              </div>
            </div>
            {/* Income Items */}
            {financials.income?.rental_payments?.map(item => (
              <div key={item.id} className="border-b border-gray-100 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Rental Payment #{item.id}</span>
                  <span className="font-semibold text-green-700">{formatCurrency(item.amount)}</span>
                  <button
                    className="ml-2 text-xs text-blue-600 hover:underline"
                    onClick={() => toggleIncomeItem('rental', item.id)}
                  >
                    {expandedIncome[`rental_${item.id}`] ? 'Hide details' : 'View details'}
                  </button>
                </div>
                {expandedIncome[`rental_${item.id}`] && (
                  <div className="mt-2 text-xs text-gray-600 bg-blue-50 rounded p-2">
                    {/* Muestra detalles del item, puedes personalizar */}
                    <div>Amount: {item.amount}</div>
                    <div>Date: {item.date}</div>
                    <div>Location: {item.payment_location}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Expenses Section */}
          <div>
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div className="text-base font-semibold text-gray-900">Total Expenses</div>
              <div className="text-3xl font-bold text-red-600">
                {financials.expenses.total || 0}
              </div>
            </div>
            {/* Obligation Payments */}
            {financials.expenses?.obligation_payments?.map(item => (
              <div key={item.id} className="border-b border-gray-100 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Obligation Payment #{item.id}</span>
                  <span className="font-semibold text-red-700">{formatCurrency(item.amount)}</span>
                  <button
                    className="ml-2 text-xs text-blue-600 hover:underline"
                    onClick={() => toggleExpenseItem('obligation', item.id)}
                  >
                    {expandedExpense[`obligation_${item.id}`] ? 'Hide details' : 'View details'}
                  </button>
                </div>
                {expandedExpense[`obligation_${item.id}`] && (
                  <div className="mt-2 text-xs text-gray-600 bg-red-50 rounded p-2">
                    <div>Obligation: {item.obligation_name}</div>
                    <div>Date: {item.date}</div>
                    <div>Amount: {formatCurrency(item.amount)}</div>
                  </div>
                )}
              </div>
            ))}
            {/* Repairs */}
            {financials.expenses.repairs.map(item => (
              <div key={item.id} className="border-b border-gray-100 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Repair #{item.id}</span>
                  <span className="font-semibold text-red-700">{formatCurrency(item.cost)}</span>
                  <button
                    className="ml-2 text-xs text-blue-600 hover:underline"
                    onClick={() => toggleExpenseItem('repair', item.id)}
                  >
                    {expandedExpense[`repair_${item.id}`] ? 'Hide details' : 'View details'}
                  </button>
                </div>
                {expandedExpense[`repair_${item.id}`] && (
                  <div className="mt-2 text-xs text-gray-600 bg-yellow-50 rounded p-2">
                    <div>Date: {item.date}</div>
                    <div>Description: {item.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Balance Row */}
          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-6">
            <div className="text-lg font-bold text-gray-900">Net Balance</div>
            <div className={`text-4xl font-bold ${
              (financials.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(financials.balance || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFinancialPage;