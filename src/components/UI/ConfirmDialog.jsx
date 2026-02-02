import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', isDanger = false }) => {
  console.log('🟢 ConfirmDialog render - isOpen:', isOpen);
  console.log('🟢 ConfirmDialog - onCancel:', onCancel);
  console.log('🟢 ConfirmDialog - onConfirm:', onConfirm);
  
  if (!isOpen) {
    console.log('🟢 ConfirmDialog - No se renderiza (isOpen es false)');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              console.log('🔵 Click en botón Cancelar');
              onCancel();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              console.log('🔵 Click en botón Confirmar');
              onConfirm();
            }}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
