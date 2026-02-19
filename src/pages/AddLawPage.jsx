import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LawForm from '../components/Laws/LawForm';
import { addLawToProperty } from '../api/properties.api';

const AddLawPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('entity_name', data.entity_name);
      formData.append('legal_number', data.legal_number);
      formData.append('original_amount', data.original_amount);
      formData.append('is_paid', data.is_paid || false);
      
      if (data.media) {
        formData.append('media', data.media);
      }
      
      await addLawToProperty(id, formData);
      toast.success('Documentation added successfully');
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error adding documentation:', error);
      toast.error(error.response?.data?.detail || 'Error adding the documentation');
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

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Documentation</h1>
      
      <LawForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AddLawPage;
