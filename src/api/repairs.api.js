import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${API_URL}users/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// GET /api/repairs/?property={property_id} - Filtrar reparaciones por propiedad
export const getRepairsByProperty = async (propertyId) => {
  const response = await api.get(`repairs/`, {
    params: { property: propertyId }
  });
  return response.data;
};

// GET /api/repairs/{id}/ - Obtener reparación por ID
export const getRepair = async (id) => {
  const response = await api.get(`repairs/${id}/`);
  return response.data;
};

// POST /api/properties/{id}/add_repair/ - Agregar reparación a una propiedad
export const addRepairToProperty = async (propertyId, repairData) => {
  const response = await api.post(`properties/${propertyId}/add_repair/`, repairData);
  return response.data;
};

// PUT/PATCH /api/repairs/{id}/ - Actualizar reparación
export const updateRepair = async (id, repairData) => {
  const response = await api.patch(`repairs/${id}/`, repairData);
  return response.data;
};

// DELETE /api/repairs/{id}/ - Eliminar reparación
export const deleteRepair = async (id) => {
  const response = await api.delete(`repairs/${id}/`);
  return response.data;
};
