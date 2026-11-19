import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import type { RestockFormValues } from "../../lib/validation/restockSchema";
import type { Product } from "../../../types/Product";
import { formatCurrency } from "../../../utils/format";

interface RestockFormProps {
  form: UseFormReturn<RestockFormValues>;
  fields: FieldArrayWithId<RestockFormValues, "items", "id">[];
  items: RestockFormValues["items"];
  products: Product[];
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
  pickerSearch: string;
  setPickerSearch: (value: string) => void;
  addItem: (product: Product) => void;
  removeItem: (index: number) => void;
  totalBelanja: number;
  onSubmit: () => void;
  isSaving: boolean;
}

export default function RestockForm({
  form,
  fields,
  items,
  products,
  pickerOpen,
  setPickerOpen,
  pickerSearch,
  setPickerSearch,
  addItem,
  removeItem,
  totalBelanja,
  onSubmit,
  isSaving,
}: RestockFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(pickerSearch.toLowerCase()) &&
      !fields.some((f) => f.productId === p.id),
  );

  const productName = (productId: number) =>
    products.find((p) => p.id === productId)?.name ?? "Produk tidak ditemukan";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => setPickerOpen(!pickerOpen)}
          className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-left text-sm text-gray-600 hover:border-green-600 dark:border-neutral-700 dark:text-gray-300"
        >
          <i className="fas fa-plus mr-2"></i>Tambah Produk
        </button>
        {pickerOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <input
              type="text"
              placeholder="Ketik nama produk..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              className="w-full border-b border-gray-200 bg-transparent px-3 py-2 text-sm focus:outline-none dark:border-neutral-800"
            />
            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredProducts.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Produk tidak ditemukan.
                </li>
              )}
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {product.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(product.buyPrice)} — Stok: {product.stock}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {fields.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Belum ada item. Tambah produk untuk restok.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-xl border border-gray-200 p-4 dark:border-neutral-800"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {productName(field.productId)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Hapus
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Jumlah
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                {...register(`items.${index}.quantity`)}
              />
              {errors.items?.[index]?.quantity && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.items[index]?.quantity?.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Harga Beli (Rp)
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                {...register(`items.${index}.buyPrice`)}
              />
              {errors.items?.[index]?.buyPrice && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.items[index]?.buyPrice?.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Subtotal
              </label>
              <p className="px-1 py-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                {formatCurrency(
                  (items[index]?.buyPrice ?? 0) * (items[index]?.quantity ?? 0),
                )}
              </p>
            </div>
          </div>
        </div>
      ))}

      {errors.items && typeof errors.items.message === "string" && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {errors.items.message}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-neutral-800">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Total Belanja
        </span>
        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {formatCurrency(totalBelanja)}
        </span>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving || fields.length === 0}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan Restok"}
        </button>
      </div>
    </form>
  );
}
