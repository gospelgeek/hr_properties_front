import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import ObligationForm from '../components/Finance/ObligationForm';
import { addObligationToProperty } from '../api/finance.api';
import { getProperty } from '../api/properties.api';

const AddObligationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await getProperty(id);
      setProperty(data);
    } catch (error) {
      console.error('Error al cargar propiedad:', error);
      toast.error('Error al cargar la propiedad');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await addObligationToProperty(id, data);
      toast.success('Obligación creada correctamente');
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Error al crear obligación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!property) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/property/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la propiedad
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Crear Obligación</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Agregar nueva obligación para: <span className="font-semibold">{property.name || property.address}</span>
        </p>
      </div>

      <ObligationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default AddObligationPage;
