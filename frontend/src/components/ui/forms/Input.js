import React, { forwardRef } from 'react';


const inputSizes = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-2.5 text-lg',
};

const inputVariants = {
  outline: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500',
  unstyled: 'border-transparent focus:ring-0 focus:border-transparent',
};

function ErrorMessage({ children }) {
  if (!children) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600">
      {children}
    </p>
  );
}

function Label({ children, htmlFor, required }) {
  if (!children) return null;

  return (
    <label 
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

const Input = forwardRef(function Input({
  id,
  name,
  type = 'text',
  label,
  error,
  size = 'md',
  variant = 'outline',
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) {
  const sizeClasses = inputSizes[size] || inputSizes.md;
  const variantClasses = inputVariants[variant] || inputVariants.outline;

  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          block w-full rounded-lg border
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${sizeClasses}
          ${variantClasses}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <ErrorMessage id={`${id}-error`}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
});

// Add display names for debugging
Input.displayName = 'Input';
ErrorMessage.displayName = 'ErrorMessage';
Label.displayName = 'Label';

export default Input; 