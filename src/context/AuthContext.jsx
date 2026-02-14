import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loginClient, 
  loginGoogle, 
  logout as logoutApi, 
  saveTokens, 
  saveUser, 
  clearAuth, 
  getUser as getUserFromStorage,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken
} from '../api/auth.api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  //console.log('useAuth hook ejecutado:', context);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider montado');
    // Verificar si hay un usuario guardado al cargar
    const storedUser = getUserFromStorage();
    const token = getAccessToken();
    //console.log('Stored user:', storedUser, 'Token:', token);
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLoginClient = async (username, password) => {
    try {
      const data = await loginClient(username, password);
      saveTokens(data.access, data.refresh);
      saveUser(data.user);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.log('Error logging in with client:', error.response?.data);
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail 
      };
    }
  };

  const handleLoginGoogle = async (idToken) => {
    try {
      const data = await loginGoogle(idToken);
      saveTokens(data.access, data.refresh);
      saveUser(data.user);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error logging in with Google' 
      };
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setUser(null);
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) {
        handleLogout();
        return false;
      }
      
      const data = await refreshAccessToken(refresh);
      saveTokens(data.access, refresh);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
      return false;
    }
  };

  const isAdmin = () => {
    return user?.roles?.includes('admin');
  };

  const isClient = () => {
    return user?.roles?.includes('cliente');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    loginClient: handleLoginClient,
    loginGoogle: handleLoginGoogle,
    logout: handleLogout,
    refreshToken,
    isAdmin,
    isClient,
    isAuthenticated
  };

  //console.log('AuthProvider renderizando, value:', value);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
