import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const LawForm = ({ initialData, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.url_media || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // For PDFs and documents, we won't show preview
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, media: selectedFile });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Editar Documentacion/Normativa' : 'Nueva Documentacion/Normativa'}
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Nombre de la Entidad *
          </label>
          <input
            type="text"
            {...register('entity_name', { required: 'El nombre de la entidad es requerido' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="Ej: BANCO, Notaría, etc."
          />
          {errors.entity_name && (
            <p className="text-sm text-red-600">{errors.entity_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Número Legal *
          </label>
          <input
            type="text"
            {...register('legal_number', { required: 'El número legal es requerido' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="Ej: 123243"
          />
          {errors.legal_number && (
            <p className="text-sm text-red-600">{errors.legal_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Monto Original *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('original_amount', { required: 'El monto original es requerido' })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="Ej: 500000000.00"
          />
          {errors.original_amount && (
            <p className="text-sm text-red-600">{errors.original_amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_paid')}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-gray-900">¿Está pagado?</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Documento (PDF, Imagen, etc.)
          </label>
          <input
            type="file"
            accept="application/pdf,image/*,.doc,.docx"
            onChange={handleFileChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-2">
              Archivo seleccionado: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
          {previewUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              initialData ? 'Actualizar Documentacion/Normativa' : 'Crear Documentacion/Normativa'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LawForm;
