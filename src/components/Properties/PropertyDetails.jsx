import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyDetails = ({ property, onEdit, onDelete }) => {
  const [showInventory, setShowInventory] = useState(false);
  const [showRepairs, setShowRepairs] = useState(false);
  const [showLaws, setShowLaws] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-6 rounded-t-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.name}</h1>
        <p className="flex items-center gap-2 text-blue-100">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.address}</span>
        </p>
        {/* Action buttons in header */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Link 
            to={`/property/${property.id}/add-repair`}
            className="bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir Reparación
          </Link>
          <Link 
            to={`/property/${property.id}/add-enser`}
            className="bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir Enser
          </Link>
          <Link 
            to={`/property/${property.id}/add-law`}
            className="bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir Documentacion
          </Link>
          <Link 
            to={`/property/${property.id}/upload-media`}
            className="bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Subir Archivos
          </Link>
          <Link 
            to={`/property/${property.id}/laws`}
            className="bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Documentos
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Información General */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tipo de Uso</div>
            <div className="text-xl font-semibold text-gray-900">{property.use || 'No especificado'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tipo de Edificio</div>
            <div className="text-xl font-semibold text-gray-900">{property.type_building || 'No especificado'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ubicación</div>
            <div className="text-xl font-semibold text-gray-900">{property.ubication || 'No especificado'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ciudad</div>
            <div className="text-xl font-semibold text-gray-900">{property.city || 'No especificado'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Código Postal</div>
            <div className="text-xl font-semibold text-gray-900">{property.zip_code || 'No especificado'}</div>
          </div>
        </div>

        {/* Detalles de la Propiedad */}
        {property.details && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles de la Propiedad</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.details.bedrooms !== null && property.details.bedrooms !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Habitaciones</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.bedrooms}</div>
                </div>
              )}
              {property.details.bathrooms !== null && property.details.bathrooms !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Baños</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.bathrooms}</div>
                </div>
              )}
              {property.details.floors !== null && property.details.floors !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Pisos</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.floors}</div>
                </div>
              )}
              {property.details.buildings !== null && property.details.buildings !== undefined && (
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm font-medium text-blue-600 mb-1">Edificios</div>
                  <div className="text-3xl font-bold text-blue-700">{property.details.buildings}</div>
                </div>
              )}
            </div>
            {property.details.observations && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-4 rounded">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <strong className="text-blue-900">Observaciones:</strong>
                    <p className="text-blue-800 mt-1">{property.details.observations}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reparaciones */}
        {property.repairs && property.repairs.length > 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowRepairs(!showRepairs)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Reparaciones ({property.repairs.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showRepairs ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showRepairs && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {property.repairs.map((repair, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {repair.description || 'Reparación'}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            ${parseFloat(repair.cost).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Fecha:</span> {new Date(repair.date).toLocaleDateString()}
                        </p>
                        {repair.observation && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Observación:</span> {repair.observation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventario/Enseres */}
        {property.inventory && property.inventory.length > 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowInventory(!showInventory)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Inventario de Enseres ({property.inventory.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showInventory ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showInventory && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {property.inventory.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {item.enser?.name || 'Sin nombre'}
                          </h3>
                          {item.enser?.price && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                              ${parseFloat(item.enser.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {item.enser?.condition && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium text-gray-700">Estado:</span> {item.enser.condition}
                          </p>
                        )}
                        {item.url_media && (
                          <a
                            href={item.url_media}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Ver imagen
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leyes/Normativas */}
        {property.laws && property.laws.length > 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowLaws(!showLaws)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Documentos y Normativas ({property.laws.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showLaws ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showLaws && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {property.laws.map((law, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {law.entity_name || 'Entidad sin nombre'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            law.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {law.is_paid ? 'Pagado' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Número Legal:</span> {law.legal_number}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Monto:</span> ${parseFloat(law.original_amount).toLocaleString()}
                        </p>
                        {law.url && (
                          <a
                            href={law.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Ver documento
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Archivos Multimedia */}
        {property.media && property.media.length > 0 && (
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowMedia(!showMedia)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  Archivos Multimedia ({property.media.length})
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform ${
                    showMedia ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMedia && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {property.media.map((media, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Media Preview */}
                        {media.media_type === 'image' && media.url && (
                          <div className="aspect-video bg-gray-100">
                            <img
                              src={media.url}
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {media.media_type === 'video' && media.url && (
                          <div className="aspect-video bg-gray-100">
                            <video
                              src={media.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {media.media_type === 'document' && (
                          <div className="aspect-video bg-gray-100 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Media Info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              media.media_type === 'image' ? 'bg-blue-100 text-blue-800' :
                              media.media_type === 'video' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {media.media_type === 'image' ? 'Imagen' :
                               media.media_type === 'video' ? 'Video' : 'Documento'}
                            </span>
                          </div>
                          {media.url && (
                            <a
                              href={media.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Abrir en nueva pestaña
                            </a>
                          )}
                          {media.uploaded_at && (
                            <p className="text-xs text-gray-500 mt-2">
                              Subido: {new Date(media.uploaded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Fecha de creación:</span> {new Date(property.created_at).toLocaleString()}
            </div>
            {property.updated_at && (
              <div>
                <span className="font-medium text-gray-700">Última actualización:</span> {new Date(property.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
