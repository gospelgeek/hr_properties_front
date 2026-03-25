import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// ═══════════════════════════════════════════════════════════════════════
// TENANTS (Inquilinos)
// ═══════════════════════════════════════════════════════════════════════

// GET /api/tenants/ - Listar todos los inquilinos
export const getTenants = async () => {
  const response = await api.get('tenants/');
  return response.data;
};

// POST /api/tenants/ - Crear un inquilino
export const createTenant = async (tenantData) => {
  //console.log('🚀 Enviando datos al backend (createTenant):', tenantData);
  //console.log('🚀 Datos stringificados:', JSON.stringify(tenantData, null, 2));
  const response = await api.post('tenants/', tenantData);
  //console.log('✅ Respuesta del backend:', response.data);
  return response.data;
};

// GET /api/tenants/{id}/ - Ver detalle de un inquilino
export const getTenant = async (id) => {
  const response = await api.get(`tenants/${id}/`);
  return response.data;
};

// PATCH /api/tenants/{id}/ - Actualizar un inquilino
export const updateTenant = async (id, tenantData) => {
  const response = await api.patch(`tenants/${id}/`, tenantData);
  return response.data;
};

// DELETE /api/tenants/{id}/ - Eliminar un inquilino
export const deleteTenant = async (id) => {
  const response = await api.delete(`tenants/${id}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// RENTALS (General)
// ═══════════════════════════════════════════════════════════════════════

// GET /api/rentals/ - Listar todos los arriendos
export const getRentals = async () => {
  const response = await api.get('rentals/');
  return response.data;
};

// GET /api/rentals/{id}/ - Ver detalle completo de un arriendo
export const getRental = async (id) => {
  const response = await api.get(`rentals/${id}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// RENTALS DE PROPIEDADES ESPECÍFICAS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/properties/{id}/add_rental/ - Crear rental para una propiedad
export const addRentalToProperty = async (propertyId, rentalData) => {
  //console.log('📥 Received rental data:', rentalData);
  //console.log('📥 Is file?', rentalData.url_files instanceof File);
  
  // Si hay un archivo, usar FormData, de lo contrario usar JSON
  if (rentalData.url_files instanceof File) {
    //console.log('✅ Using FormData for file upload');
    const formData = new FormData();
    
    // Agregar campos obligatorios
    formData.append('status', rentalData.status);
    formData.append('rental_type', rentalData.rental_type);
    formData.append('amount', rentalData.amount);
    
    // Agregar campos opcionales solo si existen
    if (rentalData.tenant) {
      formData.append('tenant', rentalData.tenant);
    }
    if (rentalData.check_in) {
      formData.append('check_in', rentalData.check_in);
    }
    if (rentalData.check_out) {
      formData.append('check_out', rentalData.check_out);
    }
    if (rentalData.people_count) {
      formData.append('people_count', rentalData.people_count);
    }
    
    // ⚠️ IMPORTANTE: monthly_data/airbnb_data como STRING JSON
    if (rentalData.monthly_data) {
      formData.append('monthly_data', JSON.stringify(rentalData.monthly_data));
    }
    if (rentalData.airbnb_data) {
      formData.append('airbnb_data', JSON.stringify(rentalData.airbnb_data));
    }
    
    // Agregar el archivo (puede ser 'url_files' o 'monthly_data.url_files' o 'airbnb_data.url_files')
    if (rentalData.rental_type === 'monthly') {
      formData.append('monthly_data.url_files', rentalData.url_files);
    } else {
      formData.append('airbnb_data.url_files', rentalData.url_files);
    }
    
    // Log FormData contents
    //console.log('📦 FormData contents:');
    //for (let pair of formData.entries()) {
    //  console.log(pair[0], ':', pair[1]);
    //}
    
    const response = await axios.post(
      `${API_URL}properties/${propertyId}/add_rental/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    //console.log('✅ Response from adding rental with file:', response.data);
    return response.data;
    
  } else {
    //console.log('✅ Using JSON for rental without file');
    const response = await api.post(`properties/${propertyId}/add_rental/`, rentalData);
    //console.log('✅ Response from adding rental without file:', response.data);
    return response.data;
  }
};

// GET /api/properties/{id}/rentals/ - Listar todos los rentals de la propiedad
export const getPropertyRentals = async (propertyId) => {
  const response = await api.get(`properties/${propertyId}/rentals/`);
  return response.data;
};

// GET /api/properties/{id}/rentals/{rental_id}/ - Ver rental específico
export const getPropertyRental = async (propertyId, rentalId) => {
  const response = await api.get(`properties/${propertyId}/rentals/${rentalId}/`);
  return response.data;
};

// PATCH /api/properties/{id}/rentals/{rental_id}/ - Actualizar rental
export const updatePropertyRental = async (propertyId, rentalId, rentalData) => {
  // Si hay un archivo, usar FormData, de lo contrario usar JSON
  if (rentalData.url_files instanceof File) {
    const formData = new FormData();
    
    // Agregar todos los campos
    if (rentalData.status) {
      formData.append('status', rentalData.status);
    }
    if (rentalData.tenant) {
      formData.append('tenant', rentalData.tenant);
    }
    if (rentalData.rental_type) {
      formData.append('rental_type', rentalData.rental_type);
    }
    if (rentalData.check_in) {
      formData.append('check_in', rentalData.check_in);
    }
    if (rentalData.check_out) {
      formData.append('check_out', rentalData.check_out);
    }
    if (rentalData.amount) {
      formData.append('amount', rentalData.amount);
    }
    if (rentalData.people_count) {
      formData.append('people_count', rentalData.people_count);
    }
    
    // ⚠️ IMPORTANTE: monthly_data/airbnb_data como STRING JSON
    if (rentalData.monthly_data) {
      formData.append('monthly_data', JSON.stringify(rentalData.monthly_data));
    }
    if (rentalData.airbnb_data) {
      formData.append('airbnb_data', JSON.stringify(rentalData.airbnb_data));
    }
    
    // Agregar el archivo (puede ser 'url_files' o 'monthly_data.url_files' o 'airbnb_data.url_files')
    if (rentalData.rental_type === 'monthly') {
      formData.append('monthly_data.url_files', rentalData.url_files);
    } else {
      formData.append('airbnb_data.url_files', rentalData.url_files);
    }
    
    const response = await axios.patch(
      `${API_URL}properties/${propertyId}/rentals/${rentalId}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
    
  } else {
    const response = await api.patch(`properties/${propertyId}/rentals/${rentalId}/`, rentalData);
    return response.data;
  }
};

// DELETE /api/properties/{id}/rentals/{rental_id}/ - Eliminar rental
export const deletePropertyRental = async (propertyId, rentalId) => {
  const response = await api.delete(`properties/${propertyId}/rentals/${rentalId}/`);
  return response.data;
};

// POST /api/properties/{id}/rentals/{rental_id}/remove_document/ - Eliminar solo documento mensual del rental
export const removeRentalMonthlyDocument = async (propertyId, rentalId) => {
  const response = await api.post(`properties/${propertyId}/rentals/${rentalId}/remove_document/`, {});
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// PAGOS DE RENTALS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/properties/{id}/rentals/{rental_id}/add_payment/ - Añadir pago a un rental
export const addPaymentToRental = async (propertyId, rentalId, paymentData) => {
  //console.log('Adding payment data:', paymentData);
 if (paymentData instanceof FormData) {
    
    const response = await axios.post(
      `${API_URL}properties/${propertyId}/rentals/${rentalId}/add_payment/`,
     paymentData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } else {
    const response = await api.post(`properties/${propertyId}/rentals/${rentalId}/add_payment/`, paymentData);
    return response.data;
  }

};

// GET /api/properties/{id}/rentals/{rental_id}/payments/ - Listar pagos de un rental
export const getRentalPayments = async (propertyId, rentalId) => {
  const response = await api.get(`properties/${propertyId}/rentals/${rentalId}/payments/`);
  return response.data;
};

// GET /api/properties/{id}/rentals/{rental_id}/payments/{payment_id}/ - Ver pago específico
export const getRentalPayment = async (propertyId, rentalId, paymentId) => {
  const response = await api.get(`properties/${propertyId}/rentals/${rentalId}/payments/${paymentId}/`);
  return response.data;
};

// PATCH /api/properties/{id}/rentals/{rental_id}/payments/{payment_id}/ - Actualizar pago
export const updateRentalPayment = async (propertyId, rentalId, paymentId, paymentData) => {
  const response = await api.patch(`properties/${propertyId}/rentals/${rentalId}/payments/${paymentId}/`, paymentData);
  return response.data;
};

// DELETE /api/properties/{id}/rentals/{rental_id}/payments/{payment_id}/ - Eliminar pago
export const deleteRentalPayment = async (propertyId, rentalId, paymentId) => {
  const response = await api.delete(`properties/${propertyId}/rentals/${rentalId}/payments/${paymentId}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// ENDPOINTS DIRECTOS PARA CLIENTES (sin necesidad de propertyId)
// ═══════════════════════════════════════════════════════════════════════

// GET /api/rentals/{id}/payments/ - Obtener pagos de un rental (para clientes)
export const getRentalPaymentsDirect = async (rentalId) => {
  const response = await api.get(`rentals/${rentalId}/payments/`);
  return response.data;
};

// POST /api/rentals/{id}/end_rental/ - Terminar un rental y liberar la propiedad
export const endRental = async (rentalId) => {
  const response = await api.post(`rentals/${rentalId}/end_rental/`);
  return response.data;
};


// GET protected media with auth header and open it in a new tab
export const openProtectedMedia = async (url) => {
  const normalizedUrl = normalizeProtectedMediaUrl(url);
  const response = await api.get(normalizedUrl, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(response.data);
  window.open(blobUrl, '_blank', 'noopener,noreferrer');

  // Delay revoke to avoid interrupting browser loading in the new tab
  setTimeout(() => URL.revokeObjectURL(blobUrl), 120_000);
};
