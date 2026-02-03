import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/UI/Layout';
import PropertiesPage from './pages/PropertiesPage';
import PropertyPage from './pages/PropertyPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import DeletedPropertiesPage from './pages/DeletedPropertiesPage';
import RepairsPage from './pages/RepairsPage';
import AddRepairPage from './pages/AddRepairPage';
import AddEnserPage from './pages/AddEnserPage';
import AddLawPage from './pages/AddLawPage';
import UploadMediaPage from './pages/UploadMediaPage';
import PropertyLawsPage from './pages/PropertyLawsPage';
import PropertyFinancialPage from './pages/PropertyFinancialPage';
// Finance Pages
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ObligationsPage from './pages/ObligationsPage';
import AddObligationPage from './pages/AddObligationPage';
import ObligationDetailPage from './pages/ObligationDetailPage';
// Rentals Pages
import TenantsPage from './pages/TenantsPage';
import RentalsPage from './pages/RentalsPage';
import AddRentalPage from './pages/AddRentalPage';
import RentalDetailPage from './pages/RentalDetailPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Properties */}
          <Route path="/" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/create" element={<CreatePropertyPage />} />
          <Route path="/edit/:id" element={<EditPropertyPage />} />
          <Route path="/deleted" element={<DeletedPropertiesPage />} />
          
          {/* Repairs */}
          <Route path="/repairs" element={<RepairsPage />} />
          <Route path="/property/:id/add-repair" element={<AddRepairPage />} />
          
          {/* Property Assets */}
          <Route path="/property/:id/add-enser" element={<AddEnserPage />} />
          <Route path="/property/:id/add-law" element={<AddLawPage />} />
          <Route path="/property/:id/upload-media" element={<UploadMediaPage />} />
          <Route path="/property/:id/laws" element={<PropertyLawsPage />} />
          <Route path="/property/:id/financials" element={<PropertyFinancialPage />} />
          
          {/* Finance */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/obligations" element={<ObligationsPage />} />
          <Route path="/property/:id/add-obligation" element={<AddObligationPage />} />
          <Route path="/property/:id/obligations/:obligationId" element={<ObligationDetailPage />} />
          
          {/* Rentals */}
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/property/:id/add-rental" element={<AddRentalPage />} />
          <Route path="/property/:id/rentals/:rentalId" element={<RentalDetailPage />} />
        </Routes>
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;