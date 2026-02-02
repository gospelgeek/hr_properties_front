import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import RepairForm from '../components/Repairs/RepairForm';
import Loader from '../components/UI/Loader';
import { addRepairToProperty } from '../api/repairs.api';
import { getProperty } from '../api/properties.api';

const AddRepairPage = () => {
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
      await addRepairToProperty(id, data);
      toast.success('Reparación agregada exitosamente');
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error al agregar reparación:', error);
      toast.error('Error al agregar la reparación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/property/${id}`} className="btn btn-ghost btn-sm gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a {property?.name}
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Agregar Reparación</h1>
        <p className="text-base-content/70 mt-2">
          Registra una nueva reparación para {property?.name}
        </p>
      </div>
      
      <RepairForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};

export default AddRepairPage;
