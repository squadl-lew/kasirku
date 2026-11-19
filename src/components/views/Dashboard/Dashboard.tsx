import { Link } from "react-router";
import { useDashboard } from "./useDashboard.tsx";
import DailyChart from "../../report/DailyChart.tsx";
import {
  formatCurrency,
  formatDateLong,
  formatMonthLong,
  formatTimeHM,
  todayISO,
  toLocalDateISO,
} from "../../../../utils/format";

export default function Dashboard() {
  const {
    todayIncome,
    salesCount,
    monthExpense,
    monthExpenseCount,
    lowStock,
    weekDaily,
    activities,
  } = useDashboard();

  const today = todayISO();
  const monthLabel = `${formatMonthLong(
    Number(today.slice(0, 4)),
    Number(today.slice(5, 7)),
  )} ${today.slice(0, 4)}`;

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Penjualan hari ini
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(todayIncome)}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {salesCount} transaksi
          </p>
        </div>
        <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pengeluaran bulan ini
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(monthExpense)}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {monthExpenseCount} pengeluaran di {monthLabel}
          </p>
        </div>
        <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stok menipis
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {lowStock.length} produk
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Stok di bawah 10, perlu restok
          </p>
          <Link
            to="/produk"
            className="mt-2 inline-block text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            Lihat produk
          </Link>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
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
        <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
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
                    {p.stock === 0 ? "(Habis)" : `Sisa ${p.stock}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Aktivitas terakhir
            </h2>
            <Link
              to="/laporan"
              className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
            >
              Lihat laporan
            </Link>
          </div>
          {activities.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Belum ada aktivitas.
            </p>
          ) : (
            <ul className="space-y-3">
              {activities.map((a) => (
                <li key={a.id} className="flex justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-800 dark:text-gray-100">
                      {a.label}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                      {formatDateLong(toLocalDateISO(a.createdAt))} ·{" "}
                      {formatTimeHM(a.createdAt)}
                      {a.detail ? ` · ${a.detail}` : ""}
                    </p>
                  </div>
                  {a.kind === "product" ? (
                    <span className="h-fit shrink-0 rounded-full bg-[#edf4ed] px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
                      Produk
                    </span>
                  ) : (
                    <span
                      className={`shrink-0 font-medium ${
                        (a.amount ?? 0) >= 0
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {(a.amount ?? 0) >= 0 ? "+" : "−"}{" "}
                      {formatCurrency(Math.abs(a.amount ?? 0))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
