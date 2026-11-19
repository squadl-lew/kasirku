import { useExpense } from "./useExpense.tsx";
import ExpenseList from "../../expense/ExpenseList.tsx";
import ExpenseForm from "../../expense/ExpenseForm.tsx";
import ExpenseDetail from "../../expense/ExpenseDetail.tsx";
import Modal from "../../ui/Modal.tsx";
import Toaster from "../../ui/Toaster.tsx";
import { formatCurrency, formatDate } from "../../../../utils/format";

export default function Expense() {
  const {
    expenses,
    isLoading,
    isError,
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
    handleDelete,
    onSubmit,
    isSaving,
    toaster,
  } = useExpense();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Pengeluaran
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Pengeluaran
        </button>
      </div>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Pengeluaran {date ? `tanggal ${formatDate(date)}` : "semua tanggal"}:{" "}
        <span className="font-bold text-gray-800 dark:text-gray-100">
          {formatCurrency(total)}
        </span>{" "}
        · {expenses.length} pengeluaran
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
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
            onDelete={handleDelete}
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
        {detail && <ExpenseDetail expense={detail} restock={detailRestock} />}
      </Modal>

      <Toaster toaster={toaster} />
    </>
  );
}
