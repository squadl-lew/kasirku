import type { Sale } from "../../../types/Sale";
import { paymentMethodLabels } from "../../lib/paymentMethod";
import { formatCurrency, formatDateTime } from "../../../utils/format";
import Modal from "../ui/Modal.tsx";

interface ReceiptModalProps {
  sale: Sale | null;
  payment?: { cashReceived: number; change: number } | null;
  onClose: () => void;
}

export default function ReceiptModal({
  sale,
  payment,
  onClose,
}: ReceiptModalProps) {
  return (
    <Modal open={sale !== null} onClose={onClose} title="Pembayaran Berhasil">
      {sale && (
        <div className="space-y-4 text-sm">
          <div className="text-center">
            <i className="fas fa-circle-check text-4xl text-green-600"></i>
            <p className="mt-2 font-mono font-bold text-gray-800 dark:text-gray-100">
              {sale.invoiceNumber}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateTime(sale.createdAt)} —{" "}
              {paymentMethodLabels[sale.paymentMethod]}
            </p>
          </div>

          <ul className="space-y-2 border-t border-[#d8e5d8] pt-3 dark:border-neutral-800">
            {sale.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-300">
                  {item.productName} x {item.quantity}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {formatCurrency(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-1 border-t border-[#d8e5d8] pt-3 dark:border-neutral-800">
            <div className="flex justify-between text-base font-bold text-gray-800 dark:text-gray-100">
              <span>Total</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
            {sale.paymentMethod === "CASH" && payment && (
              <>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Tunai</span>
                  <span>{formatCurrency(payment.cashReceived)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Kembalian</span>
                  <span>{formatCurrency(payment.change)}</span>
                </div>
              </>
            )}
            {sale.paymentMethod !== "CASH" && (
              <p className="text-gray-600 dark:text-gray-300">
                Dibayar via {paymentMethodLabels[sale.paymentMethod]}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Selesai
          </button>
        </div>
      )}
    </Modal>
  );
}
