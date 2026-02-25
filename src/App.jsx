import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/UI/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import PublicPropertiesPage from './pages/PublicPropertiesPage';
import PublicPropertyDetailPage from './pages/PublicPropertyDetailPage';
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
import EditRentalPage from './pages/EditRentalPage';
import RentalDetailPage from './pages/RentalDetailPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  //console.log('App.jsx renderizado');
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          {/*console.log('Dentro de AuthProvider')*/}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/public-properties" element={<PublicPropertiesPage />} />
            <Route path="/public-properties/:id" element={<PublicPropertyDetailPage />} />
            <Route path="/" element={<Navigate to="/public-properties" replace />} />
            
            {/* Protected Routes with Layout */}
            <Route element={<Layout />}>
              {/* Admin Only Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Properties - Admin Only */}
              <Route path="/properties" element={
                <ProtectedRoute requireAdmin={true}>
                  <PropertiesPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <PropertyPage />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute requireAdmin={true}>
                  <CreatePropertyPage />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <EditPropertyPage />
                </ProtectedRoute>
              } />
              <Route path="/deleted" element={
                <ProtectedRoute requireAdmin={true}>
                  <DeletedPropertiesPage />
                </ProtectedRoute>
              } />
              
              {/* Repairs - Admin Only */}
              <Route path="/repairs" element={
                <ProtectedRoute requireAdmin={true}>
                  <RepairsPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/add-repair" element={
                <ProtectedRoute requireAdmin={true}>
                  <AddRepairPage />
                </ProtectedRoute>
              } />
              
              {/* Property Assets - Admin Only */}
              <Route path="/property/:id/add-enser" element={
                <ProtectedRoute requireAdmin={true}>
                  <AddEnserPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/add-law" element={
                <ProtectedRoute requireAdmin={true}>
                  <AddLawPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/upload-media" element={
                <ProtectedRoute requireAdmin={true}>
                  <UploadMediaPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/laws" element={
                <ProtectedRoute requireAdmin={true}>
                  <PropertyLawsPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/financials" element={
                <ProtectedRoute requireAdmin={true}>
                  <PropertyFinancialPage />
                </ProtectedRoute>
              } />
              
              {/* Finance - Admin Only */}
              <Route path="/notifications" element={
                <ProtectedRoute requireAdmin={true}>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/obligations" element={
                <ProtectedRoute requireAdmin={true}>
                  <ObligationsPage />
                </ProtectedRoute>
              } />
              <Route path="/obligations/:obligationId" element={
                <ProtectedRoute requireAdmin={true}>
                  <ObligationDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/add-obligation" element={
                <ProtectedRoute requireAdmin={true}>
                  <AddObligationPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/obligations/:obligationId" element={
                <ProtectedRoute requireAdmin={true}>
                  <ObligationDetailPage />
                </ProtectedRoute>
              } />
              
              {/* Rentals - Admin: full access, Clients: read only */}
              <Route path="/tenants" element={
                <ProtectedRoute requireAdmin={true}>
                  <TenantsPage />
                </ProtectedRoute>
              } />
              <Route path="/rentals" element={
                <ProtectedRoute>
                  <RentalsPage />
                </ProtectedRoute>
              } />
              <Route path="/rentals/:rentalId" element={
                <ProtectedRoute>
                  <RentalDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/add-rental" element={
                <ProtectedRoute requireAdmin={true}>
                  <AddRentalPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/rentals/:rentalId/edit" element={
                <ProtectedRoute requireAdmin={true}>
                  <EditRentalPage />
                </ProtectedRoute>
              } />
              <Route path="/property/:id/rentals/:rentalId" element={
                <ProtectedRoute>
                  <RentalDetailPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
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
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;