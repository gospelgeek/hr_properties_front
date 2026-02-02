import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyList from '../components/Properties/PropertyList';
import Loader from '../components/UI/Loader';
import { getDeletedProperties, restoreProperty } from '../api/properties.api';

const DeletedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeletedProperties();
  }, []);

  const loadDeletedProperties = async () => {
    try {
      setLoading(true);
      const data = await getDeletedProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error al cargar propiedades eliminadas:', error);
      toast.error('Error al cargar las propiedades eliminadas');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreProperty(id);
      toast.success('Propiedad restaurada correctamente');
      loadDeletedProperties(); // Recargar la lista
    } catch (error) {
      console.error('Error al restaurar propiedad:', error);
      toast.error('Error al restaurar la propiedad');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a propiedades activas
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Propiedades Eliminadas</h1>

      {loading ? (
        <Loader />
      ) : (
        <PropertyList
          properties={properties}
          onDelete={() => {}}
          showRestoreButton={true}
          onRestore={handleRestore}
        />
      )}
    </div>
  );
};

export default DeletedPropertiesPage;
