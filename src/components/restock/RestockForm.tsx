import { useState } from "react";
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import type { RestockFormValues } from "../../lib/validation/restockSchema";
import type { Product } from "../../../types/Product";
import { formatCurrency } from "../../../utils/format";

interface RestockFormProps {
  form: UseFormReturn<RestockFormValues>;
  fields: FieldArrayWithId<RestockFormValues, "items", "id">[];
  items: RestockFormValues["items"];
  products: Product[];
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
  const [pickerValue, setPickerValue] = useState("");

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  const availableProducts = products.filter(
    (p) => !fields.some((f) => f.productId === p.id),
  );
  const matchedProduct = products.find(
    (p) => p.name.toLowerCase() === pickerValue.trim().toLowerCase(),
  );

  // Pilih dari datalist: kalau nama cocok persis dengan produk, tambahkan
  const handlePickerChange = (value: string) => {
    setPickerValue(value);
    const product = products.find((p) => p.name === value);
    if (product && !fields.some((f) => f.productId === product.id)) {
      addItem(product);
      setPickerValue("");
    }
  };

  const productById = (productId: number) =>
    products.find((p) => p.id === productId);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="restock-date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Tanggal belanja
          </label>
          <input
            id="restock-date"
            type="date"
            className={inputClass}
            {...register("date")}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.date.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="restock-note"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Catatan / toko tempat belanja (opsional)
          </label>
          <input
            id="restock-note"
            type="text"
            placeholder="cth. Grosir dekat pasar"
            className={inputClass}
            {...register("note")}
          />
          {errors.note && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.note.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="restock-picker"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Cari &amp; pilih produk
        </label>
        <input
          id="restock-picker"
          type="text"
          list="restock-products"
          placeholder="Cari & pilih produk"
          value={pickerValue}
          onChange={(e) => handlePickerChange(e.target.value)}
          className={inputClass}
          autoComplete="off"
        />
        <datalist id="restock-products">
          {availableProducts.map((product) => (
            <option key={product.id} value={product.name}>
              {product.name} — Stok {product.stock} · jual{" "}
              {formatCurrency(product.sellPrice)}
            </option>
          ))}
        </datalist>
        {matchedProduct && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Stok sekarang {matchedProduct.stock} · harga jual{" "}
            {formatCurrency(matchedProduct.sellPrice)}
          </p>
        )}
      </div>

      {fields.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Belum ada item. Tambah produk untuk restok.
        </p>
      )}

      {fields.map((field, index) => {
        const product = productById(field.productId);
        return (
          <div
            key={field.id}
            className="grid grid-cols-2 gap-3 rounded-xl border border-[#d8e5d8] p-3 sm:grid-cols-[1fr_96px_150px_110px_auto] dark:border-neutral-800"
          >
            <div className="col-span-2 sm:col-span-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {product?.name ?? "Produk tidak ditemukan"}
              </p>
              {product && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Stok sekarang {product.stock} · harga jual{" "}
                  {formatCurrency(product.sellPrice)}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Jumlah (pcs)
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
                Harga beli / pcs — Rp
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
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="self-end rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Hapus
            </button>
          </div>
        );
      })}

      {errors.items && typeof errors.items.message === "string" && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {errors.items.message}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-[#d8e5d8] pt-4 dark:border-neutral-800">
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
          className="h-[50px] rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving
            ? "Menyimpan..."
            : "Simpan Restok — stok bertambah & masuk Pengeluaran"}
        </button>
      </div>
    </form>
  );
}
