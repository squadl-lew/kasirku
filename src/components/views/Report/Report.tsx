import { useReport } from "./useReport.tsx";
import DailyChart from "../../report/DailyChart.tsx";
import { formatCurrency, formatDate } from "../../../../utils/format";

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
    month,
    setMonth,
    year,
    setYear,
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
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Laporan
      </h1>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-neutral-800">
          {modeButton("today", "Hari Ini")}
          {modeButton("all", "Semua")}
          {modeButton("range", "Pilih Rentang")}
        </div>
        {mode === "range" && (
          <>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Rentang berdasarkan
            </span>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-neutral-800">
              {(["day", "month", "year"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGranularity(g)}
                  className={`rounded-md px-3 py-1 text-sm font-medium ${
                    granularity === g
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {g === "day" ? "Hari" : g === "month" ? "Bulan" : "Tahun"}
                </button>
              ))}
            </div>
            {granularity === "day" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                  aria-label="Tanggal mulai"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                  aria-label="Tanggal akhir"
                />
              </>
            )}
            {granularity === "month" && (
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={inputClass}
                aria-label="Bulan"
              />
            )}
            {granularity === "year" && (
              <input
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputClass}
                aria-label="Tahun"
              />
            )}
          </>
        )}
      </div>

      {isLoading && (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Memuat laporan...
        </p>
      )}

      {!isLoading && report && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Pendapatan
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.totalIncome)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Pengeluaran
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.totalExpense)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total bersih
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.profit)}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
              Grafik harian
            </h2>
            <DailyChart daily={report.daily} />
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

          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
              Per hari
            </h2>
            {report.daily.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Belum ada data pada rentang ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 dark:border-neutral-800 dark:text-gray-400">
                      <th className="py-2 pr-2 font-medium">Tanggal</th>
                      <th className="py-2 pr-2 font-medium">Pendapatan</th>
                      <th className="py-2 pr-2 font-medium">Pengeluaran</th>
                      <th className="py-2 font-medium">Laba</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.daily.map((d) => (
                      <tr
                        key={d.date}
                        className="border-b border-gray-100 last:border-0 dark:border-neutral-800"
                      >
                        <td className="py-2 pr-2 text-gray-600 dark:text-gray-300">
                          {formatDate(d.date)}
                        </td>
                        <td className="py-2 pr-2 text-gray-600 dark:text-gray-300">
                          {formatCurrency(d.totalIncome)}
                        </td>
                        <td className="py-2 pr-2 text-gray-600 dark:text-gray-300">
                          {formatCurrency(d.totalExpense)}
                        </td>
                        <td className="py-2 font-medium text-gray-800 dark:text-gray-100">
                          {formatCurrency(d.profit)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold text-gray-800 dark:text-gray-100">
                      <td className="py-2 pr-2">Total</td>
                      <td className="py-2 pr-2">
                        {formatCurrency(report.totalIncome)}
                      </td>
                      <td className="py-2 pr-2">
                        {formatCurrency(report.totalExpense)}
                      </td>
                      <td className="py-2">
                        {formatCurrency(report.profit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
              Rincian transaksi
            </h2>
            {transactions.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Belum ada transaksi pada rentang ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 dark:border-neutral-800 dark:text-gray-400">
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
                        className="border-b border-gray-100 last:border-0 dark:border-neutral-800"
                      >
                        <td className="py-2 pr-2 text-gray-600 dark:text-gray-300">
                          {formatDate(t.date)}
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
