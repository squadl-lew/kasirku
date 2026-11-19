import type { DailyReport } from "../../../types/Report";
import { formatCurrency } from "../../../utils/format";

export default function DailyChart({ daily }: { daily: DailyReport[] }) {
  const max = Math.max(
    1,
    ...daily.flatMap((d) => [d.totalIncome, d.totalExpense]),
  );
  return (
    <div className="flex items-end gap-2" style={{ height: 160 }}>
      {daily.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-32 w-full items-end justify-center gap-1">
            <div
              className="w-4 rounded-t bg-green-500"
              style={{ height: `${(d.totalIncome / max) * 100}%` }}
              title={`Pendapatan ${formatCurrency(d.totalIncome)}`}
            />
            <div
              className="w-4 rounded-t bg-red-400"
              style={{ height: `${(d.totalExpense / max) * 100}%` }}
              title={`Pengeluaran ${formatCurrency(d.totalExpense)}`}
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {d.date.slice(5).split("-").reverse().join("/")}
          </span>
        </div>
      ))}
    </div>
  );
}
