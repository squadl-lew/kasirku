import type { Expense } from "../../../types/Expense";
import type { Restock } from "../../../types/Restock";
import { formatCurrency, formatDate } from "../../../utils/format";

interface ExpenseDetailProps {
  expense: Expense;
  restock?: Restock | null;
  onClose: () => void;
}

export default function ExpenseDetail({
  expense,
  restock,
  onClose,
}: ExpenseDetailProps) {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium text-gray-800 dark:text-gray-100">
        {expense.title}
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        {formatDate(expense.date)} · {expense.category}
      </p>

      {restock ? (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#d8e5d8] text-gray-500 dark:border-neutral-800 dark:text-gray-400">
              <th className="py-2 pr-2 font-medium">Produk</th>
              <th className="py-2 pr-2 font-medium">Jumlah</th>
              <th className="py-2 pr-2 font-medium">Harga Beli</th>
              <th className="py-2 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {restock.items.map((item) => (
              <tr
                key={item.productId}
                className="border-b border-[#d8e5d8] last:border-0 dark:border-neutral-800"
              >
                <td className="py-2 pr-2">{item.productName}</td>
                <td className="py-2 pr-2">x{item.quantity}</td>
                <td className="py-2 pr-2">{formatCurrency(item.buyPrice)}</td>
                <td className="py-2">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          Pengeluaran ini tidak punya rincian item — ini pengeluaran umum,
          bukan restok.
        </p>
      )}

      <p className="flex justify-between border-t border-[#d8e5d8] pt-3 font-bold text-gray-800 dark:border-neutral-800 dark:text-gray-100">
        <span>Total pengeluaran</span>
        <span>− {formatCurrency(expense.amount)}</span>
      </p>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
