import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function TableHeader({ children, className = '', ...props }) {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({ children, className = '', isHeader = false, ...props }) {
  return (
    <tr 
      className={`
        ${isHeader ? '' : 'hover:bg-gray-50'}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableCell({ 
  children, 
  className = '', 
  isHeader = false,
  align = 'left',
  ...props 
}) {
  const Component = isHeader ? 'th' : 'td';
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <Component
      className={`
        px-6 py-4 text-sm
        ${isHeader ? 'font-medium text-gray-900' : 'text-gray-500'}
        ${alignmentClasses[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

function SortIcon({ direction }) {
  if (!direction) return <FaSort className="w-4 h-4 text-gray-400" />;
  return direction === 'asc' 
    ? <FaSortUp className="w-4 h-4 text-blue-500" />
    : <FaSortDown className="w-4 h-4 text-blue-500" />;
}

function TableHeaderCell({
  children,
  sortable = false,
  sortDirection,
  onSort,
  className = '',
  align = 'left',
  ...props
}) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  function handleSort() {
    if (!sortable || !onSort) return;
    const nextDirection = !sortDirection 
      ? 'asc' 
      : sortDirection === 'asc' 
        ? 'desc' 
        : null;
    onSort(nextDirection);
  }

  return (
    <th
      className={`
        px-6 py-3 text-sm font-medium text-gray-900
        ${sortable ? 'cursor-pointer select-none' : ''}
        ${alignmentClasses[align]}
        ${className}
      `}
      onClick={sortable ? handleSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && <SortIcon direction={sortDirection} />}
      </div>
    </th>
  );
}

function Table({ 
  children, 
  className = '',
  bordered = false,
  striped = false,
  compact = false,
  ...props 
}) {
  return (
    <div className={`
      overflow-x-auto rounded-lg border border-gray-200 
      ${className}
    `}>
      <table 
        className={`
          min-w-full divide-y divide-gray-200
          ${bordered ? 'border-collapse border border-gray-200' : ''}
          ${compact ? 'table-fixed' : 'table-auto'}
        `}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// Add display names for debugging
Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableCell.displayName = 'TableCell';
TableHeaderCell.displayName = 'TableHeaderCell';
SortIcon.displayName = 'SortIcon';

// Attach sub-components to main component
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;

export default Table; 