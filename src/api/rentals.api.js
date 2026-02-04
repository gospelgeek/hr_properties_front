import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  const response = await api.post('tenants/', tenantData);
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
  // Si hay un archivo, usar FormData, de lo contrario usar JSON
  if (rentalData.url_files instanceof File) {
    const formData = new FormData();
    
    // Agregar todos los campos excepto url_files
    formData.append('status', rentalData.status);
    if (rentalData.tenant) {
      formData.append('tenant', rentalData.tenant);
    }
    formData.append('rental_type', rentalData.rental_type);
    formData.append('check_in', rentalData.check_in);
    formData.append('check_out', rentalData.check_out);
    formData.append('amount', rentalData.amount);
    formData.append('people_count', rentalData.people_count);
    
    // Agregar monthly_data o airbnb_data como JSON string
    if (rentalData.monthly_data) {
      formData.append('monthly_data', JSON.stringify(rentalData.monthly_data));
      formData.append('url_files', rentalData.url_files);
    }
    if (rentalData.airbnb_data) {
      formData.append('airbnb_data', JSON.stringify(rentalData.airbnb_data));
    }
    
    const response = await axios.post(
      `${API_URL}properties/${propertyId}/add_rental/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } else {
    const response = await api.post(`properties/${propertyId}/add_rental/`, rentalData);
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
  const response = await api.patch(`properties/${propertyId}/rentals/${rentalId}/`, rentalData);
  return response.data;
};

// DELETE /api/properties/{id}/rentals/{rental_id}/ - Eliminar rental
export const deletePropertyRental = async (propertyId, rentalId) => {
  const response = await api.delete(`properties/${propertyId}/rentals/${rentalId}/`);
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════
// PAGOS DE RENTALS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/properties/{id}/rentals/{rental_id}/add_payment/ - Añadir pago a un rental
export const addPaymentToRental = async (propertyId, rentalId, paymentData) => {
  console.log('Adding payment data:', paymentData);
  const response = await api.post(`properties/${propertyId}/rentals/${rentalId}/add_payment/`, paymentData);
console.log('Response from adding payment:', response.data);
  return response.data;
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
