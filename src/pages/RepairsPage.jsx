import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import { getProperties } from '../api/properties.api';
import { getRepairsByProperty, deleteRepair } from '../api/repairs.api';

const RepairsPage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRepairs, setLoadingRepairs] = useState(false);

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

  const loadRepairs = async (propertyId) => {
    try {
      setLoadingRepairs(true);
      setSelectedProperty(propertyId);
      const data = await getRepairsByProperty(propertyId);
      setRepairs(data);
    } catch (error) {
      console.error('Error al cargar reparaciones:', error);
      toast.error('Error al cargar las reparaciones');
    } finally {
      setLoadingRepairs(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reparación?')) {
      try {
        await deleteRepair(id);
        toast.success('Reparación eliminada correctamente');
        if (selectedProperty) {
          loadRepairs(selectedProperty);
        }
      } catch (error) {
        console.error('Error al eliminar reparación:', error);
        toast.error('Error al eliminar la reparación');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reparaciones</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gestiona las reparaciones de tus propiedades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de Propiedades */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Propiedades</h2>
            <div className="space-y-2">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => loadRepairs(property.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    selectedProperty === property.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {property.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reparaciones */}
        <div className="lg:col-span-3">
          {!selectedProperty ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">
                Select a property to view its repairs
              </p>
            </div>
          ) : loadingRepairs ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {repairs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-4">
                    No repairs registered for this property
                  </p>
                  <Link
                    to={`/property/${selectedProperty}/add-repair`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Repair
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {repairs.length} Repair{repairs.length !== 1 ? 's' : ''}
                    </h2>
                    <Link
                      to={`/property/${selectedProperty}/add-repair`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Nueva Reparación
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {repairs.map((repair) => (
                      <div key={repair.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <h3 className="text-base font-semibold text-gray-900 flex-1">{repair.description}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold whitespace-nowrap">
                            ${parseFloat(repair.cost).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm mb-4">
                          <p className="text-gray-600">
                            <span className="font-medium text-gray-700">Date:</span>{' '}
                            {new Date(repair.date).toLocaleDateString()}
                          </p>
                          {repair.observation && (
                            <p className="text-gray-600">
                              <span className="font-medium text-gray-700">Observation:</span>{' '}
                              {repair.observation}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDelete(repair.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairsPage;
