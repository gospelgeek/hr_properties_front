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
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const isFormData = config.data instanceof FormData;

    // Important: let browser set multipart boundary for FormData payloads.
    if (isFormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    if (!isFormData && config.data && config.headers && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

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

//------------------------------------------------------//---------------------------------//

export const getVehicles = async (params = {}) => {
  try {
    const response = await api.get('vehicles/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await api.get(`vehicles/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
};


export const createVehicle = async (vehicleData) => {
  try {
    const config = vehicleData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
    const response = await api.post('vehicles/', vehicleData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};


export const updateVehicle = async (id, vehicleData) => {
  try {
    const config = vehicleData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
    const response = await api.patch(`vehicles/${id}/`, vehicleData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await api.delete(`vehicles/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};


export const getVehicleDocuments = async (id) => {
  try {
    const response = await api.get(`vehicles/${id}/documents/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle documents:', error);
    throw error;
  }
};

export const addVehicleDocument = async (id, documentData) => {
  try {
    const config = documentData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post(`vehicles/${id}/add_document/`, documentData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle document:', error);
    throw error;
  }
};


export const deleteVehicleDocument = async (vehicleId, documentId) => {
  try {
    const response = await api.delete(`vehicles/${vehicleId}/delete_document/${documentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle document:', error);
    throw error;
  }
};

export const getVehicleImages = async (id) => {
  try {
    const response = await api.get(`vehicles/${id}/images/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle images:', error);
    throw error;
  }
};

export const addVehicleImage = async (id, imageData) => {
  try {
    const config = imageData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post(`vehicles/${id}/add_image/`, imageData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle image:', error);
    throw error;
  }
};

export const deleteVehicleImage = async (vehicleId, imageId) => {
  try {
    const response = await api.delete(`vehicles/${vehicleId}/delete_image/${imageId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle image:', error);
    throw error;
  }
};


export const getVehicleResponsible = async (id) => {
  try {
    const response = await api.get(`vehicles/${id}/responsibles/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle responsible:', error);
    throw error;
  }
};

export const getVehicleResponsibles = async () => {
  try {
    const response = await api.get('vehicle-responsibles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching responsibles catalog:', error);
    throw error;
  }
};

export const assignVehicleResponsible = async (id, responsibleData) => {
  try {
    const response = await api.post(`vehicles/${id}/add_responsible/`, responsibleData);
    return response.data;
  } catch (error) {
    console.error('Error assigning vehicle responsible:', error);
    throw error;
  }
};

export const updateVehicleResponsible = async (responsibleId, responsibleData) => {
  try {
    const response = await api.patch(`vehicle-responsibles/${responsibleId}/`, responsibleData);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle responsible:', error);
    throw error;
  }
};

export const removeVehicleResponsible = async (vehicleId, responsibleId) => {
  try {
    const response = await api.post(`vehicles/${vehicleId}/remove_responsible/`, {
      responsible_id: responsibleId,
    });
    return response.data;
  } catch (error) {
    console.error('Error removing vehicle responsible:', error);
    throw error;
  }
};


export const getVehicleObligations = async (id) => {
  try {
    const response = await api.get(`vehicles/${id}/obligations/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle obligations:', error);
    throw error;
  }
};

export const addVehicleObligation = async (id, obligationData) => {
  try {
    const config = {};

    console.group('[vehicles.api] addVehicleObligation request debug');
    console.log('Endpoint:', `vehicles/${id}/add_obligation/`);
    console.log('Payload type:', obligationData instanceof FormData ? 'FormData' : 'JSON');

    if (obligationData instanceof FormData) {
      const formDataEntries = [];
      obligationData.forEach((value, key) => {
        if (value instanceof File) {
          formDataEntries.push({
            key,
            fileName: value.name,
            fileType: value.type,
            fileSize: value.size,
          });
          return;
        }
        formDataEntries.push({ key, value });
      });
      console.table(formDataEntries);
    } else {
      console.log('Payload data:', obligationData);
    }

    console.log('Axios config:', config);
    console.groupEnd();

    const response = await api.post(`vehicles/${id}/add_obligation/`, obligationData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle obligation:', error);
    console.error('addVehicleObligation backend response:', {
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

export const updateVehicleObligation = async (obligationId, obligationData) => {
  try {
    const config = obligationData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.patch(`vehicle-obligations/${obligationId}/`, obligationData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle obligation:', error);
    throw error;
  }
};

export const deleteVehicleObligation = async ( obligationId) => {
  try {
    const response = await api.delete(`vehicle-obligations/${obligationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle obligation:', error);
    throw error;
  }
};


export const getVehicleObligationPayments = async (vehicleId, obligationId) => {
  try {
    const response = await api.get(`vehicles/${vehicleId}/obligations/${obligationId}/payments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle obligation payments:', error);
    throw error;
  }
};

export const getVehicleObligationPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`vehicle-payments/${paymentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle obligation payment:', error);
    throw error;
  }
};


export const addPayVehicleObligation = async (vehicleId, obligationId, obligationData) => {
  try {
    const config = obligationData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post(`vehicles/${vehicleId}/obligations/${obligationId}/payments/`, obligationData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle obligation payment:', error);
    throw error;
  }
};

export const updatePayVehicleObligation = async ( paymentId, paymentData) => {
  try {
    const config = paymentData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.patch(`vehicle-payments/${paymentId}/`, paymentData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle obligation payment:', error);
    throw error;
  }
};

export const deletePayVehicleObligation = async (paymentId) => {
  try {
    const response = await api.delete(`vehicle-payments/${paymentId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle obligation payment:', error);
    throw error;
  }
};


export const getVehicleRepairs = async (id) => {
  try {
    const response = await api.get(`vehicles/${id}/repairs/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle repairs:', error);
    throw error;
  }
};

export const addVehicleRepair = async (id, repairData) => {
  try {
    const response = await api.post(`vehicles/${id}/add_repair/`, repairData);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle repair:', error);
    throw error;
  }
};

export const updateVehicleRepair = async (repairId, repairData) => {
  try {
    const response = await api.patch(`vehicle-repairs/${repairId}/`, repairData);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle repair:', error);
    throw error;
  }
};


export const deleteRepair = async (repairId) => {
  try {
    const response = await api.delete(`vehicle-repairs/${repairId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle repair:', error);
    throw error;
  }
};



// GET protected media with auth header and open it in a new tab
export const openProtectedMedia = async (url) => {
  const normalizedUrl = normalizeProtectedMediaUrl(url);
  window.dispatchEvent(new CustomEvent('protected-media-loading', { detail: { isLoading: true } }));

  try {
    const response = await api.get(normalizedUrl, { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(response.data);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');

    // Delay revoke to avoid interrupting browser loading in the new tab
    setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
  } finally {
    window.dispatchEvent(new CustomEvent('protected-media-loading', { detail: { isLoading: false } }));
  }
};

export const getProtectedMediaPreviewUrl = async (url) => {
  const normalizedUrl = normalizeProtectedMediaUrl(url);
  const response = await api.get(normalizedUrl, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};