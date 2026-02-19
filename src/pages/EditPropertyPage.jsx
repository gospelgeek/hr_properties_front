import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../components/Properties/PropertyForm';
import Loader from '../components/UI/Loader';
import { getProperty, updateProperty, uploadMedia } from '../api/properties.api';

const EditPropertyPage = () => {
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
      console.error('Error loading property:', error);
      toast.error('Error loading property');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateProperty(id, data);
      toast.success('Property updated successfully');
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Property not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link to={`/property/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to details
        </Link>
        <div className="flex gap-3">
          <Link 
            to={`/property/${id}/add-repair`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Repair
          </Link>
          <Link 
            to={`/property/${id}/add-enser`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Enser
          </Link>
          <Link 
            to={`/property/${id}/add-law`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add documentation
          </Link>
          <Link 
            to={`/property/${id}/upload-media`}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Media
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Property</h1>
      
      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditPropertyPage;
