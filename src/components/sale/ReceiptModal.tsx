import type { PaymentMethod, Sale } from "../../../types/Sale";
import { formatCurrency, formatDate } from "../../../utils/format";
import Modal from "../ui/Modal.tsx";

const methodLabels: Record<PaymentMethod, string> = {
  CASH: "Tunai",
  QRIS: "QRIS",
  TRANSFER: "Transfer",
};

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export default function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
  return (
    <Modal
      open={sale !== null}
      onClose={onClose}
      title="Pembayaran Berhasil"
    >
      {sale && (
        <div className="space-y-4 text-sm">
          <div className="text-center">
            <i className="fas fa-circle-check text-4xl text-green-600"></i>
            <p className="mt-2 font-bold text-gray-800 dark:text-gray-100">
              {sale.invoiceNumber}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(sale.createdAt)} — {methodLabels[sale.paymentMethod]}
            </p>
          </div>

          <ul className="space-y-2 border-t border-gray-100 pt-3 dark:border-neutral-800">
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

          <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-800 dark:border-neutral-800 dark:text-gray-100">
            <span>Total</span>
            <span>{formatCurrency(sale.totalAmount)}</span>
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
