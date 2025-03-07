import React, { memo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '',
  buttonClassName = '',
  textClassName = ''
}) => (
  <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 ${className}`}>
    {/* Mobile view */}
    <div className="flex justify-between flex-1 sm:hidden">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 
          bg-white border border-gray-300 rounded-md hover:bg-gray-50 
          disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 
          bg-white border border-gray-300 rounded-md hover:bg-gray-50 
          disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
      >
        Next
      </button>
    </div>

    {/* Desktop view */}
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className={`text-sm text-gray-700 ${textClassName}`}>
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div>
        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md 
              border border-gray-300 bg-white hover:bg-gray-50 
              disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
            aria-label="Previous page"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md 
              border border-gray-300 bg-white hover:bg-gray-50 
              disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
            aria-label="Next page"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  </div>
));

Pagination.displayName = 'Pagination';

export default Pagination; 