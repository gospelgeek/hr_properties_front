import React from "react";
import { Link } from "react-router-dom";
import casaImg from "../../assets/casa.png";
const PropertyCard = ({
  property,
  rental = [],
  onDelete,
  showRestoreButton = false,
  onRestore,
  isPublic = false,
}) => {
  const isActive = showRestoreButton ? false : property.is_deleted !== null;
  const getUseBadge = () => {
    const useValue = String(property.use || "").toLowerCase();

    if (useValue === "rental") {
      return { text: "Rental", color: "bg-indigo-100 text-indigo-800" };
    }

    if (useValue === "personal") {
      return { text: "Personal", color: "bg-emerald-100 text-emerald-800" };
    }

    if (useValue === "commercial") {
      return { text: "Commercial", color: "bg-amber-100 text-amber-800" };
    }
    if (useValue === "commercial" && property.use === "rental") {
      return { text: "Commercial Rental", color: "bg-pink-100 text-pink-800" };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Property Image */}

      <div className="aspect-[5/2] bg-gray-100 overflow-hidden">
        <img
          src={property.image_url ? property.image_url : casaImg}
          alt={property.name || property.address}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML =
              '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>';
          }}
        />
      </div>

      <div className="p-5 sm:p-6  flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1 min-w-0">
            {property.name || property.address}
          </h2>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getUseBadge().color}`}
          >
            {getUseBadge().text}
          </span>
        </div>

        {property.address && (
          <p className="text-gray-600 text-sm flex items-start gap-2 mb-4">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="flex-1">
              {property.address + ", " + property.city + ", " + property.state}
            </span>
          </p>
        )}

        {/* Quick Info */}
        {property.details && (
          <div className="flex flex-wrap gap-4 mb-5">
            {property.details.bedrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-medium">
                  {property.details.bedrooms}{" "}
                  {property.use === "commercial" ? "rooms" : "bed"}
                </span>
              </div>
            )}
            {property.details.bathrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 11h6v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z"
                  />
                </svg>
                <span className="font-medium">
                  {property.details.bathrooms} bath
                </span>
              </div>
            )}
            {property.details.half_bathrooms > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 11h6v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z"
                  />
                </svg>
                <span className="font-medium">
                  {property.details.half_bathrooms} half bath
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col flex-1 gap-2 pt-5 border-t border-gray-300 mt-5">
          {isPublic ? (
            <>
              <Link
                to={`/public-properties/${property.id}`}
                className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium px-4 py-2.5 text-sm"
              >
                View Details
              </Link>
              <button className="flex-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium px-4 py-2.5 text-sm flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Us
              </button>
            </>
          ) : showRestoreButton ? (
            <>
              <Link
                to={`/property/${property.id}`}
                className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium px-4 py-2.5 text-sm"
              >
                View Details
              </Link>
              <button
                onClick={() => onRestore(property.id)}
                className="flex-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium px-4 py-2.5 text-sm"
              >
                Restore
              </button>
            </>
          ) : (
            <div className="flex flex-col flex-1 w-full max-h-full">
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  
                  {rental.length === 0 && property.use !== "personal" ? (
                    <h3 className="text-base font-semibold text-gray-600">
                      Available
                    </h3>
                  ) : property.use === "personal" ? (
                    <h3 className="text-base font-semibold text-gray-600">
                      Personal Use
                    </h3>
                  ) : property.use === 'rental' ? (
                    <h3 className="text-base font-semibold text-gray-600">
                      Rented and no tenant information available
                    </h3>
                  ) : (
                    <div className=" mb-2 ">
                      <div className="flex items-center gap-3 pb-2">
                        <span className="text-base font-semibold text-gray-600">
                          Tenant: {rental[0].tenant.name}
                        </span>
                        {/* Correo */}
                        {rental[0].tenant.email ?(
                          <a
                            href={`https://mail.google.com/mail/?view=cm&to=${rental[0].tenant.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Email"
                          >
                            <svg
                              className="w-5 h-5 text-blue-500 hover:text-blue-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M22 6l-10 7L2 6"
                              />
                            </svg>
                          </a>
                        ):(
                          <span className="text-gray-400 italic text-sm">No email</span>
                        )}
                        {/* WhatsApp */}
                        {rental[0].tenant.phone1 && (
                          <a
                            href={`https://wa.me/${rental[0].tenant.phone1}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                          >
                            <svg
                              className="w-5 h-5 text-green-500 hover:text-green-700"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.67 6.13L0 24l6.26-1.64A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.93 9.93 0 01-5.3-1.53l-.38-.23-3.72.98.99-3.62-.25-.37A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01s-.5.07-.76.36c-.26.29-1 1.01-1 2.47 0 1.46 1.04 2.88 1.19 3.08.15.2 2.05 3.13 5.01 4.27.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.09 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z" />
                            </svg>
                          </a>
                        )}
                        {/* SMS */}
                        {rental[0].tenant.phone1 && (
                          <a
                            href={`sms:${rental[0].tenant.phone1}`}
                            title="SMS"
                          >
                            <svg
                              className="w-5 h-5 text-yellow-500 hover:text-yellow-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                              />
                            </svg>
                          </a>
                        )}
                        {/* Teléfono */}
                        {rental[0].tenant.phone1 && (
                          <a
                            href={`tel:${rental[0].tenant.phone1}`}
                            title="Call"
                          >
                            <svg
                              className="w-5 h-5 text-red-500 hover:text-red-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-1">
                        <span className="flex items-center mr-3">
                          {/* Icono de check-in (puerta de entrada) */}
                          <svg
                            className="w-4 h-4 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 21V7a2 2 0 012-2h6a2 2 0 012 2v14"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 17l2 2 2-2"
                            />
                          </svg>
                          {rental[0].check_in}
                        </span>
                        <span className="flex items-center">
                          {/* Icono de check-out (puerta de salida) */}
                          <svg
                            className="w-4 h-4 mr-1 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 17l-2-2 2-2"
                            />
                          </svg>
                          {rental[0].check_out}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-gray-600 pb-2">
                        Amount: {rental[0].amount}
                      </h2>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Link
                  to={`/property/${property.id}`}
                  className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium px-4 py-2.5 text-sm mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
