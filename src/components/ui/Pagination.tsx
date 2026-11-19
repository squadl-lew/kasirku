interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPage,
  onPageChange,
}: PaginationProps) {
  if (totalPage <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPage; i++) {
    pages.push(i);
  }

  const buttonClass = (active: boolean) =>
    `rounded-lg px-3 py-1 text-sm font-medium ${
      active
        ? "bg-green-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800"
    }`;

  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-neutral-800"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={buttonClass(page === currentPage)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage >= totalPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-neutral-800"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}
