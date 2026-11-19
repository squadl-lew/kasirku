import type { UseFormReturn } from "react-hook-form";
import type { ExpenseFormValues } from "../../lib/validation/expenseSchema";

const categories = [
  "Operasional",
  "Belanja Stok",
  "Transportasi",
  "Utilitas",
  "Lainnya",
];

interface ExpenseFormProps {
  form: UseFormReturn<ExpenseFormValues>;
  onSubmit: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export default function ExpenseForm({
  form,
  onSubmit,
  onClose,
  isSaving,
}: ExpenseFormProps) {
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
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Keterangan
        </label>
        <input
          id="title"
          type="text"
          placeholder="Contoh: Beli gula 5kg"
          className={inputClass}
          {...register("title")}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Kategori
        </label>
        <select id="category" className={inputClass} {...register("category")}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className={errorClass}>{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="amount"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Harga
          </label>
          <input
            id="amount"
            type="number"
            min={1}
            className={inputClass}
            {...register("amount")}
          />
          {errors.amount && (
            <p className={errorClass}>{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Tanggal
          </label>
          <input
            id="date"
            type="date"
            className={inputClass}
            {...register("date")}
          />
          {errors.date && <p className={errorClass}>{errors.date.message}</p>}
        </div>
      </div>

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
