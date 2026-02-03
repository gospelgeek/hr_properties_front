import React from 'react';

const TenantCard = ({ tenant, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {tenant.first_name} {tenant.last_name}
          </h3>
          {tenant.email && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {tenant.email}
            </p>
          )}
          {tenant.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {tenant.phone}
            </p>
          )}
        </div>
      </div>

      {tenant.document_number && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Documento:</span> {tenant.document_number}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(tenant)}
            className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2 text-sm font-medium"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(tenant.id)}
            className="flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors py-2 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TenantCard;
