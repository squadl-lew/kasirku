import type { Expense } from "../../../types/Expense";
import { formatCurrency, formatDate } from "../../../utils/format";

interface ExpenseDetailProps {
  expense: Expense;
}

export default function ExpenseDetail({ expense }: ExpenseDetailProps) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Judul", value: expense.title },
    { label: "Kategori", value: expense.category },
    { label: "Harga", value: formatCurrency(expense.amount) },
    { label: "Tanggal", value: formatDate(expense.date) },
    { label: "Deskripsi", value: expense.description ?? "-" },
  ];

  return (
    <div className="space-y-3 text-sm">
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">{row.label}</dt>
            <dd className="text-right font-medium text-gray-800 dark:text-gray-100">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {expense.restockId !== undefined && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
          Tercatat otomatis dari Restok — untuk membatalkan, lewat menu
          Restok.
        </p>
      )}
    </div>
  );
}
