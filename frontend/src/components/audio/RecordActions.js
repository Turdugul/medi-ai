import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { FaExternalLinkAlt, FaDownload, FaEllipsisV } from 'react-icons/fa';
import { RowActionsMenu } from '../common/Table';

const ActionsModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div className="absolute inset-0" />
      {children}
    </div>,
    document.body
  );
};

const RecordActions = memo(({ 
  record, 
  token, 
  openMenuId,
  onViewDetails,
  onDownload,
  onMenuToggle,
  onMenuClose,
  getRowActions
}) => {
  // Get the button position for the menu
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
  const menuButtonRef = React.useRef(null);

  const handleMenuToggle = (recordId) => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right,
      });
    }
    onMenuToggle(recordId);
  };

  return (
    <div className="flex items-center justify-end gap-2 relative">
      <button
        onClick={() => onViewDetails(record._id)}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
        aria-label="View details"
      >
        <FaExternalLinkAlt className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDownload(record._id, token, record.filename)}
        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200"
        aria-label="Download audio"
      >
        <FaDownload className="w-4 h-4" />
      </button>
      <div className="relative">
        <button
          ref={menuButtonRef}
          onClick={() => handleMenuToggle(record._id)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          aria-label="More actions"
          aria-expanded={openMenuId === record._id}
          aria-haspopup="true"
        >
          <FaEllipsisV className="w-4 h-4" />
        </button>
        <ActionsModal isOpen={openMenuId === record._id} onClose={onMenuClose}>
          <div 
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              transform: 'translateY(-50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <RowActionsMenu
              isOpen={true}
              onClose={onMenuClose}
              actions={getRowActions(record)}
            />
          </div>
        </ActionsModal>
      </div>
    </div>
  );
});

RecordActions.displayName = 'RecordActions';

export default RecordActions; 