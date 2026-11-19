import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "../../lib/validation/productSchema";

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  categories: string[];
  onSubmit: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export default function ProductForm({
  form,
  categories,
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
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nama produk
        </label>
        <input
          id="name"
          type="text"
          placeholder="cth. Kopi Susu 250ml"
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
        <select id="category" className={inputClass} {...register("category")}>
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className={errorClass}>{errors.category.message}</p>
        )}
        <label
          htmlFor="categoryNew"
          className="mb-1 mt-3 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          atau kategori baru
        </label>
        <input
          id="categoryNew"
          type="text"
          placeholder="cth. Frozen"
          className={inputClass}
          {...register("categoryNew")}
        />
        {errors.categoryNew && (
          <p className={errorClass}>{errors.categoryNew.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="buyPrice"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Harga beli (modal) — Rp
          </label>
          <input
            id="buyPrice"
            type="number"
            min={0}
            step={100}
            placeholder="0"
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
            Harga jual — Rp
          </label>
          <input
            id="sellPrice"
            type="number"
            min={0}
            step={100}
            placeholder="0"
            className={inputClass}
            {...register("sellPrice")}
          />
          {errors.sellPrice && (
            <p className={errorClass}>{errors.sellPrice.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan produk"}
        </button>
      </div>
    </form>
  );
}
