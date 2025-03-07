import React, { memo, useRef, useEffect } from 'react';

const RowActionsMenu = memo(({ 
  isOpen, 
  onClose, 
  actions,
  className = '',
  menuClassName = '',
  itemClassName = ''
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className}`}
    >
      <div className={`py-1 ${menuClassName}`} role="menu" aria-orientation="vertical">
        {actions.map(({ key, label, icon: Icon, onClick, variant = 'default' }) => (
          <button
            key={key}
            onClick={() => {
              onClick();
              onClose();
            }}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              variant === 'danger' ? 'text-red-600' : 'text-gray-700'
            } hover:bg-gray-100 ${itemClassName}`}
            role="menuitem"
          >
            {Icon && <Icon className={`mr-3 ${
              variant === 'danger' ? 'text-red-500' :
              variant === 'success' ? 'text-green-500' :
              variant === 'primary' ? 'text-blue-500' :
              'text-gray-400'
            }`} />}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

RowActionsMenu.displayName = 'RowActionsMenu';

export default RowActionsMenu; 