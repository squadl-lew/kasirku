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
    pickerOpen,
    setPickerOpen,
    pickerSearch,
    setPickerSearch,
    totalBelanja,
    form,
    onSubmit,
    isSaving,
    handleDelete,
    toaster,
  } = useRestock();

  const items = form.watch("items");

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Restok
      </h1>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
          Restok Baru
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
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
            pickerSearch={pickerSearch}
            setPickerSearch={setPickerSearch}
            addItem={addItem}
            removeItem={remove}
            totalBelanja={totalBelanja}
            onSubmit={onSubmit}
            isSaving={isSaving}
          />
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
          Riwayat Restok
        </h2>
        {isLoadingRestocks ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Memuat riwayat...
          </p>
        ) : (
          <RestockList restocks={restocks} onDelete={handleDelete} />
        )}
      </div>

      <Toaster toaster={toaster} />
    </>
  );
}
