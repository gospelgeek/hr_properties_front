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

// ═══════════════════════════════════════════════════════════════════════
// CATÁLOGOS - OBLIGATION TYPES (Tipos de obligaciones)
// ═══════════════════════════════════════════════════════════════════════

// GET /api/obligation-types/ - Listar todos los tipos
export const getObligationTypes = async () => {
  const response = await api.get('obligation-types/');
  return response.data;
};

// POST /api/obligation-types/ - Crear nuevo tipo
export const createObligationType = async (typeData) => {
  const response = await api.post('obligation-types/', typeData);
  return response.data;
};

// GET /api/obligation-types/{id}/ - Ver detalle
export const getObligationType = async (id) => {
  const response = await api.get(`obligation-types/${id}/`);
  return response.data;
};

// PUT /api/obligation-types/{id}/ - Actualizar completo
export const updateObligationTypeFull = async (id, typeData) => {
  const response = await api.put(`obligation-types/${id}/`, typeData);
  return response.data;
};

// PATCH /api/obligation-types/{id}/ - Actualizar parcial
export const updateObligationType = async (id, typeData) => {
  const response = await api.patch(`obligation-types/${id}/`, typeData);
  return response.data;
};

// DELETE /api/obligation-types/{id}/ - Eliminar
export const deleteObligationType = async (id) => {
  const response = await api.delete(`obligation-types/${id}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// CATÁLOGOS - PAYMENT METHODS (Métodos de pago)
// ═══════════════════════════════════════════════════════════════════════

// GET /api/payment-methods/ - Listar todos
export const getPaymentMethods = async () => {
  const response = await api.get('payment-methods/');
  return response.data;
};

// POST /api/payment-methods/ - Crear nuevo
export const createPaymentMethod = async (methodData) => {
  const response = await api.post('payment-methods/', methodData);
  return response.data;
};

// GET /api/payment-methods/{id}/ - Ver detalle
export const getPaymentMethod = async (id) => {
  const response = await api.get(`payment-methods/${id}/`);
  return response.data;
};

// PUT /api/payment-methods/{id}/ - Actualizar completo
export const updatePaymentMethodFull = async (id, methodData) => {
  const response = await api.put(`payment-methods/${id}/`, methodData);
  return response.data;
};

// PATCH /api/payment-methods/{id}/ - Actualizar parcial
export const updatePaymentMethod = async (id, methodData) => {
  const response = await api.patch(`payment-methods/${id}/`, methodData);
  return response.data;
};

// DELETE /api/payment-methods/{id}/ - Eliminar
export const deletePaymentMethod = async (id) => {
  const response = await api.delete(`payment-methods/${id}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// OBLIGATIONS (Todas las obligaciones del sistema) - CON FILTROS Y PAGINACIÓN
// ═══════════════════════════════════════════════════════════════════════

// GET /api/obligations/ - Listar todas con pagos (paginado)
// Soporta múltiples parámetros de filtro y ordenamiento
export const getObligations = async (params = {}) => {
  const response = await api.get('obligations/', { params });
  return response.data;
};

// GET /api/obligations/{id}/ - Ver detalle con pagos
export const getObligation = async (id) => {
  const response = await api.get(`obligations/${id}/`);
  return response.data;
};

// PUT /api/obligations/{id}/ - Actualizar completo
export const updateObligationFull = async (id, obligationData) => {
  const response = await api.put(`obligations/${id}/`, obligationData);
  return response.data;
};

// PATCH /api/obligations/{id}/ - Actualizar parcial
export const updateObligation = async (id, obligationData) => {
  const response = await api.patch(`obligations/${id}/`, obligationData);
  return response.data;
};

// DELETE /api/obligations/{id}/ - Eliminar
export const deleteObligation = async (id) => {
  const response = await api.delete(`obligations/${id}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// OBLIGACIONES POR PROPIEDAD (Nested Resources)
// ═══════════════════════════════════════════════════════════════════════

// POST /api/properties/{property_id}/add_obligation/ - Crear obligación en propiedad
export const addObligationToProperty = async (propertyId, obligationData) => {
  const response = await api.post(`properties/${propertyId}/add_obligation/`, obligationData);
  return response.data;
};

// GET /api/properties/{property_id}/obligations/ - Listar obligaciones de propiedad
export const getPropertyObligations = async (propertyId) => {
  const response = await api.get(`properties/${propertyId}/obligations/`);
  return response.data;
};

// GET /api/properties/{property_id}/obligations/{obligation_id}/ - Detalle de obligación
export const getPropertyObligation = async (propertyId, obligationId) => {
  const response = await api.get(`properties/${propertyId}/obligations/${obligationId}/`);
  return response.data;
};

// PUT /api/properties/{property_id}/obligations/{obligation_id}/ - Actualizar completo
export const updatePropertyObligationFull = async (propertyId, obligationId, obligationData) => {
  const response = await api.put(`properties/${propertyId}/obligations/${obligationId}/`, obligationData);
  return response.data;
};

// PATCH /api/properties/{property_id}/obligations/{obligation_id}/ - Actualizar parcial
export const updatePropertyObligation = async (propertyId, obligationId, obligationData) => {
  const response = await api.patch(`properties/${propertyId}/obligations/${obligationId}/`, obligationData);
  return response.data;
};

// DELETE /api/properties/{property_id}/obligations/{obligation_id}/ - Eliminar
export const deletePropertyObligation = async (propertyId, obligationId) => {
  const response = await api.delete(`properties/${propertyId}/obligations/${obligationId}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// PAGOS DE OBLIGACIONES (Nested dentro de Obligations)
// ═══════════════════════════════════════════════════════════════════════

// POST /api/properties/{property_id}/obligations/{obligation_id}/add_payment/ - Crear pago
export const addPaymentToObligation = async (propertyId, obligationId, paymentData) => {
  console.log(paymentData)
  const response = await api.post(`properties/${propertyId}/obligations/${obligationId}/add_payment/`, paymentData);
  console.log(response.data)
  return response.data;
};

// GET /api/properties/{property_id}/obligations/{obligation_id}/payments/ - Listar pagos
export const getObligationPayments = async (propertyId, obligationId) => {
  const response = await api.get(`properties/${propertyId}/obligations/${obligationId}/payments/`);
  return response.data;
};

// GET /api/properties/{property_id}/obligations/{obligation_id}/payments/{payment_id}/ - Detalle
export const getObligationPayment = async (propertyId, obligationId, paymentId) => {
  const response = await api.get(`properties/${propertyId}/obligations/${obligationId}/payments/${paymentId}/`);
  return response.data;
};

// PUT /api/properties/{property_id}/obligations/{obligation_id}/payments/{payment_id}/ - Actualizar completo
export const updateObligationPaymentFull = async (propertyId, obligationId, paymentId, paymentData) => {
  const response = await api.put(`properties/${propertyId}/obligations/${obligationId}/payments/${paymentId}/`, paymentData);
  return response.data;
};

// PATCH /api/properties/{property_id}/obligations/{obligation_id}/payments/{payment_id}/ - Actualizar parcial
export const updateObligationPayment = async (propertyId, obligationId, paymentId, paymentData) => {
  const response = await api.patch(`properties/${propertyId}/obligations/${obligationId}/payments/${paymentId}/`, paymentData);
  return response.data;
};

// DELETE /api/properties/{property_id}/obligations/{obligation_id}/payments/{payment_id}/ - Eliminar
export const deleteObligationPayment = async (propertyId, obligationId, paymentId) => {
  const response = await api.delete(`properties/${propertyId}/obligations/${obligationId}/payments/${paymentId}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD - ESTADÍSTICAS GENERALES
// ═══════════════════════════════════════════════════════════════════════

// GET /api/dashboard/stats/ - Obtener estadísticas generales del sistema
export const getDashboard = async () => {
  const response = await api.get('dashboard/');
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICACIONES - SISTEMA DE ALERTAS
// ═══════════════════════════════════════════════════════════════════════

// GET /api/notifications/ - Listar notificaciones (soporta filtros y paginación)
export const getNotifications = async (params = {}) => {
  const response = await api.get('notifications/', { params });
  return response.data;
};

// GET /api/notifications/{id}/ - Ver detalle de notificación
export const getNotification = async (id) => {
  const response = await api.get(`notifications/${id}/`);
  return response.data;
};

// POST /api/notifications/ - Crear notificación manual
export const createNotification = async (notificationData) => {
  const response = await api.post('notifications/', notificationData);
  return response.data;
};

// DELETE /api/notifications/{id}/ - Eliminar notificación
export const deleteNotification = async (id) => {
  const response = await api.delete(`notifications/${id}/`);
  return response.data;
};

// POST /api/notifications/{id}/mark_as_read/ - Marcar una como leída
export const markNotificationAsRead = async (id) => {
  const response = await api.post(`notifications/${id}/mark_as_read/`);
  return response.data;
};

// POST /api/notifications/mark_all_as_read/ - Marcar todas como leídas
export const markAllNotificationsAsRead = async () => {
  const response = await api.post('notifications/mark_all_as_read/');
  return response.data;
};

// GET /api/notifications/unread_count/ - Contador de no leídas
export const getUnreadNotificationsCount = async () => {
  const response = await api.get('notifications/unread_count/');
  return response.data;
};
