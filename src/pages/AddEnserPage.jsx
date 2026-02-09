import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EnserForm from '../components/Enseres/EnserForm';
import { addEnserToProperty } from '../api/properties.api';

const AddEnserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('condition', data.condition);
      
      if (data.media) {
        formData.append('media', data.media);
      }
      
      await addEnserToProperty(id, formData);
      toast.success('Enser añadido exitosamente');
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error al añadir enser:', error);
      toast.error(error.response?.data?.detail || 'Error al añadir el enser');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/property/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to details
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Añadir Enser a la Propiedad</h1>
      
      <EnserForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AddEnserPage;
