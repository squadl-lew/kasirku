import { Link } from "react-router";
import { useRestock } from "./useRestock.tsx";
import RestockForm from "../../restock/RestockForm.tsx";
import RestockList from "../../restock/RestockList.tsx";
import Toaster from "../../ui/Toaster.tsx";

export default function Restock() {
  const {
    products,
    isLoadingProducts,
    restocks,
    isLoadingRestocks,
    fields,
    remove,
    addItem,
    totalBelanja,
    form,
    onSubmit,
    isSaving,
    toaster,
  } = useRestock();

  const items = form.watch("items");

  return (
    <>
      <div className="mx-auto mb-4 max-w-[880px] rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
          Form belanja / restok
        </h2>
        {isLoadingProducts ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Memuat produk...
          </p>
        ) : (
          <RestockForm
            form={form}
            fields={fields}
            items={items}
            products={products}
            addItem={addItem}
            removeItem={remove}
            totalBelanja={totalBelanja}
            onSubmit={onSubmit}
            isSaving={isSaving}
          />
        )}
      </div>

      <div className="mx-auto max-w-[880px] rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Restok terakhir
          </h2>
          <Link
            to="/pengeluaran"
            className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            Lihat di Pengeluaran
          </Link>
        </div>
        {isLoadingRestocks ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Memuat riwayat...
          </p>
        ) : (
          <RestockList restocks={restocks.slice(0, 5)} />
        )}
      </div>

      <Toaster toaster={toaster} />
    </>
  );
}
