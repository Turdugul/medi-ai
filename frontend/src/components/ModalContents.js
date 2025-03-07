import React, { memo } from 'react';
import { FaSpinner, FaTrash } from 'react-icons/fa';

// Loading Content
export const LoadingContent = memo(() => (
  <div className="flex justify-center items-center py-8">
    <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
));

// Error Content
export const ErrorContent = memo(({ message = 'Not found.' }) => (
  <div className="text-center py-8">
    <p className="text-gray-600 animate-fade-in">{message}</p>
  </div>
));

// Confirmation Dialog Content
export const ConfirmationContent = memo(({ 
  title,
  message,
  icon: Icon,
  iconBgColor = 'bg-red-100',
  iconColor = 'text-red-600',
  details,
  primaryAction,
  secondaryAction,
  primaryLabel = 'Confirm',
  secondaryLabel = 'Cancel',
  primaryVariant = 'danger'
}) => (
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-4">
      <div className={`p-3 ${iconBgColor} rounded-full`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>

    {details && (
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        {Object.entries(details).map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    )}

    <div className="flex justify-end gap-3">
      {secondaryAction && (
        <button
          onClick={secondaryAction}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
            rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {secondaryLabel}
        </button>
      )}
      {primaryAction && (
        <button
          onClick={primaryAction}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md 
            focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-all duration-200
            ${primaryVariant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
              primaryVariant === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
        >
          {primaryLabel}
        </button>
      )}
    </div>
  </div>
));

// Form Content
export const FormContent = memo(({ 
  title,
  children,
  primaryAction,
  secondaryAction,
  primaryLabel = 'Save',
  secondaryLabel = 'Cancel',
  isSubmitting = false
}) => (
  <div className="p-6">
    {title && (
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
    )}
    <div className="space-y-6">
      {children}
      <div className="flex justify-end gap-3">
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
              rounded-md hover:bg-gray-50"
          >
            {secondaryLabel}
          </button>
        )}
        {primaryAction && (
          <button
            onClick={primaryAction}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md 
              hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : primaryLabel}
          </button>
        )}
      </div>
    </div>
  </div>
)); 