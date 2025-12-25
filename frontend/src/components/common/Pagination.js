import React from 'react';

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        range.push(i);
      }
    }
    
    // Add ellipsis
    const withEllipsis = [];
    let prev = 0;
    
    for (const i of range) {
      if (prev && i - prev === 2) {
        withEllipsis.push(prev + 1);
      } else if (i - prev > 2) {
        withEllipsis.push('...');
      }
      withEllipsis.push(i);
      prev = i;
    }
    
    return withEllipsis;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-sm font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Previous
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-md text-sm font-medium
            ${page === currentPage 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
            }
            ${page === '...' ? 'cursor-default' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-sm font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </nav>
  );
}

Pagination.displayName = 'Pagination';

export default Pagination; 