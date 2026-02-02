import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET /api/properties/ - Listar propiedades activas
export const getProperties = async () => {
  const response = await api.get('properties/');
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
  const response = await api.post('properties/', propertyData);
  return response.data;
};

// PUT/PATCH /api/properties/{id}/ - Actualizar propiedad
export const updateProperty = async (id, propertyData) => {
  const response = await api.patch(`properties/${id}/`, propertyData);
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
  const response = await api.get(`properties/${propertyId}/laws/`);
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
