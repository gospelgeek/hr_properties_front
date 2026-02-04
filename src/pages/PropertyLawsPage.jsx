import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { getPropertyLaws, deletePropertyLaw, updatePropertyLaw } from '../api/properties.api';

const PropertyLawsPage = () => {
  const { id } = useParams();
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lawToDelete, setLawToDelete] = useState(null);
  const [editingLaw, setEditingLaw] = useState(null);
  const [formData, setFormData] = useState({
    entity_name: '',
    legal_number: '',
    original_amount: '',
    is_paid: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadPropertyLaws();
  }, [id]);

  const loadPropertyLaws = async () => {
    try {
      setLoading(true);
      const data = await getPropertyLaws(id);
      const lawsData = Array.isArray(data) ? data : (data?.laws || data?.results || []);
      setLaws(lawsData);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      toast.error('Error al cargar los documentos');
      setLaws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (law) => {
    setEditingLaw(law);
    setFormData({
      entity_name: law.entity_name || '',
      legal_number: law.legal_number || '',
      original_amount: law.original_amount || '',
      is_paid: law.is_paid || false,
    });
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingLaw(null);
    setFormData({
      entity_name: '',
      legal_number: '',
      original_amount: '',
      is_paid: false,
    });
    setSelectedFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      updateData.append('entity_name', formData.entity_name);
      updateData.append('legal_number', formData.legal_number);
      updateData.append('original_amount', formData.original_amount);
      updateData.append('is_paid', formData.is_paid);
      
      if (selectedFile) {
        updateData.append('media', selectedFile);
      }

      await updatePropertyLaw(id, editingLaw.id, updateData);
      toast.success('Documento actualizado exitosamente');
      handleCancelEdit();
      loadPropertyLaws();
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      toast.error('Error al actualizar el documento');
    }
  };

  const handleDeleteClick = (law) => {
    console.log('🔴 handleDeleteClick - Ley a eliminar:', law);
    console.log('🔴 Estado actual showDeleteDialog:', showDeleteDialog);
    setLawToDelete(law);
    setShowDeleteDialog(true);
    console.log('🔴 Después de setShowDeleteDialog(true)');
  };

  const handleConfirmDelete = async () => {
    console.log('✅ handleConfirmDelete - Confirmando eliminación');
    console.log('✅ lawToDelete:', lawToDelete);
    try {
      await deletePropertyLaw(id, lawToDelete.id);
      toast.success('Document deleted successfully');
      console.log('✅ Closing dialog...');
      setShowDeleteDialog(false);
      setLawToDelete(null);
      loadPropertyLaws();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleCancelDelete = useCallback(() => {
    console.log('❌ handleCancelDelete - Canceling deletion');
    setShowDeleteDialog(false);
    setLawToDelete(null);
  }, []);

  const deleteDialogMessage = useMemo(
    () => `Are you sure you want to delete the document "${lawToDelete?.entity_name}"? This action cannot be undone.`,
    [lawToDelete?.entity_name]
  );

  if (loading) {
    return <Loader />;
  }

  console.log('🔄 PropertyLawsPage RENDER - showDeleteDialog:', showDeleteDialog, 'editingLaw:', !!editingLaw);

  return (
    <>
      {/* Modal de edición */}
      {editingLaw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
              <h2 className="text-2xl font-bold">Edit Document</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Entity Name *
                </label>
                <input
                  type="text"
                  value={formData.entity_name}
                  onChange={(e) => setFormData({ ...formData, entity_name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Legal Number *
                </label>
                <input
                  type="text"
                  value={formData.legal_number}
                  onChange={(e) => setFormData({ ...formData, legal_number: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Original Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.original_amount}
                  onChange={(e) => setFormData({ ...formData, original_amount: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_paid"
                  checked={formData.is_paid}
                  onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_paid" className="text-sm font-semibold text-gray-900">
                  Is Paid?
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Update Document (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenido principal de la página */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to={`/property/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Property Details
          </Link>
        </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-6 rounded-t-xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Documents and Regulations</h1>
          <p className="text-blue-100">
            {laws.length} {laws.length === 1 ? 'document found' : 'documents found'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {laws.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No documents registered</p>
              <Link
                to={`/property/${id}/add-law`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium px-6 py-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add first document
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {laws.map((law) => (
                <div key={law.id} className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {law.entity_name || 'Entidad sin nombre'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      law.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {law.is_paid ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Legal Number</p>
                        <p className="text-sm text-gray-900 font-medium">{law.legal_number}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Original Amount</p>
                        <p className="text-sm text-gray-900 font-bold">${parseFloat(law.original_amount).toLocaleString()}</p>
                      </div>
                    </div>

                    {law.url && (
                      <a
                        href={law.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        View attached document
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(law)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm inline-flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(law)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-sm inline-flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>

                  {law.created_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Registered: {new Date(law.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Diálogo de confirmación de eliminación */}
    <ConfirmDialog
      isOpen={showDeleteDialog}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Delete Document"
      message={deleteDialogMessage}
      confirmText="Delete"
      cancelText="Cancel"
      isDanger={true}
    />
  </>
  );
};

export default PropertyLawsPage;
