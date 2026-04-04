import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/UI/Loader';
import { addVehicleObligation, getVehicleById } from '../api/vehicles.api';
import { getObligationTypes } from '../api/finance.api';

const temporalityOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bimonthly', label: 'Bimonthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
  { value: 'one_time', label: 'One Time' },
];

const AddVehicleObligationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [obligationTypes, setObligationTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    entity_name: '',
    obligation_type: '',
    due_date: '',
    amount: '',
    temporality: 'monthly',
    file: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [vehicleData, typesData] = await Promise.all([getVehicleById(id), getObligationTypes()]);
        setVehicle(vehicleData);
        setObligationTypes(Array.isArray(typesData) ? typesData : []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading obligation setup');
        navigate(`/vehicles/${id}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.entity_name || !form.obligation_type || !form.due_date || !form.amount) {
      toast.error('Entity, type, due date and amount are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = form.file
        ? (() => {
            const formData = new FormData();
            formData.append('entity_name', form.entity_name);
            formData.append('obligation_type', String(form.obligation_type));
            formData.append('due_date', form.due_date);
            formData.append('amount', String(form.amount));
            formData.append('temporality', form.temporality);
            formData.append('file', form.file);
            return formData;
          })()
        : {
            entity_name: form.entity_name,
            obligation_type: Number(form.obligation_type),
            due_date: form.due_date,
            amount: String(form.amount),
            temporality: form.temporality,
          };

      await addVehicleObligation(id, payload);
      toast.success('Obligation created successfully');
      navigate(`/vehicles/${id}/obligations`);
    } catch (error) {
      console.error('Error creating obligation:', error);
      toast.error(error?.response?.data?.error || 'Error creating obligation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/vehicles/${id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to vehicle detail
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Vehicle Obligation</h1>
      <p className="text-gray-600 mb-6">
        Vehicle: <span className="font-semibold">{vehicle?.brand} {vehicle?.model}</span>
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Obligation Type *</label>
          <select
            value={form.obligation_type}
            onChange={(e) => setForm((prev) => ({ ...prev, obligation_type: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          >
            <option value="">Select type...</option>
            {obligationTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {String(type.name || '').charAt(0).toUpperCase() + String(type.name || '').slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entity *</label>
          <input
            value={form.entity_name}
            onChange={(e) => setForm((prev) => ({ ...prev, entity_name: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            placeholder="Sura"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            placeholder="2300000.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm((prev) => ({ ...prev, due_date: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Periodicity *</label>
          <select
            value={form.temporality}
            onChange={(e) => setForm((prev) => ({ ...prev, temporality: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          >
            {temporalityOptions.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">File (optional)</label>
          <input
            type="file"
            onChange={(e) => setForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Create Obligation'}
        </button>
      </form>
    </div>
  );
};

export default AddVehicleObligationPage;
