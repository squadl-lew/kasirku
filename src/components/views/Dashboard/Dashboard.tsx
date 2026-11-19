import { Link } from "react-router";
import { useDashboard } from "./useDashboard.tsx";
import DailyChart from "../../report/DailyChart.tsx";
import { formatCurrency, formatDate } from "../../../../utils/format";

export default function Dashboard() {
  const { todayIncome, monthExpense, lowStock, weekDaily, recent } =
    useDashboard();

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Penjualan hari ini
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(todayIncome)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pengeluaran bulan ini
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(monthExpense)}
          </p>
        </div>
        <Link
          to="/produk"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stok menipis
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {lowStock.length} produk
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Stok di bawah 10
          </p>
        </Link>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
          Penjualan 7 hari terakhir
        </h2>
        <DailyChart daily={weekDaily} />
        <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-green-500"></span>
            Pendapatan
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-red-400"></span>
            Pengeluaran
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Stok menipis
            </h2>
            <Link
              to="/produk"
              className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
            >
              Lihat semua
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Semua stok aman.
            </p>
          ) : (
            <ul className="space-y-2">
              {lowStock.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between gap-2 text-sm"
                >
                  <span className="break-words font-medium text-gray-800 dark:text-gray-100">
                    {p.name}
                  </span>
                  <span className="shrink-0 text-gray-600 dark:text-gray-300">
                    Sisa {p.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
            Transaksi terakhir
          </h2>
          {recent.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Belum ada transaksi.
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((t) => (
                <li key={t.id} className="flex justify-between gap-2 text-sm">
                  <span className="break-words font-medium text-gray-800 dark:text-gray-100">
                    {t.label}
                    <span className="ml-2 font-normal text-gray-400 dark:text-gray-500">
                      {formatDate(t.date)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-medium ${
                      t.amount >= 0
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : "−"}{" "}
                    {formatCurrency(Math.abs(t.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
