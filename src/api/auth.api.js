import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login de Cliente (username/password)
export const loginClient = async (username, password) => {
  const response = await api.post('users/login/', {
    username,
    password
  });
  return response.data;
};

// Login de Admin (Google OAuth)
export const loginGoogle = async (idToken) => {
  const response = await api.post('users/google/', {
    id_token: idToken
  });
  return response.data;
};

// Renovar Access Token
export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post('users/refresh/', {
    refresh: refreshToken
  });
  return response.data;
};

// Logout (Blacklist token)
export const logout = async (refreshToken) => {
  const response = await api.post('users/logout/', {
    refresh: refreshToken
  });
  return response.data;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Obtener el access token
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

// Obtener el refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Guardar tokens
export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// Guardar usuario
export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Obtener usuario
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Limpiar todo
export const clearAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};
