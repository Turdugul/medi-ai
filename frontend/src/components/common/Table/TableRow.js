import React, { memo } from 'react';

const TableRow = memo(({ 
  data,
  columns,
  actions,
  className = '',
  cellClassName = ''
}) => (
  <tr className={`hover:bg-blue-50/50 transition-colors duration-200 ${className}`}>
    {columns.map(({ key, render, align = 'left' }) => (
      <td 
        key={key} 
        className={`px-3 py-2.5 text-sm ${
          align === 'right' ? 'text-right' : 
          align === 'center' ? 'text-center' : 'text-left'
        } ${cellClassName}`}
      >
        {render ? render(data[key], data) : data[key]}
      </td>
    ))}
    {actions && (
      <td className="px-3 py-2.5 text-sm whitespace-nowrap text-right">
        {typeof actions === 'function' ? actions(data) : actions}
      </td>
    )}
  </tr>
));

TableRow.displayName = 'TableRow';

export default TableRow; 