import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import DashboardCard from '../components/Finance/DashboardCard';
import { getDashboard } from '../api/finance.api';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getPropertyCountByUse = (use) => {
    const item = dashboardData.properties.by_use.find(p => p.use.toLowerCase() === use.toLowerCase());
    return item ? item.count : 0;
  };

  if (loading) return <Loader />;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">System overview</p>
      </div>

      {/* Financial Obligations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Obligations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Obligations"
            value={dashboardData.obligations.total_count}
            subtitle={formatCurrency(dashboardData.obligations.total_amount)}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <DashboardCard
            title="Total Paid"
            value={formatCurrency(dashboardData.obligations.total_paid)}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DashboardCard
            title="Pending"
            value={formatCurrency(dashboardData.obligations.pending)}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DashboardCard
            title="Due Soon"
            value={dashboardData.obligations.upcoming_due}
            subtitle="Next 7 days"
            color="yellow"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900 text-lg">Total: {dashboardData.properties.total}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Rental"
            value={getPropertyCountByUse('arrendamiento')}
            subtitle="properties"
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
          <DashboardCard
            title="Personal"
            value={getPropertyCountByUse('personal')}
            subtitle="properties"
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
          <DashboardCard
            title="Commercial"
            value={getPropertyCountByUse('comercial')}
            subtitle="properties"
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Rentals */}
      {dashboardData.rentals && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rentals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Active Rentals"
              value={dashboardData.rentals.active}
              color="green"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <DashboardCard
              title="Available"
              value={dashboardData.rentals.available}
              color="blue"
            />
            <DashboardCard
              title="Ending Soon"
              value={dashboardData.rentals.ending_soon}
              subtitle="Next 15 days"
              color="yellow"
            />
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      {dashboardData.monthly_summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Rental Income"
              value={formatCurrency(dashboardData.monthly_summary.rental_income)}
              color="green"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <DashboardCard
              title="Obligation Payments"
              value={formatCurrency(dashboardData.monthly_summary.obligation_payments)}
              color="red"
            />
            <DashboardCard
              title="Repair Costs"
              value={formatCurrency(dashboardData.monthly_summary.repair_costs)}
              color="yellow"
            />
            <DashboardCard
              title="Net Balance"
              value={formatCurrency(dashboardData.monthly_summary.net)}
              color={dashboardData.monthly_summary.net >= 0 ? 'green' : 'red'}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/obligations')}
          className="bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors p-4 text-left"
        >
          <h3 className="font-semibold mb-1">View All Obligations</h3>
          <p className="text-sm text-gray-600">Manage your financial obligations</p>
        </button>
        <button
          onClick={() => navigate('/rentals')}
          className="bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors p-4 text-left"
        >
          <h3 className="font-semibold mb-1">View Rentals</h3>
          <p className="text-sm text-gray-600">Manage your active rentals</p>
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="bg-white border-2 border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors p-4 text-left"
        >
          <h3 className="font-semibold mb-1">View Notifications</h3>
          <p className="text-sm text-gray-600">Review alerts and reminders</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
