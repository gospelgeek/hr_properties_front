import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getObligationTypes } from '../../api/finance.api';

const normalizeObligationForm = (obligation = {}) => {
  const obligationTypeValue =
    typeof obligation.obligation_type === 'object'
      ? obligation.obligation_type?.id || ''
      : obligation.obligation_type || '';

  return {
    obligation_type: obligationTypeValue,
    entity_name: obligation.entity_name || '',
    amount: obligation.amount || '',
    due_date: obligation.due_date ? String(obligation.due_date).slice(0, 10) : '',
    temporality: obligation.temporality || 'monthly',
  };
};

function ObligationEditModal({ obligation, onClose, onSave, isLoading = false }) {
  const [obligationTypes, setObligationTypes] = useState([]);
  const [form, setForm] = useState(normalizeObligationForm(obligation));

  useEffect(() => {
    setForm(normalizeObligationForm(obligation));
  }, [obligation]);

  useEffect(() => {
    const loadObligationTypes = async () => {
      try {
        const data = await getObligationTypes();
        setObligationTypes(data);
      } catch (error) {
        console.error('Error loading obligation types:', error);
        toast.error('Error loading obligation types');
      }
    };

    loadObligationTypes();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Obligation</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obligation Type *
            </label>
            <select
              name="obligation_type"
              id="obligation_type"
              value={form.obligation_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              required
            >
              <option value="">Select Type</option>
              {obligationTypes
                .filter((type) => type.name === 'tax' || type.name === 'fee' || type.name === 'insurance')
                .map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                  </option>
                ))}
            </select>
          </div>
<label className="block text-sm font-medium text-gray-700 mb-2">
              Entity name
            </label>
          <input
            name="entity_name"
            value={form.entity_name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
            placeholder="Entity"
            required
          />
<label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
            placeholder="Amount"
            required
          />
<label className="block text-sm font-medium text-gray-700 mb-2">
              Due date
            </label>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Periodicity *
          </label>
          <select
            name="temporality"
            id="temporality"
            value={form.temporality}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
            required
          >
            <option value="">Select Periodicity</option>
            <option value="monthly">Monthly</option>
            <option value="bimonthly">Bimonthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
            <option value="one_time">One Time</option>
            <option value="weekly">Weekly</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ObligationEditModal;
