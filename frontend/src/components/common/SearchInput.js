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
      onChange={onChange}
      className={`input pl-12 pr-12 transition-all duration-300 focus:ring-offset-2 focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
    />
    {value && onClear && (
      <button
        onClick={onClear}
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 
          transition-all duration-300 p-1 rounded-full hover:bg-gray-100 
          transform hover:scale-110 active:scale-95 ${clearButtonClassName}`}
        aria-label="Clear input"
      >
        <FaTimes />
      </button>
    )}
  </div>
));

SearchInput.displayName = 'SearchInput';

export default SearchInput; 