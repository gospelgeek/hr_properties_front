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
    console.log('DashboardPage montado');
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      console.log('Solicitando datos del dashboard...');
      const data = await getDashboard();
      console.log('Datos recibidos del dashboard:', data);
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

  if (loading) {
    console.log('Dashboard está cargando...');
    return <Loader />;
  }
  if (!dashboardData) {
    console.log('No hay datos de dashboard');
    return <div>No data available</div>;
  }
  console.log('Renderizando dashboard con datos:', dashboardData);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">System overview</p>
      </div>


 {/* Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Properties - 
            <span className="ml-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-md border-2 border-blue-400">
              Total: {dashboardData.properties.total}
            </span>
          </h2>
          <div className="text-sm text-gray-600">
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <DashboardCard
            title="Rental"
            value={getPropertyCountByUse('rental')}
            subtitle="properties"
            color="orange"
            borderColor="border-orange-400" 
            to="/properties?use=rental"
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
            color="pink"
            borderColor="border-pink-400"
            to="/properties?use=personal"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
          <DashboardCard
            title="Commercial"
            value={getPropertyCountByUse('commercial')}
            subtitle="properties"
            color="purple"
            borderColor="border-purple-400"
            to="/properties?use=commercial"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>
      </div>



      {/* Financial Obligations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Financial Obligations - Total: {dashboardData.obligations_month.total_count}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Paid Monthly"
            value={formatCurrency(dashboardData.obligations_month.total_paid)}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DashboardCard
            title="Pending Monthly"
            value={formatCurrency(dashboardData.obligations_month.pending)}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DashboardCard
            title="Due Soon"
            value={dashboardData.obligations_month.upcoming_due}
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

     
      {/* Rentals Mensuales */
      console.log(dashboardData)}
      {dashboardData.rentals && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Rentals - Total: {dashboardData.rentals.monthly_available + dashboardData.rentals.monthly_occupied}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Occupied"
              value={dashboardData.rentals.monthly_occupied || 0}
              color="green"
              to="/properties?rental_type=monthly&rental_status=occupied"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <DashboardCard
              title="Available"
              value={dashboardData.rentals.monthly_available || 0}
              color="blue"
              to="/properties?rental_type=monthly&rental_status=available"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <DashboardCard
              title="Ending Soon"
              value={dashboardData.rentals.monthly_ending_soon || 0}
              subtitle="Next 15 days"
              color="yellow"
              to="/properties?rental_type=monthly&rental_status=ending_soon"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {/* Rentals Airbnb */}
      {dashboardData.rentals && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rentals Airbnb - Total: {dashboardData.rentals.airbnb_available + dashboardData.rentals.airbnb_occupied}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Occupied"
              value={dashboardData.rentals.airbnb_occupied || 0}
              color="green"
              to="/properties?rental_type=airbnb&rental_status=occupied"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <DashboardCard
              title="Available"
              value={dashboardData.rentals.airbnb_available || 0}
              color="blue"
              to="/properties?rental_type=airbnb&rental_status=available"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <DashboardCard
              title="Ending Soon"
              value={dashboardData.rentals.airbnb_ending_soon || 0}
              subtitle="Next 15 days"
              color="yellow"
              to="/properties?rental_type=airbnb&rental_status=ending_soon"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
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
