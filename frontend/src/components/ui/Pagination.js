import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Constants for pagination
const DOTS = '...';

// Helper function to generate page range
function generatePageRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
}

// Helper function to calculate pagination range
function getPaginationRange(currentPage, totalPages, maxPages = 7) {
  if (totalPages <= maxPages) {
    return generatePageRange(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - 1, 1);
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = generatePageRange(1, 5);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRange = generatePageRange(totalPages - 4, totalPages);
    return [1, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = generatePageRange(leftSiblingIndex, rightSiblingIndex);
    return [1, DOTS, ...middleRange, DOTS, totalPages];
  }

  return generatePageRange(1, totalPages);
}

function PageButton({ children, isActive, disabled, onClick, className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-200';
  const activeStyles = isActive
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'text-gray-700 hover:bg-gray-100';
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${activeStyles} ${disabledStyles} ${className}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );
}

function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }

  const paginationRange = getPaginationRange(currentPage, totalPages);

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center justify-center space-x-2 ${className}`}
    >
      <PageButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        <FaChevronLeft className="w-5 h-5" />
        <span className="sr-only">Previous page</span>
      </PageButton>

      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === DOTS) {
          return (
            <span
              key={`dots-${idx}`}
              className="px-3 py-2 text-gray-500"
            >
              {DOTS}
            </span>
          );
        }

        return (
          <PageButton
            key={pageNumber}
            isActive={pageNumber === currentPage}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <FaChevronRight className="w-5 h-5" />
        <span className="sr-only">Next page</span>
      </PageButton>
    </nav>
  );
}

PageButton.displayName = 'PageButton';
Pagination.displayName = 'Pagination';

export default Pagination; 