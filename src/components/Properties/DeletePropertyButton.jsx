import React, { useState } from 'react';
import ConfirmDialog from '../UI/ConfirmDialog';

const DeletePropertyButton = ({ propertyId, onDelete, buttonText = 'Eliminar Propiedad' }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    onDelete(propertyId);
    setShowDialog(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex-1 sm:flex-none bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
      >
        {buttonText}
      </button>

      <ConfirmDialog
        isOpen={showDialog}
        title="Eliminar Propiedad"
        message="¿Estás seguro de que deseas eliminar esta propiedad? Esta acción se puede revertir desde la sección de propiedades eliminadas."
        onConfirm={handleConfirm}
        onCancel={() => setShowDialog(false)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDanger={true}
      />
    </>
  );
};

export default DeletePropertyButton;
