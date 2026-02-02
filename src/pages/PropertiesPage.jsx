import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyList from '../components/Properties/PropertyList';
import Loader from '../components/UI/Loader';
import { getProperties, deleteProperty } from '../api/properties.api';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
      toast.error('Error al cargar las propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      toast.success('Propiedad eliminada correctamente');
      loadProperties(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      toast.error('Error al eliminar la propiedad');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Propiedades</h1>
          <p className="text-sm sm:text-base text-gray-600">Administra y gestiona todas tus propiedades</p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 w-full sm:w-auto shadow-sm hover:shadow-md whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Propiedad</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <PropertyList properties={properties} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default PropertiesPage;
