import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

function DetailRow({ label, value, name, editable, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="col-span-2">
        {editable ? (
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <span className="text-sm text-gray-900">{value || 'N/A'}</span>
        )}
      </dd>
    </div>
  );
}

DetailRow.displayName = 'DetailRow';

function RecordDetails({ record, onSave, isEditing = false }) {
  const [formData, setFormData] = useState(record);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSave) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-1">
          <DetailRow
            label="Record ID"
            value={record._id}
            editable={false}
            onChange={handleChange}
          />
          <DetailRow
            label="Created Date"
            value={`${record.createdDate} ${record.createdTime}`}
            editable={false}
            onChange={handleChange}
          />
          <DetailRow
            label="Duration"
            value={record.duration}
            name="duration"
            editable={isEditing}
            onChange={handleChange}
          />
          <DetailRow
            label="Notes"
            value={record.notes}
            name="notes"
            editable={isEditing}
            onChange={handleChange}
          />
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

RecordDetails.displayName = 'RecordDetails';

export default RecordDetails; 