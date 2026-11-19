import { productServices } from "./product.service";
import { addStockAdjustment } from "../src/lib/dummy/stockAdjustments";
import { todayISO, toLocalDateISO } from "../utils/format";
import type { ApiResponse, PagedResponse } from "../types/api";
import type { ICreateSale, Sale, SaleSearchParams } from "../types/Sale";

const STORAGE_KEY = "kasirku-dummy-sales";

// Dummy: penjualan disimpan di localStorage (bentuk sama persis dgn real).
// Harga & laba diambil dari API Product beneran, jadi angkanya konsisten.
// Catatan: instance + endpoint belum dipakai di versi dummy ini — keduanya
// baru dipakai saat service ini diganti ke API beneran.
export const loadDummySales = (): Sale[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Sale[];
  } catch {
    return [];
  }
};

const saveSales = (sales: Sale[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));

const saleServices = {
  getSales: async (params: SaleSearchParams) => {
    const all = loadDummySales()
      .filter(
        (s) =>
          !params.startDate ||
          toLocalDateISO(s.createdAt) >= params.startDate,
      )
      .filter(
        (s) =>
          !params.endDate || toLocalDateISO(s.createdAt) <= params.endDate,
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const start = (params.page - 1) * params.size;
    const data: PagedResponse<Sale> = {
      data: all.slice(start, start + params.size),
      paging: {
        current_page: params.page,
        total_page: Math.max(1, Math.ceil(all.length / params.size)),
        size: params.size,
      },
    };
    return { data } as { data: PagedResponse<Sale> };
  },

  createSale: async (payload: ICreateSale) => {
    // Ambil harga beneran dari API Product (sama seperti yang BE lakukan nanti)
    const { data: products } = await productServices.getProducts({
      page: 1,
      size: 100,
    });
    const items = payload.items.map((item) => {
      const product = products.data.find((p) => p.id === item.productId);
      if (!product) throw new Error("Product is not found");
      return {
        productId: product.id,
        productName: product.name,
        price: product.sellPrice,
        buyPrice: product.buyPrice,
        quantity: item.quantity,
        subtotal: product.sellPrice * item.quantity,
      };
    });
    const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);
    const totalProfit = items.reduce(
      (sum, i) => sum + (i.price - i.buyPrice) * i.quantity,
      0,
    );
    const today = todayISO().replaceAll("-", "");
    const seq =
      loadDummySales().filter((s) => s.invoiceNumber.includes(today)).length +
      1;
    const sale: Sale = {
      id: Date.now(),
      invoiceNumber: `INV-${today}-${String(seq).padStart(4, "0")}`,
      paymentMethod: payload.paymentMethod,
      totalAmount,
      totalProfit,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSales([sale, ...loadDummySales()]);
    // Stok berkurang (dummy overlay — lihat stockAdjustments.ts)
    items.forEach((i) => addStockAdjustment(i.productId, -i.quantity));
    return { data: { data: sale } } as { data: ApiResponse<Sale> };
  },

  deleteSale: async (id: number) => {
    saveSales(loadDummySales().filter((s) => s.id !== id));
    return { data: { data: "OK" } } as { data: ApiResponse<"OK"> };
  },
};

export { saleServices };
