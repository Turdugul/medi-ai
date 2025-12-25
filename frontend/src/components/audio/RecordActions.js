import React from 'react';
import { FaEye, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { downloadAudioFile } from '@/pages/api/audio';

function ActionButton({ icon: Icon, label, onClick, variant = 'default' }) {
  const baseClasses = 'p-2 rounded-full transition-colors duration-200';
  const variantClasses = {
    default: 'text-gray-600 hover:bg-gray-100',
    danger: 'text-red-600 hover:bg-red-50',
    primary: 'text-blue-600 hover:bg-blue-50',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

ActionButton.displayName = 'ActionButton';

function RecordActions({
  record,
  onViewDetails,
  onEdit,
  onDelete,
  token
}) {
  const handleDownload = async () => {
    try {
      await downloadAudioFile(record._id, token);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <ActionButton
        icon={FaEye}
        label="View Details"
        onClick={() => onViewDetails(record._id)}
        variant="primary"
      />
      <ActionButton
        icon={FaEdit}
        label="Edit Record"
        onClick={() => onEdit(record)}
        variant="primary"
      />
      <ActionButton
        icon={FaDownload}
        label="Download"
        onClick={handleDownload}
        variant="default"
      />
      <ActionButton
        icon={FaTrash}
        label="Delete Record"
        onClick={() => onDelete(record)}
        variant="danger"
      />
    </div>
  );
}

RecordActions.displayName = 'RecordActions';

export default RecordActions; 