import type { Restock } from "../../../types/Restock";
import { formatCurrency, formatDate } from "../../../utils/format";

export default function RestockList({ restocks }: { restocks: Restock[] }) {
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
          className="rounded-xl border border-[#d8e5d8] p-4 dark:border-neutral-800"
        >
          <p className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">
            {formatDate(restock.date)}
            {restock.note ? (
              <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
                · {restock.note}
              </span>
            ) : null}
          </p>
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
          <div className="mt-2 flex justify-between border-t border-[#d8e5d8] pt-2 text-sm font-bold text-gray-800 dark:border-neutral-800 dark:text-gray-100">
            <span>Total Belanja</span>
            <span>{formatCurrency(restock.totalAmount)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
