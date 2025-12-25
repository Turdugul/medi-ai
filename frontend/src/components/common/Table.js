import React from 'react';

export function TableHeader({ columns, showActions = false }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {column.header || column.label}
          </th>
        ))}
        {showActions && (
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}

export function TableRow({ columns, item, data, onRowClick, actions }) {
  // Support both 'item' and 'data' props for backward compatibility
  const rowData = item || data;
  
  if (!rowData) {
    return null;
  }
  
  return (
    <tr
      onClick={() => onRowClick?.(rowData)}
      className="bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200"
    >
      {columns.map((column, index) => (
        <td
          key={index}
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
        >
          {column.render ? column.render(rowData) : (rowData[column.key] || '')}
        </td>
      ))}
      {actions && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
          {actions}
        </td>
      )}
    </tr>
  );
}

export function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader columns={columns} />
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <TableRow
              key={item.id || index}
              columns={columns}
              item={item}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Row Actions Menu Component
export function RowActionsMenu({ isOpen, onClose, actions = [] }) {
  if (!isOpen || !actions.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] z-50">
      {actions.map((action) => {
        const Icon = action.icon;
        const variantClasses = {
          primary: 'text-blue-600 hover:bg-blue-50',
          danger: 'text-red-600 hover:bg-red-50',
          default: 'text-gray-700 hover:bg-gray-50'
        };
        const className = variantClasses[action.variant] || variantClasses.default;

        return (
          <button
            key={action.key}
            onClick={() => {
              action.onClick?.();
              onClose?.();
            }}
            className={`w-full px-4 py-2 text-left text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${className}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Add display names for debugging
TableHeader.displayName = 'TableHeader';
TableRow.displayName = 'TableRow';
Table.displayName = 'Table';
RowActionsMenu.displayName = 'RowActionsMenu';

export default Table; 