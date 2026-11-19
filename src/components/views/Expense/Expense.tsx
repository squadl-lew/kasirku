import { useExpense } from "./useExpense.tsx";
import ExpenseTable from "../../expense/ExpenseTable.tsx";
import ExpenseForm from "../../expense/ExpenseForm.tsx";
import ExpenseDetail from "../../expense/ExpenseDetail.tsx";
import Modal from "../../ui/Modal.tsx";
import Pagination from "../../ui/Pagination.tsx";
import Toaster from "../../ui/Toaster.tsx";

export default function Expense() {
  const {
    expenses,
    paging,
    isLoading,
    isError,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    category,
    setCategory,
    page,
    setPage,
    handleFilter,
    form,
    formOpen,
    setFormOpen,
    editing,
    openCreate,
    openEdit,
    detail,
    setDetail,
    handleDelete,
    onSubmit,
    isSaving,
    toaster,
  } = useExpense();

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

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <form
          onSubmit={handleFilter}
          className="mb-4 flex flex-col gap-2 sm:flex-row"
        >
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
          <input
            type="text"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <i className="fas fa-search mr-2"></i>Cari
          </button>
        </form>

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
          <ExpenseTable
            expenses={expenses}
            onDetail={setDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
        {paging && (
          <Pagination
            currentPage={page}
            totalPage={paging.total_page}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
      >
        <ExpenseForm
          form={form}
          editing={editing}
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
        {detail && <ExpenseDetail expense={detail} />}
      </Modal>

      <Toaster toaster={toaster} />
    </>
  );
}
