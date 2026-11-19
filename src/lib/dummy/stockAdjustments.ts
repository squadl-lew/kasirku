// DUMMY ONLY — dihapus saat BE Restock/Sale jadi.
// Menyimpan selisih stok dari restok (+) dan jualan (-) di localStorage,
// ditempel di atas stok BE saat menampilkan produk.
const KEY = "kasirku-dummy-stock-adjustments";

export const getStockAdjustments = (): Record<number, number> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<
      number,
      number
    >;
  } catch {
    return {};
  }
};

export const addStockAdjustment = (productId: number, delta: number) => {
  const all = getStockAdjustments();
  all[productId] = (all[productId] ?? 0) + delta;
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const applyStockAdjustments = <
  T extends { id: number; stock: number },
>(
  products: T[],
): T[] => {
  const adj = getStockAdjustments();
  return products.map((p) => ({
    ...p,
    stock: Math.max(0, p.stock + (adj[p.id] ?? 0)),
  }));
};
