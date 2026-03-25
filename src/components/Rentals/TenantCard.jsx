import React from "react";

const TenantCard = ({ tenant, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {tenant.name} {tenant.lastname}
          </h3>
          {tenant.email && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              {tenant.email}
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${tenant.email}`}
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
            </p>
          )}
          {tenant.phone1 && (
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              {tenant.phone1}
              <a
                href={`https://wa.me/${tenant.phone1}`}
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
              <a href={`sms:${tenant.phone1}`} title="SMS">
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
              <a href={`tel:${tenant.phone1}`} title="Call">
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
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(tenant)}
            className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-2 text-sm font-medium"
          >
            Edit
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
