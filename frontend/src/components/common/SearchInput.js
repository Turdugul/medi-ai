import React, { memo } from 'react';
import { FaTimes } from 'react-icons/fa';

const SearchInput = memo(({ 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  onClear, 
  type = 'text',
  className = '',
  inputClassName = '',
  iconClassName = '',
  clearButtonClassName = ''
}) => (
  <div className={`group relative transform transition-all duration-300 hover:scale-[1.02] animate-fade-in-left ${className}`}>
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className={`text-gray-400 group-hover:text-blue-500 transition-colors duration-300 ${iconClassName}`} />
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        onChange(e);
        // If the input is cleared manually, trigger onClear
        if (newValue === '' && onClear) {
          onClear();
        }
      }}
      className={`w-full py-2.5 pl-12 pr-12 bg-white border border-gray-200 rounded-lg 
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
        transition-all duration-300 placeholder-gray-400 
        ${value ? 'text-gray-900' : 'text-gray-600'} 
        ${inputClassName}`}
    />
    {value && onClear && (
      <button
        onClick={onClear}
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 
          transition-all duration-300 p-1 rounded-full hover:bg-gray-100 
          transform hover:scale-110 active:scale-95 ${clearButtonClassName}`}
        aria-label="Clear search"
        title="Clear search"
      >
        <FaTimes />
      </button>
    )}
  </div>
));

SearchInput.displayName = 'SearchInput';

export default SearchInput; 