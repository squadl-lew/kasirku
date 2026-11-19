import { useReport } from "./useReport.tsx";
import type { ReportGranularity } from "./useReport.tsx";
import { formatCurrency, formatDateLong } from "../../../../utils/format";

export default function Report() {
  const {
    mode,
    setMode,
    granularity,
    setGranularity,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startMonth,
    setStartMonth,
    endMonth,
    setEndMonth,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    applyRange,
    periodLabel,
    report,
    transactions,
    isLoading,
  } = useReport();

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  const modeButton = (value: "today" | "all" | "range", label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => setMode(value)}
      className={`rounded-md px-3 py-1 text-sm font-medium ${
        mode === value
          ? "bg-green-600 text-white"
          : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-neutral-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="flex gap-1 rounded-lg bg-[#edf4ed] p-1 dark:bg-neutral-800">
          {modeButton("today", "Hari Ini")}
          {modeButton("all", "Semua")}
          {modeButton("range", "Pilih Rentang")}
        </div>
        {mode === "range" && (
          <>
            <label
              htmlFor="granularity"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Rentang berdasarkan
            </label>
            <select
              id="granularity"
              value={granularity}
              onChange={(e) =>
                setGranularity(e.target.value as ReportGranularity)
              }
              className={inputClass}
            >
              <option value="day">Hari/Tanggal</option>
              <option value="month">Bulan</option>
              <option value="year">Tahun</option>
            </select>
            {granularity === "day" && (
              <>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startDate"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Dari
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="endDate"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Sampai
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </>
            )}
            {granularity === "month" && (
              <>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startMonth"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Dari
                  </label>
                  <input
                    id="startMonth"
                    type="month"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="endMonth"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Sampai
                  </label>
                  <input
                    id="endMonth"
                    type="month"
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </>
            )}
            {granularity === "year" && (
              <>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="startYear"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Dari
                  </label>
                  <input
                    id="startYear"
                    type="number"
                    min={2020}
                    max={2035}
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="endYear"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Sampai
                  </label>
                  <input
                    id="endYear"
                    type="number"
                    min={2020}
                    max={2035}
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </>
            )}
            <button
              type="button"
              onClick={applyRange}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Terapkan Rentang
            </button>
          </>
        )}
      </div>

      <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
        {periodLabel}
      </p>

      {isLoading && (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Memuat laporan...
        </p>
      )}

      {!isLoading && report && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total pemasukan
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.totalIncome)}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {report.salesCount} transaksi penjualan
              </p>
            </div>
            <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total pengeluaran
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.totalExpense)}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {report.expensesCount} pengeluaran
              </p>
            </div>
            <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total bersih
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  report.profit < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {formatCurrency(report.profit)}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Pemasukan − pengeluaran
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
            <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
              Rincian transaksi
            </h2>
            {transactions.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Tidak ada transaksi pada periode ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#d8e5d8] text-gray-500 dark:border-neutral-800 dark:text-gray-400">
                      <th className="py-2 pr-2 font-medium">Tanggal</th>
                      <th className="py-2 pr-2 font-medium">Keterangan</th>
                      <th className="py-2 pr-2 font-medium">Jenis</th>
                      <th className="py-2 font-medium">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-[#d8e5d8] last:border-0 dark:border-neutral-800"
                      >
                        <td className="py-2 pr-2 text-gray-600 dark:text-gray-300">
                          {formatDateLong(t.date)} {t.time}
                        </td>
                        <td className="py-2 pr-2 font-medium text-gray-800 dark:text-gray-100">
                          {t.label}
                        </td>
                        <td className="py-2 pr-2 text-gray-600 dark:text-gray-300">
                          {t.type === "sale" ? "Penjualan" : "Pengeluaran"}
                        </td>
                        <td
                          className={`py-2 font-medium ${
                            t.amount >= 0
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {t.amount >= 0 ? "+" : "−"}{" "}
                          {formatCurrency(Math.abs(t.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
