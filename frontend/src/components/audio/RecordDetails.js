import React, { memo } from 'react';
import { FaUserAlt, FaCalendar } from 'react-icons/fa';

const RecordDetails = memo(({ record }) => (
  <div className="animate-scale space-y-3">
    {/* Title and Patient ID */}
    <div className="space-y-1">
      <h2 className="text-xl font-bold text-gray-800">{record.title}</h2>
      <div className="flex items-center gap-2 text-gray-600">
        <FaUserAlt className="w-3.5 h-3.5" />
        <span className="text-sm">Patient ID: {record.patientId}</span>
      </div>
    </div>

    {/* Info Cards */}
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
        <div className="flex items-center gap-1.5 text-gray-600">
          <FaCalendar className="w-3.5 h-3.5" />
          <span className="text-sm">{record.createdDate}</span>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
        <div className="flex items-center gap-1.5 text-gray-600">
          <FaCalendar className="w-3.5 h-3.5" />
          <span className="text-sm">{record.createdTime}</span>
        </div>
      </div>
    </div>

    {/* Report */}
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <pre className="p-3 whitespace-pre-wrap font-mono text-gray-700 text-sm max-h-[400px] overflow-auto">
        {record.formattedReport}
      </pre>
    </div>
  </div>
));

RecordDetails.displayName = 'RecordDetails';

export default RecordDetails; 