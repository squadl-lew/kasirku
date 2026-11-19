import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "../../lib/validation/productSchema";
import type { Product } from "../../../types/Product";

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  editing: Product | null;
  onSubmit: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export default function ProductForm({
  form,
  editing,
  onSubmit,
  onClose,
  isSaving,
}: ProductFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";
  const errorClass = "mt-1 text-xs text-red-600 dark:text-red-400";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nama
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nama produk"
          className={inputClass}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Kategori
        </label>
        <input
          id="category"
          type="text"
          placeholder="Kategori produk"
          className={inputClass}
          {...register("category")}
        />
        {errors.category && (
          <p className={errorClass}>{errors.category.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Deskripsi <span className="font-normal text-gray-400">(opsional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Deskripsi produk"
          rows={2}
          className={inputClass}
          {...register("description")}
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="buyPrice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Harga Beli (Rp)
          </label>
          <input
            id="buyPrice"
            type="number"
            min={0}
            className={inputClass}
            {...register("buyPrice")}
          />
          {errors.buyPrice && (
            <p className={errorClass}>{errors.buyPrice.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="sellPrice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Harga Jual (Rp)
          </label>
          <input
            id="sellPrice"
            type="number"
            min={0}
            className={inputClass}
            {...register("sellPrice")}
          />
          {errors.sellPrice && (
            <p className={errorClass}>{errors.sellPrice.message}</p>
          )}
        </div>
      </div>

      {editing !== null && (
        <div>
          <label
            htmlFor="stock"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Stok
          </label>
          <input
            id="stock"
            type="number"
            min={0}
            className={inputClass}
            {...register("stock")}
          />
          {errors.stock && (
            <p className={errorClass}>{errors.stock.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
