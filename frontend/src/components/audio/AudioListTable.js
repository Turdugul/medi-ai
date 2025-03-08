import React, { memo } from 'react';
import { TableHeader, TableRow } from '../common/Table';
import Pagination from '../common/Pagination';

const TABLE_COLUMNS = [
  { key: 'createdDate', label: 'Date', align: 'left' },
  { key: 'createdTime', label: 'Time', align: 'left' },
  { key: 'patientId', label: 'Patient ID', align: 'left' },
  { key: 'title', label: 'Title', align: 'left' },
  { key: '_id', label: 'Record ID', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right', width: '40' }
];

const AudioListTable = memo(({
  paginatedRecords,
  totalPages,
  currentPage,
  onPageChange,
  renderRowActions
}) => (
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table className="w-full">
      <TableHeader columns={TABLE_COLUMNS} />
      <tbody>
        {paginatedRecords.map((record) => (
          <TableRow
            key={record._id}
            data={record}
            columns={TABLE_COLUMNS.slice(0, -1)}
            actions={renderRowActions(record)}
          />
        ))}
      </tbody>
    </table>
    {totalPages > 1 && (
      <div className="p-4 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    )}
  </div>
));

AudioListTable.displayName = 'AudioListTable';

export { TABLE_COLUMNS };
export default AudioListTable; 