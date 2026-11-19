import type { Expense } from "../../../types/Expense";
import { formatCurrency, formatDate } from "../../../utils/format";

interface ExpenseListProps {
  expenses: Expense[];
  onDetail: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseList({
  expenses,
  onDetail,
  onDelete,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum ada pengeluaran.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-[#d8e5d8] p-4 dark:border-neutral-800"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
              {expense.title}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formatDate(expense.date)}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                expense.category === "Belanja Stok"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-[#edf4ed] text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
              }`}
            >
              {expense.category}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">
              − {formatCurrency(expense.amount)}
            </span>
            <button
              type="button"
              onClick={() => onDetail(expense)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
            >
              Lihat rincian
            </button>
            <button
              type="button"
              onClick={() => onDelete(expense)}
              aria-label="Hapus pengeluaran"
              className="rounded-lg px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
