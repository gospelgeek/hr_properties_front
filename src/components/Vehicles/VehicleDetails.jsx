import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import autoImg from '../../assets/auto.png';
import Modal from '../UI/Modal';
import {
  addVehicleDocument,
  addVehicleImage,
  addVehicleRepair,
  assignVehicleResponsible,
  deleteRepair,
  deleteVehicleDocument,
  deleteVehicleImage,
  getVehicleDocuments,
  getVehicleImages,
  getVehicleRepairs,
  getVehicleResponsible,
  getVehicleResponsibles,
  getProtectedMediaPreviewUrl,
  openProtectedMedia,
  removeVehicleResponsible,
  updateVehicleRepair,
  updateVehicleResponsible,
} from '../../api/vehicles.api';

const vehicleTypeLabels = {
  commercial: 'Commercial',
  sport: 'Sport',
  permanent_use: 'Permanent Use',
  water: 'Water',
};

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const initialResponsibleForm = {
  responsible_id: '',
  name: '',
  email: '',
  number: '',
};

const initialRepairForm = {
  observation: '',
  date: '',
  description: '',
  cost: '',
};

const VehicleDetails = ({ vehicle, onReload, onDelete }) => {
  const [documents, setDocuments] = useState(vehicle?.documents || []);
  const [images, setImages] = useState(vehicle?.images || []);
  const [responsibles, setResponsibles] = useState(vehicle?.responsibles || []);
  const [availableResponsibles, setAvailableResponsibles] = useState([]);
  const [repairs, setRepairs] = useState(vehicle?.repairs || []);

  const [showDocuments, setShowDocuments] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showRepairs, setShowRepairs] = useState(false);

  const [showDocModal, setShowDocModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const [docName, setDocName] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState({});
  const [loadingImagePreviews, setLoadingImagePreviews] = useState(false);

  const [responsibleForm, setResponsibleForm] = useState(initialResponsibleForm);
  const [editingResponsibleId, setEditingResponsibleId] = useState(null);
  const [editingResponsibleData, setEditingResponsibleData] = useState({ name: '', email: '', number: '' });

  const [repairForm, setRepairForm] = useState(initialRepairForm);
  const [editingRepairId, setEditingRepairId] = useState(null);
  const [editingRepairData, setEditingRepairData] = useState(initialRepairForm);

  const [loadingSections, setLoadingSections] = useState(false);

  const formatMoney = (value) => currencyFormatter.format(Number(value || 0));

  const loadSections = async () => {
    try {
      setLoadingSections(true);
      const [docs, imgs, resp, reps, catalog] = await Promise.all([
        getVehicleDocuments(vehicle.id),
        getVehicleImages(vehicle.id),
        getVehicleResponsible(vehicle.id),
        getVehicleRepairs(vehicle.id),
        getVehicleResponsibles(),
      ]);
      setDocuments(Array.isArray(docs) ? docs : []);
      setImages(Array.isArray(imgs) ? imgs : []);
      setResponsibles(Array.isArray(resp) ? resp : []);
      setRepairs(Array.isArray(reps) ? reps : []);
      setAvailableResponsibles(Array.isArray(catalog) ? catalog : []);
    } catch (error) {
      console.error('Error loading vehicle detail sections:', error);
      toast.error('Error loading vehicle resources');
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    setDocuments(vehicle?.documents || []);
    setImages(vehicle?.images || []);
    setResponsibles(vehicle?.responsibles || []);
    setRepairs(vehicle?.repairs || []);
  }, [vehicle]);

  useEffect(() => {
    if (vehicle?.id) {
      loadSections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.id]);

  useEffect(() => {
    if (selectedImageIndex !== null && selectedImageIndex >= images.length) {
      setSelectedImageIndex(images.length > 0 ? images.length - 1 : null);
    }
  }, [images.length, selectedImageIndex]);

  useEffect(() => {
    let isMounted = true;
    const objectUrls = [];

    const loadImagePreviews = async () => {
      if (!showImages || images.length === 0) {
        setImagePreviewUrls({});
        return;
      }

      try {
        setLoadingImagePreviews(true);
        const previews = await Promise.all(
          images.map(async (item) => {
            if (!item?.id || !item?.image) return [item?.id, ''];

            try {
              const previewUrl = await getProtectedMediaPreviewUrl(item.image);
              objectUrls.push(previewUrl);
              return [item.id, previewUrl];
            } catch (error) {
              console.error('Error loading vehicle image preview:', error);
              return [item.id, ''];
            }
          })
        );

        if (isMounted) {
          setImagePreviewUrls(Object.fromEntries(previews));
        }
      } finally {
        if (isMounted) {
          setLoadingImagePreviews(false);
        }
      }
    };

    loadImagePreviews();

    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images, showImages]);

  const handleReloadAll = async () => {
    await loadSections();
    if (typeof onReload === 'function') {
      await onReload();
    }
  };

  const handleOpenProtectedFile = async (url) => {
    if (!url) return;
    try {
      await openProtectedMedia(url);
    } catch (error) {
      console.error('Error opening protected file:', error);
      toast.error('Could not open file');
    }
  };

  const handleAddDocument = async (event) => {
    event.preventDefault();
    if (!docName || !docFile) {
      toast.error('Name and file are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', docName);
      formData.append('file', docFile);
      await addVehicleDocument(vehicle.id, formData);
      toast.success('Document added successfully');
      setDocName('');
      setDocFile(null);
      setShowDocModal(false);
      await handleReloadAll();
    } catch (error) {
      console.error('Error adding vehicle document:', error);
      toast.error('Error adding document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteVehicleDocument(vehicle.id, documentId);
      toast.success('Document deleted successfully');
      await handleReloadAll();
    } catch (error) {
      console.error('Error deleting vehicle document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleAddImage = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      toast.error('Image file is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      await addVehicleImage(vehicle.id, formData);
      toast.success('Image added successfully');
      setImageFile(null);
      setShowImageModal(false);
      await handleReloadAll();
    } catch (error) {
      console.error('Error adding vehicle image:', error);
      toast.error('Error adding image');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!imageId) {
      toast.error('Image not found');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteVehicleImage(vehicle.id, imageId);
      toast.success('Image deleted successfully');
      await handleReloadAll();
    } catch (error) {
      console.error('Error deleting vehicle image:', error);
      toast.error('Error deleting image');
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const hasResponsible = responsibles.length > 0;

  const handleAssignResponsible = async (event) => {
    event.preventDefault();
    if (hasResponsible) return;

    const payload = {};
    if (responsibleForm.responsible_id) {
      payload.responsible_id = Number(responsibleForm.responsible_id);
    } else {
      if (!responsibleForm.name) {
        toast.error('Select an existing responsible or enter a name');
        return;
      }
      payload.name = responsibleForm.name;
      if (responsibleForm.email) payload.email = responsibleForm.email;
      if (responsibleForm.number) payload.number = responsibleForm.number;
    }

    try {
      await assignVehicleResponsible(vehicle.id, payload);
      toast.success('Responsible assigned successfully');
      setResponsibleForm(initialResponsibleForm);
      await handleReloadAll();
    } catch (error) {
      console.error('Error assigning responsible:', error);
      toast.error('Error assigning responsible');
    }
  };

  const handleStartEditResponsible = (item) => {
    setEditingResponsibleId(item.id);
    setEditingResponsibleData({
      name: item.name || '',
      email: item.email || '',
      number: item.number || '',
    });
  };

  const handleUpdateResponsible = async (responsibleId) => {
    try {
      await updateVehicleResponsible(responsibleId, editingResponsibleData);
      toast.success('Responsible updated successfully');
      setEditingResponsibleId(null);
      await handleReloadAll();
    } catch (error) {
      console.error('Error updating responsible:', error);
      toast.error('Error updating responsible');
    }
  };

  const handleRemoveResponsible = async (responsibleId) => {
    if (!window.confirm('Are you sure you want to remove this responsible?')) return;
    try {
      await removeVehicleResponsible(vehicle.id, responsibleId);
      toast.success('Responsible removed successfully');
      await handleReloadAll();
    } catch (error) {
      console.error('Error removing responsible:', error);
      toast.error('Error removing responsible');
    }
  };

  const handleAddRepair = async (event) => {
    event.preventDefault();
    if (!repairForm.observation || !repairForm.date || !repairForm.description || !repairForm.cost) {
      toast.error('Observation, date, description and cost are required');
      return;
    }

    try {
      await addVehicleRepair(vehicle.id, {
        observation: repairForm.observation,
        date: repairForm.date,
        description: repairForm.description,
        cost: String(repairForm.cost),
      });
      toast.success('Repair added successfully');
      setRepairForm(initialRepairForm);
      setShowRepairModal(false);
      await handleReloadAll();
    } catch (error) {
      console.error('Error adding vehicle repair:', error);
      toast.error('Error adding repair');
    }
  };

  const handleStartEditRepair = (item) => {
    setEditingRepairId(item.id);
    setEditingRepairData({
      observation: item.observation || '',
      date: item.date || '',
      description: item.description || '',
      cost: item.cost || '',
    });
  };

  const handleUpdateRepair = async (repairId) => {
    try {
      await updateVehicleRepair(repairId, {
        observation: editingRepairData.observation,
        date: editingRepairData.date,
        description: editingRepairData.description,
        cost: String(editingRepairData.cost),
      });
      toast.success('Repair updated successfully');
      setEditingRepairId(null);
      await handleReloadAll();
    } catch (error) {
      console.error('Error updating vehicle repair:', error);
      toast.error('Error updating repair');
    }
  };

  const handleDeleteRepair = async (repairId) => {
    if (!window.confirm('Are you sure you want to delete this repair?')) return;
    try {
      await deleteRepair(repairId);
      toast.success('Repair deleted successfully');
      await handleReloadAll();
    } catch (error) {
      console.error('Error deleting repair:', error);
      toast.error('Error deleting repair');
    }
  };

  const vehicleTypeLabel = useMemo(() => {
    return vehicleTypeLabels[String(vehicle?.type || '').toLowerCase()] || 'Unknown';
  }, [vehicle?.type]);

  const primaryResponsible = responsibles[0]?.name || 'Not assigned';

  const renderSectionHeader = (title, count, isOpen, onToggle) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors bg-gray-50 rounded-lg border border-gray-200"
    >
      <h3 className="text-xl font-bold text-gray-900">
        {title} ({count})
      </h3>
      <svg
        className={`w-6 h-6 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-100 overflow-hidden">
        <img
          src={vehicle?.photo || autoImg}
          alt={`${vehicle?.brand || ''} ${vehicle?.model || ''}`.trim() || 'Vehicle'}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = autoImg;
          }}
        />
      </div>

      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {vehicle?.brand || 'Unknown brand'} {vehicle?.model || ''}
        </h1>
        <p className="text-blue-100 text-sm sm:text-base">
          {vehicleTypeLabel} - Owner: {vehicle?.owner || 'Not specified'}
        </p>

        <div className="flex flex-wrap gap-3 mt-6 items-center">
          <Link
            to={`/vehicles/${vehicle.id}/edit`}
            className="bg-white text-blue-700 rounded-lg transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            Edit Vehicle
          </Link>
          <Link
            to={`/vehicles/${vehicle.id}/obligations`}
            className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            Obligations
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <section className="bg-gray-50 rounded-lg border border-gray-200 p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Brand</p>
              <p className="text-sm text-gray-900 mt-1">{vehicle?.brand || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Model</p>
              <p className="text-sm text-gray-900 mt-1">{vehicle?.model || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Type</p>
              <p className="text-sm text-gray-900 mt-1">{vehicleTypeLabel}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Purchase Price</p>
              <p className="text-sm text-gray-900 mt-1">{formatMoney(vehicle?.purchase_price)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Purchase Date</p>
              <p className="text-sm text-gray-900 mt-1">{vehicle?.purchase_date || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Responsible</p>
              <p className="text-sm text-gray-900 mt-1">{primaryResponsible}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {renderSectionHeader('Documents', documents.length, showDocuments, () => setShowDocuments((prev) => !prev))}
          {showDocuments && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <button
                type="button"
                onClick={() => setShowDocModal(true)}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 mb-4"
              >
                Add Document
              </button>

              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">No documents uploaded.</div>
                ) : (
                  documents.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <button type="button" onClick={() => handleOpenProtectedFile(item.file)} className="text-sm text-blue-600 hover:text-blue-700">
                          Open file
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(item.id)}
                        className="bg-red-100 text-red-700 rounded-lg px-3 py-2 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          {renderSectionHeader('Images', images.length, showImages, () => setShowImages((prev) => !prev))}
          {showImages && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 mb-4"
              >
                Add Image
              </button>

              {images.length === 0 ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">No images uploaded.</div>
              ) : (
                <>
                  {selectedImageIndex !== null ? (
                    <div className="mt-4">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
                        <div className="relative bg-gray-900">
                          {images[selectedImageIndex]?.image && (
                            <img
                              src={imagePreviewUrls[images[selectedImageIndex].id] || images[selectedImageIndex].image}
                              alt={`Vehicle image ${selectedImageIndex + 1}`}
                              className="w-full max-h-150 object-contain"
                            />
                          )}

                          {images.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={handlePrevImage}
                                disabled={selectedImageIndex === 0}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={handleNextImage}
                                disabled={selectedImageIndex === images.length - 1}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedImageIndex(null)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {selectedImageIndex + 1} of {images.length}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOpenProtectedFile(images[selectedImageIndex]?.image)}
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Open in new tab
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(images[selectedImageIndex]?.id)}
                              className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete image
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {images.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-left hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            {imagePreviewUrls[item.id] ? (
                              <img
                                src={imagePreviewUrls[item.id]}
                                alt={`Vehicle asset ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 px-2 text-center">
                                {loadingImagePreviews ? 'Loading preview...' : 'Preview unavailable'}
                              </div>
                            )}
                          </div>
                          <div className="p-2 flex items-center justify-between gap-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Image</span>
                            <span className="text-xs text-gray-600">#{index + 1}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          {renderSectionHeader('Repairs', repairs.length, showRepairs, () => setShowRepairs((prev) => !prev))}
          {showRepairs && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <button
                type="button"
                onClick={() => setShowRepairModal(true)}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 mb-4"
              >
                Add Repair
              </button>

              <div className="space-y-3">
                {repairs.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">No repairs registered.</div>
                ) : (
                  repairs.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      {editingRepairId === item.id ? (
                        <div className="space-y-2">
                          <input
                            value={editingRepairData.observation}
                            onChange={(e) => setEditingRepairData((prev) => ({ ...prev, observation: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Observation"
                          />
                          <input
                            type="date"
                            value={editingRepairData.date}
                            onChange={(e) => setEditingRepairData((prev) => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <textarea
                            value={editingRepairData.description}
                            onChange={(e) => setEditingRepairData((prev) => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            rows={3}
                            placeholder="Description"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={editingRepairData.cost}
                            onChange={(e) => setEditingRepairData((prev) => ({ ...prev, cost: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Cost"
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleUpdateRepair(item.id)} className="bg-blue-600 text-white rounded-lg px-3 py-2 text-xs font-medium">
                              Save
                            </button>
                            <button type="button" onClick={() => setEditingRepairId(null)} className="bg-gray-200 text-gray-700 rounded-lg px-3 py-2 text-xs font-medium">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-900">{item.observation || 'Repair'}</p>
                          <p className="text-sm text-gray-600">Date: {item.date}</p>
                          <p className="text-sm text-gray-600">Description: {item.description}</p>
                          <p className="text-sm text-gray-600">Cost: {formatMoney(item.cost)}</p>
                          <div className="flex gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => handleStartEditRepair(item)}
                              className="bg-yellow-100 text-yellow-800 rounded-lg px-3 py-2 text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRepair(item.id)}
                              className="bg-red-100 text-red-700 rounded-lg px-3 py-2 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {!hasResponsible && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Assign Responsible</h3>
                <form onSubmit={handleAssignResponsible} className="space-y-3">
                  <select
                    value={responsibleForm.responsible_id}
                    onChange={(e) => setResponsibleForm((prev) => ({ ...prev, responsible_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select existing responsible</option>
                    {availableResponsibles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Or create and assign a new responsible.</p>
                  <input
                    value={responsibleForm.name}
                    onChange={(e) => setResponsibleForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Responsible name"
                  />
                  <input
                    type="email"
                    value={responsibleForm.email}
                    onChange={(e) => setResponsibleForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Responsible email"
                  />
                  <input
                    value={responsibleForm.number}
                    onChange={(e) => setResponsibleForm((prev) => ({ ...prev, number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Responsible phone"
                  />
                  <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
                    Assign Responsible
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {responsibles.length === 0 ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">No responsibles assigned.</div>
              ) : (
                responsibles.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    {editingResponsibleId === item.id ? (
                      <div className="space-y-2">
                        <input
                          value={editingResponsibleData.name}
                          onChange={(e) => setEditingResponsibleData((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Name"
                        />
                        <input
                          value={editingResponsibleData.email}
                          onChange={(e) => setEditingResponsibleData((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Email"
                        />
                        <input
                          value={editingResponsibleData.number}
                          onChange={(e) => setEditingResponsibleData((prev) => ({ ...prev, number: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Phone"
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleUpdateResponsible(item.id)} className="bg-blue-600 text-white rounded-lg px-3 py-2 text-xs font-medium">
                            Save
                          </button>
                          <button type="button" onClick={() => setEditingResponsibleId(null)} className="bg-gray-200 text-gray-700 rounded-lg px-3 py-2 text-xs font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.email || 'No email'}</p>
                        <p className="text-sm text-gray-600">{item.number || 'No phone'}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => handleStartEditResponsible(item)}
                            className="bg-yellow-100 text-yellow-800 rounded-lg px-3 py-2 text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveResponsible(item.id)}
                            className="bg-red-100 text-red-700 rounded-lg px-3 py-2 text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Obligations</h2>
          <p className="text-sm text-gray-600">Manage obligations and payments from obligations pages.</p>
          <div className="flex gap-3 mt-3">
            <Link
              to={`/vehicles/${vehicle.id}/add-obligation`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Add Obligation
            </Link>
            <Link
              to={`/vehicles/${vehicle.id}/obligations`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Obligations
            </Link>
          </div>
        </section>

        {loadingSections && <div className="text-sm text-gray-500">Refreshing vehicle resources...</div>}
      </div>

      <Modal isOpen={showDocModal} onClose={() => setShowDocModal(false)} title="Add Document">
        <form onSubmit={handleAddDocument} className="space-y-3">
          <input value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Document name" />
          <input type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
            Add Document
          </button>
        </form>
      </Modal>

      <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title="Add Image">
        <form onSubmit={handleAddImage} className="space-y-3">
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
            Add Image
          </button>
        </form>
      </Modal>

      <Modal isOpen={showRepairModal} onClose={() => setShowRepairModal(false)} title="Add Repair">
        <form onSubmit={handleAddRepair} className="space-y-3">
          <input
            value={repairForm.observation}
            onChange={(e) => setRepairForm((prev) => ({ ...prev, observation: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Observation (repair name)"
          />
          <input type="date" value={repairForm.date} onChange={(e) => setRepairForm((prev) => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <textarea
            value={repairForm.description}
            onChange={(e) => setRepairForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Description"
          />
          <input
            type="number"
            step="0.01"
            value={repairForm.cost}
            onChange={(e) => setRepairForm((prev) => ({ ...prev, cost: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Cost"
          />
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700">
            Add Repair
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default VehicleDetails;
