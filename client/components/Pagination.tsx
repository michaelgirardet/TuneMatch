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
    <nav className="join text-white flex gap-5">
      <button
        type="button"
        className="btn btn-soft btn-square join-item text-white"
        aria-label="Previous Button"
      >
        <span className="icon-[tabler--chevron-left] size-5 rtl:rotate-180" />
      </button>
      <button
        type="button"
        className="btn btn-soft join-item btn-square aria-[current='page']:text-bg-soft-primary"
      >
        1
      </button>
      <button
        type="button"
        className="btn btn-soft join-item btn-square aria-[current='page']:text-bg-soft-primary"
        aria-current="page"
      >
        2
      </button>
      <button
        type="button"
        className="btn btn-soft join-item btn-square aria-[current='page']:text-bg-soft-primary"
      >
        3
      </button>
      <button type="button" className="btn btn-soft btn-square join-item" aria-label="Next Button">
        <span className="icon-[tabler--chevron-right] size-5 rtl:rotate-180" />
      </button>
    </nav>
  );
}
