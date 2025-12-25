import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Move debounce function outside component
function createDebouncedFunction(callback, delay) {
  let timeoutId;
  return (value) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback?.(value);
    }, delay);
  };
}

// Main component as named function
function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
  disabled = false,
  'aria-label': ariaLabel = 'Search input'
}) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    createDebouncedFunction(onChange, debounceMs),
    [onChange, debounceMs]
  );

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear button click
  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-10 py-2.5
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            rounded-lg
            text-sm text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute inset-y-0 right-0 pr-3 flex items-center
              text-gray-400 hover:text-gray-500
              transition-colors duration-200
              ${disabled ? 'hidden' : ''}
            `}
            aria-label="Clear search"
          >
            <FaTimes className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

SearchInput.displayName = 'SearchInput';

export default SearchInput; 