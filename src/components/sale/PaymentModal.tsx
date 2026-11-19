import type { UseFormReturn } from "react-hook-form";
import type { SaleFormValues } from "../../lib/validation/saleSchema";
import type { PaymentMethod } from "../../../types/Sale";
import { formatCurrency } from "../../../utils/format";
import Modal from "../ui/Modal.tsx";

const methods: Array<{ value: PaymentMethod; label: string }> = [
  { value: "CASH", label: "Tunai" },
  { value: "QRIS", label: "QRIS" },
  { value: "TRANSFER", label: "Transfer" },
];

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<SaleFormValues>;
  totalAmount: number;
  change: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export default function PaymentModal({
  open,
  onClose,
  form,
  totalAmount,
  change,
  onCheckout,
  isCheckingOut,
}: PaymentModalProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const paymentMethod = watch("paymentMethod");
  const cashReceived = watch("cashReceived") ?? 0;
  const cashNotEnough =
    paymentMethod === "CASH" && cashReceived < totalAmount;

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100";

  return (
    <Modal open={open} onClose={onClose} title="Pembayaran">
      <form
        onSubmit={onCheckout}
        noValidate
        className="space-y-4"
      >
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Metode Bayar
          </p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((method) => (
              <label
                key={method.value}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium ${
                  paymentMethod === method.value
                    ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
                }`}
              >
                <input
                  type="radio"
                  value={method.value}
                  className="sr-only"
                  {...register("paymentMethod")}
                />
                {method.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Total Bayar</span>
          <span className="font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        {paymentMethod === "CASH" && (
          <>
            <div>
              <label
                htmlFor="cashReceived"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Uang Diterima (Rp)
              </label>
              <input
                id="cashReceived"
                type="number"
                min={0}
                placeholder="Masukkan uang diterima"
                className={inputClass}
                {...register("cashReceived")}
              />
              {errors.cashReceived && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.cashReceived.message}
                </p>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Kembalian</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(Math.max(0, change))}
              </span>
            </div>
            {cashNotEnough && (
              <p className="text-xs text-red-600 dark:text-red-400">
                Uang diterima kurang dari total bayar.
              </p>
            )}
          </>
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
            disabled={isCheckingOut || cashNotEnough}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isCheckingOut ? "Memproses..." : "Bayar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
