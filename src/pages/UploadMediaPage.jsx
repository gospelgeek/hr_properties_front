import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import MediaUploadForm from '../components/Properties/MediaUploadForm';
import { uploadMedia } from '../api/properties.api';

const UploadMediaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Upload files one by one with their media types
      const uploadPromises = data.files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('files', file);
        
        // Convert media type to lowercase as backend expects
        const mediaType = data.mediaTypes[index].toLowerCase();
        formData.append('media_type', mediaType);
        
        console.log('Uploading:', {
          fileName: file.name,
          mediaType: mediaType
        });
        
        return uploadMedia(id, formData);
      });
      
      await Promise.all(uploadPromises);
      toast.success(`${data.files.length} archivo(s) subido(s) exitosamente`);
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.detail || error.response?.data?.message || 'Error al subir los archivos');
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
          Volver a detalles
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Subir Archivos a la Propiedad</h1>
      
      <MediaUploadForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default UploadMediaPage;
