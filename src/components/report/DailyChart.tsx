import type { DailyReport } from "../../../types/Report";
import {
  formatCurrency,
  formatShortCurrency,
  formatWeekdayShort,
  todayISO,
} from "../../../utils/format";

// Grafik batang 7 hari ala prototype: label nama hari + nilai + penanda hari ini
export default function DailyChart({ daily }: { daily: DailyReport[] }) {
  const max = Math.max(
    1,
    ...daily.flatMap((d) => [d.totalIncome, d.totalExpense]),
  );
  const today = todayISO();

  return (
    <div className="flex items-end gap-2" style={{ height: 160 }}>
      {daily.map((d) => {
        const isToday = d.date === today;
        return (
          <div
            key={d.date}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span
              className={`text-[11px] font-medium ${
                isToday
                  ? "text-green-700 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatShortCurrency(d.totalIncome)}
            </span>
            <div className="flex h-28 w-full items-end justify-center gap-1">
              <div
                className={`w-4 rounded-t ${
                  isToday ? "bg-green-600" : "bg-green-500"
                }`}
                style={{ height: `${(d.totalIncome / max) * 100}%` }}
                title={`Pendapatan ${formatCurrency(d.totalIncome)}`}
              />
              <div
                className="w-4 rounded-t bg-red-400"
                style={{ height: `${(d.totalExpense / max) * 100}%` }}
                title={`Pengeluaran ${formatCurrency(d.totalExpense)}`}
              />
            </div>
            <span
              className={`text-xs ${
                isToday
                  ? "font-bold text-green-700 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatWeekdayShort(d.date)}
              {isToday ? " · ini" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
