import type { CartItem } from "../../../types/Sale";
import { formatCurrency } from "../../../utils/format";

interface CartPanelProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  totalAmount: number;
}

export default function CartPanel({
  cart,
  onUpdateQuantity,
  totalAmount,
}: CartPanelProps) {
  if (cart.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Keranjang kosong. Klik produk di sebelah kiri untuk menambahkan.
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {cart.map((item) => (
          <li
            key={item.product.id}
            className="flex items-center justify-between gap-2 border-b border-[#d8e5d8] pb-3 last:border-0 dark:border-neutral-800"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCurrency(item.product.sellPrice)} x {item.quantity} ={" "}
                {formatCurrency(item.product.sellPrice * item.quantity)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.product.id, item.quantity - 1)
                }
                className="h-7 w-7 rounded-lg bg-[#edf4ed] text-sm font-bold text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300"
                aria-label="Kurangi jumlah"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.product.id, item.quantity + 1)
                }
                className="h-7 w-7 rounded-lg bg-[#edf4ed] text-sm font-bold text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300"
                aria-label="Tambah jumlah"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.product.id, 0)}
                className="ml-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between border-t border-[#d8e5d8] pt-3 text-sm text-gray-600 dark:border-neutral-800 dark:text-gray-300">
        <span>Subtotal</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
      <div className="mt-2 flex justify-between text-base font-bold text-gray-800 dark:text-gray-100">
        <span>Total</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
}
