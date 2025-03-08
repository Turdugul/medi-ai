import React, { memo } from 'react';
import { FaExternalLinkAlt, FaDownload, FaEllipsisV } from 'react-icons/fa';
import { RowActionsMenu } from '../common/Table';

const RecordActions = memo(({ 
  record, 
  token, 
  openMenuId,
  onViewDetails,
  onDownload,
  onMenuToggle,
  onMenuClose,
  getRowActions
}) => (
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
        onClick={() => onMenuToggle(record._id)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        aria-label="More actions"
        aria-expanded={openMenuId === record._id}
        aria-haspopup="true"
      >
        <FaEllipsisV className="w-4 h-4" />
      </button>
      {openMenuId === record._id && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
          <RowActionsMenu
            isOpen={true}
            onClose={onMenuClose}
            actions={getRowActions(record)}
          />
        </div>
      )}
    </div>
  </div>
));

RecordActions.displayName = 'RecordActions';

export default RecordActions; 