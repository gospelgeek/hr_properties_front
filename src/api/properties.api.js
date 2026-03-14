import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const getApiOrigin = () => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return window.location.origin;
  }
};

const normalizeProtectedMediaUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;

  const apiOrigin = getApiOrigin();

  // Relative media paths should always be requested from the API origin.
  if (rawUrl.startsWith('/')) {
    return `${apiOrigin}${rawUrl}`;
  }

  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    return `${apiOrigin}/${rawUrl.replace(/^\/+/, '')}`;
  }

  try {
    const parsed = new URL(rawUrl);

    // Backends sometimes return localhost URLs in production payloads.
    if ((parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost') && parsed.pathname.startsWith('/media/')) {
      return `${apiOrigin}${parsed.pathname}${parsed.search}`;
    }

    // Avoid mixed-content errors when frontend runs on HTTPS.
    if (window.location.protocol === 'https:' && parsed.protocol === 'http:') {
      parsed.protocol = 'https:';
      return parsed.toString();
    }

    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

export const api = axios.create({
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
    //console.log('🌐 Full request URL:', config.baseURL + config.url);
    //console.log('🔗 Query params:', config.params);
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
        // Token refresh falló, limpiar y redirigir al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
         // Solo redirigir si NO estamos en una ruta pública
        const publicRoutes = ['/public-properties', '/login'];
        if (!publicRoutes.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// GET /api/properties/ - Listar propiedades activas
export const getProperties = async (params = {}) => {
  console.log('🔍 Frontend sending params to backend:', params);
  const response = await api.get('properties/', { params });
  //console.log('📥 Backend response:', response.data);
 // console.log('📊 Number of properties returned:', response.data.length);
  return response.data;
};

// GET /api/properties/deleted/ - Ver propiedades eliminadas
export const getDeletedProperties = async () => {
  const response = await api.get('properties/deleted/');
  return response.data;
};

// GET /api/properties/{id}/ - Obtener propiedad por ID (con enseres incluidos)
export const getProperty = async (id) => {
  const response = await api.get(`properties/${id}/`);
  return response.data;
};

// POST /api/properties/ - Crear propiedad
export const createProperty = async (propertyData) => {
  const config = propertyData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await api.post('properties/', propertyData, config);
  return response.data;
};

// PUT/PATCH /api/properties/{id}/ - Actualizar propiedad
export const updateProperty = async (id, propertyData) => {
  const config = propertyData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await api.patch(`properties/${id}/`, propertyData, config);
  return response.data;
};

// DELETE /api/properties/{id}/ - Soft delete
export const deleteProperty = async (id) => {
  const response = await api.delete(`properties/${id}/`);
  return response.data;
};

// POST /api/properties/{id}/restore/ - Restaurar propiedad eliminada
export const restoreProperty = async (id) => {
  const response = await api.post(`properties/${id}/restore/`);
  return response.data;
};

// POST /api/properties/{id}/upload_media/ - Subir archivos
export const uploadMedia = async (id, formData) => {
  const response = await api.post(`properties/${id}/upload_media/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// POST /api/properties/{id}/add_enser/ - Añadir enser a propiedad
export const addEnserToProperty = async (propertyId, enserData) => {
  const config = enserData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await api.post(`properties/${propertyId}/add_enser/`, enserData, config);
  return response.data;
};

// POST /api/properties/{id}/add_law/ - Añadir ley/normativa a propiedad
export const addLawToProperty = async (propertyId, lawData) => {
  const config = lawData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await api.post(`properties/${propertyId}/add_law/`, lawData, config);
  return response.data;
};

// GET /api/property-laws/{propertyId}/ - Obtener todas las leyes de una propiedad
export const getPropertyLaws = async (propertyId) => {
  const response = await api.get(`properties/${propertyId}/laws/`) ;
  return response.data;
};

// PATCH /api/properties/{propertyId}/laws/{lawId}/ - Actualizar una ley de la propiedad
export const updatePropertyLaw = async (propertyId, lawId, lawData) => {
  const config = lawData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  const response = await api.patch(`properties/${propertyId}/laws/${lawId}/`, lawData, config);
  return response.data;
};

// DELETE /api/properties/{propertyId}/laws/{lawId}/ - Eliminar una ley de la propiedad
export const deletePropertyLaw = async (propertyId, lawId) => {
  const response = await api.delete(`properties/${propertyId}/laws/${lawId}/`);
  return response.data;
};

// GET /api/properties/{id}/repairs_cost/ - Obtener el costo total de reparaciones de una propiedad
export const getPropertyRepairsCost = async (id) => {
  const response = await api.get(`properties/${id}/repairs_cost/`);
  return response.data;
};

// GET /api/properties/{id}/financials/ - Obtener las finanzas de una propiedad
export const getPropertyFinancials = async (id) => {
  const response = await api.get(`properties/${id}/financials/`);
  return response.data;
};

// GET protected media with auth header and open it in a new tab
export const openProtectedMedia = async (url) => {
  const normalizedUrl = normalizeProtectedMediaUrl(url);
  const response = await api.get(normalizedUrl, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(response.data);
  window.open(blobUrl, '_blank', 'noopener,noreferrer');

  // Delay revoke to avoid interrupting browser loading in the new tab
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
};
