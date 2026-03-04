import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Reusable Pagination component with dark mode support
 */
const Pagination = ({
  page,
  totalPages,
  total,
  onPageChange,
  labels = {},
}) => {
  const prevLabel = labels.previous || 'Précédent';
  const nextLabel = labels.next || 'Suivant';
  const ofLabel = labels.of || 'sur';
  const pageLabel = labels.page || 'Page';

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {pageLabel} {page} {ofLabel} {totalPages}
        {total !== undefined && (
          <span className="ml-1">({total} résultats)</span>
        )}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label={prevLabel}
        >
          <FaChevronLeft size={12} />
          {prevLabel}
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label={nextLabel}
        >
          {nextLabel}
          <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
