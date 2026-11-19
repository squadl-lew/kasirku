interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  // Untuk teks "Menampilkan X–Y dari Z produk" (ala prototype)
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
}

export default function Pagination({
  currentPage,
  totalPage,
  onPageChange,
  totalItems,
  pageSize = 10,
  itemLabel = "item",
}: PaginationProps) {
  const from =
    totalItems === undefined || totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;
  const to =
    totalItems === undefined
      ? 0
      : Math.min(currentPage * pageSize, totalItems);

  if (totalPage <= 1 && totalItems === undefined) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPage; i++) {
    pages.push(i);
  }

  const buttonClass = (active: boolean) =>
    `rounded-lg px-3 py-1 text-sm font-medium ${
      active
        ? "bg-green-600 text-white"
        : "bg-white text-gray-600 hover:bg-[#edf4ed] dark:bg-[#1a1b1d] dark:text-gray-300 dark:hover:bg-neutral-800"
    }`;

  return (
    <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
      {totalItems !== undefined && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {from}–{to} dari {totalItems} {itemLabel}
        </p>
      )}
      {totalPage > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-[#edf4ed] disabled:opacity-40 dark:text-gray-300 dark:hover:bg-neutral-800"
          >
            ‹ Sebelumnya
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
            className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 hover:bg-[#edf4ed] disabled:opacity-40 dark:text-gray-300 dark:hover:bg-neutral-800"
          >
            Berikutnya ›
          </button>
        </div>
      )}
    </div>
  );
}
