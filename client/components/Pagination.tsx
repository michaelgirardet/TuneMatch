'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return pages;
    }

    const start = Math.max(
      Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1),
      1
    );
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    const visiblePages = pages.slice(start - 1, end);

    if (start > 1) {
      visiblePages.unshift(-1); // Add ellipsis at the start
      visiblePages.unshift(1); // Always show first page
    }
    if (end < totalPages) {
      visiblePages.push(-1); // Add ellipsis at the end
      visiblePages.push(totalPages); // Always show last page
    }

    return visiblePages;
  };

  return (
    <div className="join flex justify-center gap-3 font-montserrat font-semibold text-md">
      <button
        type="button"
        className="join-item text-2xl btn text-white"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>

      {getVisiblePages().map((page) =>
        page === -1 ? (
          <button
            type="button"
            key={`ellipsis-${currentPage}-${page}`}
            className="join-item btn"
            disabled
          >
            ...
          </button>
        ) : (
          <button
            type="button"
            key={page}
            className={`join-item text-white btn ${currentPage === page ? 'btn-active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className="join-item btn text-2xl text-white"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
}
