import type { Restock } from "../../../types/Restock";
import { formatCurrency, formatDate } from "../../../utils/format";

interface RestockListProps {
  restocks: Restock[];
  onDelete: (restock: Restock) => void;
}

export default function RestockList({ restocks, onDelete }: RestockListProps) {
  if (restocks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum ada riwayat restok.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {restocks.map((restock) => (
        <li
          key={restock.id}
          className="rounded-xl border border-gray-200 p-4 dark:border-neutral-800"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {formatDate(restock.createdAt)}
            </p>
            <button
              type="button"
              onClick={() => onDelete(restock)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Batalkan
            </button>
          </div>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {restock.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span>
                  {item.productName} x {item.quantity} @{" "}
                  {formatCurrency(item.buyPrice)}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-gray-800 dark:border-neutral-800 dark:text-gray-100">
            <span>Total Belanja</span>
            <span>{formatCurrency(restock.totalAmount)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
