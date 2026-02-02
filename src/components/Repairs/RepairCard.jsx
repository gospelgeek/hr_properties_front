import React from 'react';
import { Link } from 'react-router-dom';

const RepairCard = ({ repair, onDelete }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3 className="card-title">{repair.description || 'Reparación'}</h3>
          <div className="badge badge-primary">${parseFloat(repair.cost).toLocaleString()}</div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-base-content/70">
            <span className="font-semibold">Fecha:</span> {new Date(repair.date).toLocaleDateString()}
          </p>
          {repair.observation && (
            <p className="text-base-content/70">
              <span className="font-semibold">Observación:</span> {repair.observation}
            </p>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <Link 
            to={`/repairs/${repair.id}`}
            className="btn btn-sm btn-primary"
          >
            Ver Detalles
          </Link>
          <Link 
            to={`/repairs/edit/${repair.id}`}
            className="btn btn-sm btn-outline btn-primary"
          >
            Editar
          </Link>
          <button 
            onClick={() => onDelete(repair.id)}
            className="btn btn-sm btn-error"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepairCard;
