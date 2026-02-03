import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import TenantCard from '../components/Rentals/TenantCard';
import TenantForm from '../components/Rentals/TenantForm';
import { getTenants, createTenant, updateTenant, deleteTenant } from '../api/rentals.api';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const data = await getTenants();
      setTenants(data);
    } catch (error) {
      console.error('Error al cargar inquilinos:', error);
      toast.error('Error al cargar inquilinos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (editingTenant) {
        await updateTenant(editingTenant.id, data);
        toast.success('Inquilino actualizado correctamente');
      } else {
        await createTenant(data);
        toast.success('Inquilino creado correctamente');
      }
      setShowForm(false);
      setEditingTenant(null);
      loadTenants();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;
    
    try {
      await deleteTenant(id);
      toast.success('Tenant deleted successfully');
      loadTenants();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting tenant');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTenant(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tenants</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your tenants</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-5 py-3 font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Cancel' : 'New Tenant'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TenantForm
            initialData={editingTenant}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
          {editingTenant && (
            <button
              onClick={handleCancel}
              className="mt-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors px-4 py-2 text-sm font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : tenants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tenants found</h3>
          <p className="text-gray-600 mb-4">Create your first tenant to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-2 text-sm font-medium"
          >
            Create Tenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantsPage;
