import { useExpense } from "./useExpense.tsx";
import ExpenseList from "../../expense/ExpenseList.tsx";
import ExpenseForm from "../../expense/ExpenseForm.tsx";
import ExpenseDetail from "../../expense/ExpenseDetail.tsx";
import Modal from "../../ui/Modal.tsx";
import Toaster from "../../ui/Toaster.tsx";
import {
  formatCurrency,
  formatMonthLong,
  todayISO,
} from "../../../../utils/format";

export default function Expense() {
  const {
    expenses,
    isLoading,
    isError,
    monthSummary,
    date,
    setDate,
    search,
    setSearch,
    showAllDates,
    form,
    formOpen,
    setFormOpen,
    openCreate,
    detail,
    setDetail,
    detailRestock,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    onSubmit,
    isSaving,
    toaster,
  } = useExpense();

  const today = todayISO();
  const monthLabel = formatMonthLong(
    Number(today.slice(0, 4)),
    Number(today.slice(5, 7)),
  );

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Pengeluaran
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pengeluaran bulan {monthLabel}
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatCurrency(monthSummary.total)}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {monthSummary.count} pengeluaran
        </p>
      </div>

      <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Cari keterangan pengeluaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} flex-1`}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            aria-label="Tanggal"
          />
          <button
            type="button"
            onClick={showAllDates}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#edf4ed] dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
          >
            Semua tanggal
          </button>
        </div>

        {isLoading && (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Memuat pengeluaran...
          </p>
        )}
        {isError && !isLoading && (
          <p className="py-8 text-center text-sm text-red-600 dark:text-red-400">
            Gagal memuat pengeluaran.
          </p>
        )}
        {!isLoading && !isError && (
          <ExpenseList
            expenses={expenses}
            onDetail={setDetail}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Tambah Pengeluaran"
      >
        <ExpenseForm
          form={form}
          onSubmit={onSubmit}
          onClose={() => setFormOpen(false)}
          isSaving={isSaving}
        />
      </Modal>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title="Rincian Pengeluaran"
      >
        {detail && (
          <ExpenseDetail
            expense={detail}
            restock={detailRestock}
            onClose={() => setDetail(null)}
          />
        )}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus pengeluaran?"
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pengeluaran "{deleteTarget.title}" akan dihapus.
              {deleteTarget.restockId !== undefined
                ? " Restoknya juga ikut terhapus dan stok dikembalikan."
                : ""}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Ya, hapus
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Toaster toaster={toaster} />
    </>
  );
}
