import React, { memo } from 'react';

const TableHeader = memo(({ 
  columns,
  className = '',
  headerClassName = '',
  cellClassName = ''
}) => (
  <thead className={className}>
    <tr className={`bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 ${headerClassName}`}>
      {columns.map(({ key, label, align = 'left', width }) => (
        <th
          key={key}
          scope="col"
          className={`px-3 py-2.5 text-${align} text-sm font-semibold text-white/90 uppercase tracking-wider ${
            width ? `w-${width}` : ''
          } ${cellClassName}`}
        >
          {label}
        </th>
      ))}
    </tr>
  </thead>
));

TableHeader.displayName = 'TableHeader';

export default TableHeader; 