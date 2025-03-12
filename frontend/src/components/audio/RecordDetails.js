import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaUserAlt, FaCalendar, FaClock, FaFileAlt, FaMicrophone, FaTimes } from 'react-icons/fa';

const RecordDetails = memo(({ record, onClose }) => {
  // Add effect to handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!record) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] overflow-hidden bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl animate-scale"
          onClick={e => e.stopPropagation()}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              {record.title || 'Untitled Record'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {/* Patient Info and Date */}
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <FaUserAlt className="w-4 h-4" />
                <span>Patient ID: {record.patientId || 'No Patient ID'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="w-4 h-4" />
                <span>{record.createdDate || 'Date not available'}</span>
              </div>
            </div>    

            {/* Report Content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <FaFileAlt className="w-4 h-4" />
                <h3 className="text-lg font-semibold">Report</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
                  {record.formattedReport || 'No report available'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

RecordDetails.displayName = 'RecordDetails';

export default RecordDetails; 