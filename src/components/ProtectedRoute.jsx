import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './UI/Loader';

console.log('ProtectedRoute.jsx cargado');

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  console.log('ProtectedRoute función ejecutada');
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('admin');
  console.log('ProtectedRoute:', { user, isAuthenticated, isAdmin, loading, requireAdmin });

  if (loading) {
    console.log('ProtectedRoute: loading...');
    return null;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute: usuario no es admin, redirigiendo a /public-properties');
    return <Navigate to="/public-properties" replace />;
  }

  console.log('ProtectedRoute: renderizando children');
  return children;
};

export default ProtectedRoute;
