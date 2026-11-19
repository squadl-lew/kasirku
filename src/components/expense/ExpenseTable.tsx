import type { Expense } from "../../../types/Expense";
import { formatCurrency, formatDate } from "../../../utils/format";

interface ExpenseTableProps {
  expenses: Expense[];
  onDetail: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseTable({
  expenses,
  onDetail,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum ada pengeluaran. Klik "Tambah Pengeluaran" untuk menambah.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-neutral-800 dark:text-gray-400">
            <th className="py-2 pr-2 font-medium">Tanggal</th>
            <th className="py-2 pr-2 font-medium">Judul</th>
            <th className="py-2 pr-2 font-medium">Kategori</th>
            <th className="py-2 pr-2 font-medium">Harga</th>
            <th className="py-2 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const fromRestock = expense.restockId !== undefined;
            return (
              <tr
                key={expense.id}
                className="border-b border-gray-100 last:border-0 dark:border-neutral-800"
              >
                <td className="py-3 pr-2 text-gray-600 dark:text-gray-300">
                  {formatDate(expense.date)}
                </td>
                <td className="py-3 pr-2 font-medium text-gray-800 dark:text-gray-100">
                  {expense.title}
                </td>
                <td className="py-3 pr-2 text-gray-600 dark:text-gray-300">
                  {expense.category}
                  {fromRestock && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Otomatis
                    </span>
                  )}
                </td>
                <td className="py-3 pr-2 text-gray-600 dark:text-gray-300">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onDetail(expense)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
                    >
                      Lihat rincian
                    </button>
                    {!fromRestock && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(expense)}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(expense)}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
