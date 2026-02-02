import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const MediaUploadForm = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Generate previews and auto-detect media types
      const urls = files.map(file => {
        if (file.type.startsWith('image/')) {
          return { type: 'image', url: URL.createObjectURL(file), name: file.name };
        } else if (file.type.startsWith('video/')) {
          return { type: 'video', url: URL.createObjectURL(file), name: file.name };
        } else {
          return { type: 'file', url: null, name: file.name };
        }
      });
      setPreviewUrls(urls);
      
      // Initialize media types with auto-detection
      const types = files.map(file => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type.includes('pdf') || file.type.includes('doc')) return 'document';
        return 'document'; // Default to document instead of OTHER
      });
      setMediaTypes(types);
    }
  };

  const handleMediaTypeChange = (index, value) => {
    const newTypes = [...mediaTypes];
    newTypes[index] = value;
    setMediaTypes(newTypes);
  };

  const handleFormSubmit = (data) => {
    if (selectedFiles.length === 0) {
      return;
    }
    onSubmit({ files: selectedFiles, mediaTypes });
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newTypes = mediaTypes.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    setMediaTypes(newTypes);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Subir Archivos Multimedia
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Seleccionar Archivos (Imágenes, Videos, etc.) *
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-500 mt-1">
            Puedes seleccionar múltiples archivos a la vez
          </p>
        </div>

        {/* Previews */}
        {previewUrls.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              Archivos seleccionados ({previewUrls.length}):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previewUrls.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {preview.type === 'image' && (
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        {preview.type === 'video' && (
                          <video
                            src={preview.url}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        {preview.type === 'file' && (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium truncate">{preview.name}</p>
                        <div className="mt-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Tipo de Archivo
                          </label>
                          <select
                            value={mediaTypes[index]}
                            onChange={(e) => handleMediaTypeChange(index, e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                          >
                            <option value="image">Imagen</option>
                            <option value="video">Video</option>
                            <option value="document">Documento</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading || selectedFiles.length === 0}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Subir Archivos
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MediaUploadForm;
