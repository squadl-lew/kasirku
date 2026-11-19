import { useProduct } from "./useProduct.tsx";
import ProductTable from "../../product/ProductTable.tsx";
import ProductForm from "../../product/ProductForm.tsx";
import ProductDetail from "../../product/ProductDetail.tsx";
import Modal from "../../ui/Modal.tsx";
import Pagination from "../../ui/Pagination.tsx";
import Toaster from "../../ui/Toaster.tsx";

export default function Product() {
  const {
    products,
    paging,
    isLoading,
    isError,
    name,
    setName,
    category,
    setCategory,
    page,
    setPage,
    handleSearch,
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
  } = useProduct();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Produk
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Produk
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <form onSubmit={handleSearch} className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Cari nama produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
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
        title={editing ? "Edit Produk" : "Tambah Produk"}
      >
        <ProductForm
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
        title="Detail Produk"
      >
        {detail && <ProductDetail product={detail} />}
      </Modal>

      <Toaster toaster={toaster} />
    </>
  );
}
