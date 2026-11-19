import { useProduct } from "./useProduct.tsx";
import ProductTable from "../../product/ProductTable.tsx";
import ProductForm from "../../product/ProductForm.tsx";
import Modal from "../../ui/Modal.tsx";
import Pagination from "../../ui/Pagination.tsx";
import Toaster from "../../ui/Toaster.tsx";

export default function Product() {
  const {
    products,
    paging,
    totalItems,
    isLoading,
    isError,
    name,
    setName,
    category,
    setCategory,
    categories,
    page,
    setPage,
    form,
    formOpen,
    setFormOpen,
    editing,
    openCreate,
    openEdit,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    onSubmit,
    isSaving,
    toaster,
  } = useProduct();

  const inputClass =
    "flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Produk
        </button>
      </div>

      <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            placeholder="Cari nama produk…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            aria-label="Kategori"
          >
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {isLoading && (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Memuat produk...
          </p>
        )}
        {isError && !isLoading && (
          <p className="py-8 text-center text-sm text-red-600 dark:text-red-400">
            Gagal memuat produk. Pastikan backend berjalan dan VITE_API_PATH
            sudah benar.
          </p>
        )}
        {!isLoading && !isError && (
          <ProductTable
            products={products}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        )}
        {paging && (
          <Pagination
            currentPage={page}
            totalPage={paging.total_page}
            totalItems={totalItems}
            pageSize={5}
            itemLabel="produk"
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Produk" : "Tambah Produk"}
      >
        <ProductForm
          form={form}
          categories={categories}
          onSubmit={onSubmit}
          onClose={() => setFormOpen(false)}
          isSaving={isSaving}
        />
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus produk?"
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Produk {deleteTarget.name} akan dihapus dari daftar.
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
