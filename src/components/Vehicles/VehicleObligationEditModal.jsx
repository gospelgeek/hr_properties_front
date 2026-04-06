import React from 'react';
import Modal from '../UI/Modal';

const temporalityOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bimonthly', label: 'Bimonthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
  { value: 'one_time', label: 'One Time' },
];

const allowedObligationTypeNames = new Set(['tax', 'insurance']);

const sanitizePkValue = (value) => String(value ?? '').trim().replace(/^"+|"+$/g, '');

const VehicleObligationEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  form,
  obligationTypes,
  hasCurrentFile,
  onOpenCurrentFile,
  onFieldChange,
  onFileChange,
}) => {
  const normalizedTypes = (Array.isArray(obligationTypes) ? obligationTypes : []).filter((type) => {
    const typeName = String(type?.name || '').toLowerCase();
    return allowedObligationTypeNames.has(typeName);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Obligation">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Obligation Type *</label>
          <select
            value={form.obligation_type}
            onChange={(event) => onFieldChange('obligation_type', sanitizePkValue(event.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            disabled={isSubmitting}
          >
            <option value="">Select type...</option>
            {normalizedTypes.map((type) => (
              <option key={type.id} value={sanitizePkValue(type.id)}>
                {String(type.name || '').charAt(0).toUpperCase() + String(type.name || '').slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entity *</label>
          <input
            value={form.entity_name}
            onChange={(event) => onFieldChange('entity_name', event.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            placeholder="Sura"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(event) => onFieldChange('amount', event.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            placeholder="2300000.00"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(event) => onFieldChange('due_date', event.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Periodicity *</label>
          <select
            value={form.temporality}
            onChange={(event) => onFieldChange('temporality', event.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            disabled={isSubmitting}
          >
            {temporalityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">File (optional)</label>
          {hasCurrentFile && (
            <button
              type="button"
              onClick={onOpenCurrentFile}
              className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
              disabled={isSubmitting}
            >
              View current file
            </button>
          )}
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty to keep current file.</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Update Obligation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleObligationEditModal;
