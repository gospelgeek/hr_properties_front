import React from 'react';
import RepairCard from './RepairCard';

const RepairList = ({ repairs, onDelete }) => {
  if (repairs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60 text-lg">No hay reparaciones registradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repairs.map((repair) => (
        <RepairCard
          key={repair.id}
          repair={repair}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default RepairList;
