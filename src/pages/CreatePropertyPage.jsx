import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../components/Properties/PropertyForm';
import { createProperty, uploadMedia } from '../api/properties.api';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      await createProperty(data);
      toast.success('Property created successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Error creating property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to properties
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Property</h1>
      
      <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreatePropertyPage;
