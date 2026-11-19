import { useSale } from "./useSale.tsx";
import CartPanel from "../../sale/CartPanel.tsx";
import PaymentModal from "../../sale/PaymentModal.tsx";
import ReceiptModal from "../../sale/ReceiptModal.tsx";
import Toaster from "../../ui/Toaster.tsx";
import { formatCurrency } from "../../../../utils/format";

export default function Kasir() {
  const {
    products,
    categories,
    isLoading,
    search,
    setSearch,
    category,
    setCategory,
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    totalAmount,
    paymentOpen,
    setPaymentOpen,
    receipt,
    setReceipt,
    receiptPayment,
    form,
    change,
    onCheckout,
    isCheckingOut,
    toaster,
  } = useSale();

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_372px]">
        <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
          <input
            type="text"
            placeholder="Cari produk untuk dijual…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
          />

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("")}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                category === ""
                  ? "bg-green-600 text-white"
                  : "bg-[#edf4ed] text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              }`}
            >
              Semua
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  category === c
                    ? "bg-green-600 text-white"
                    : "bg-[#edf4ed] text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading && (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Memuat produk...
            </p>
          )}
          {!isLoading && products.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Tidak ada produk siap jual yang cocok. Produk dengan stok habis
              tidak ditampilkan di Kasir — restok dulu di menu Restok.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-xl border border-[#d8e5d8] p-4 text-left hover:border-green-600 hover:bg-green-50 dark:border-neutral-800 dark:hover:bg-green-900/20"
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

        <div className="h-fit self-start rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm lg:sticky lg:top-[92px] dark:border-neutral-800 dark:bg-[#1a1b1d]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Keranjang
            </h2>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={clearCart}
              className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Kosongkan
            </button>
          </div>
          <CartPanel
            cart={cart}
            onUpdateQuantity={updateQuantity}
            totalAmount={totalAmount}
          />
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => setPaymentOpen(true)}
            className="mt-4 h-[50px] w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Bayar {formatCurrency(totalAmount)}
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

      <ReceiptModal
        sale={receipt}
        payment={receiptPayment}
        onClose={() => setReceipt(null)}
      />

      <Toaster toaster={toaster} />
    </>
  );
}
