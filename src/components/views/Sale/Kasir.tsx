import { useSale } from "./useSale.tsx";
import CartPanel from "../../sale/CartPanel.tsx";
import PaymentModal from "../../sale/PaymentModal.tsx";
import ReceiptModal from "../../sale/ReceiptModal.tsx";
import Toaster from "../../ui/Toaster.tsx";
import { formatCurrency } from "../../../../utils/format";

export default function Kasir() {
  const {
    products,
    isLoading,
    search,
    setSearch,
    cart,
    addToCart,
    updateQuantity,
    totalAmount,
    paymentOpen,
    setPaymentOpen,
    receipt,
    setReceipt,
    form,
    change,
    onCheckout,
    isCheckingOut,
    toaster,
  } = useSale();

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Kasir
      </h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
          <input
            type="text"
            placeholder="Cari produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
          />

          {isLoading && (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Memuat produk...
            </p>
          )}
          {!isLoading && products.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Tidak ada produk dengan stok tersedia.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-xl border border-gray-200 p-4 text-left hover:border-green-600 hover:bg-green-50 dark:border-neutral-800 dark:hover:bg-green-900/20"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
                <p className="mt-2 text-sm font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(product.sellPrice)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Stok: {product.stock}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
            Keranjang
          </h2>
          <CartPanel
            cart={cart}
            onUpdateQuantity={updateQuantity}
            totalAmount={totalAmount}
          />
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => setPaymentOpen(true)}
            className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Bayar
          </button>
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        form={form}
        totalAmount={totalAmount}
        change={change}
        onCheckout={onCheckout}
        isCheckingOut={isCheckingOut}
      />

      <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />

      <Toaster toaster={toaster} />
    </>
  );
}
