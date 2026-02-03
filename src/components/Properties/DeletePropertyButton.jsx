import React, { useState } from 'react';
import ConfirmDialog from '../UI/ConfirmDialog';

const DeletePropertyButton = ({ propertyId, onDelete, buttonText = 'Delete Property' }) => {
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
        title="Delete Property"
        message="Are you sure you want to delete this property? This action can be undone from the deleted properties section."
        onConfirm={handleConfirm}
        onCancel={() => setShowDialog(false)}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
};

export default DeletePropertyButton;
