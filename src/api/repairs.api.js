import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_LOCAL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
