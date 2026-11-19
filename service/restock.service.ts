import { productServices } from "./product.service";
import { addStockAdjustment } from "../src/lib/dummy/stockAdjustments";
import {
  addDummyExpense,
  removeDummyExpenseByRestock,
} from "../src/lib/dummy/expenseStore";
import type { ApiResponse, PagedResponse } from "../types/api";
import type {
  ICreateRestock,
  Restock,
  RestockSearchParams,
} from "../types/Restock";

const STORAGE_KEY = "kasirku-dummy-restocks";

const loadRestocks = (): Restock[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Restock[];
  } catch {
    return [];
  }
};

const saveRestocks = (restocks: Restock[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restocks));

const restockServices = {
  getRestocks: async (params: RestockSearchParams) => {
    const all = loadRestocks().sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    const start = (params.page - 1) * params.size;
    const data: PagedResponse<Restock> = {
      data: all.slice(start, start + params.size),
      paging: {
        current_page: params.page,
        total_page: Math.max(1, Math.ceil(all.length / params.size)),
        size: params.size,
      },
    };
    return { data } as { data: PagedResponse<Restock> };
  },

  createRestock: async (payload: ICreateRestock) => {
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
        buyPrice: item.buyPrice,
        quantity: item.quantity,
        subtotal: item.buyPrice * item.quantity,
      };
    });
    const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);
    const restock: Restock = {
      id: Date.now(),
      items,
      totalAmount,
      createdAt: new Date().toISOString(),
    };
    saveRestocks([restock, ...loadRestocks()]);
    // Stok naik (dummy overlay) + satu Expense "Belanja Stok"
    items.forEach((i) => addStockAdjustment(i.productId, i.quantity));
    addDummyExpense({
      title: "Belanja Stok",
      category: "Belanja Stok",
      amount: totalAmount,
      description: items
        .map((i) => `${i.productName} x${i.quantity}`)
        .join(", "),
      date: restock.createdAt.slice(0, 10),
      restockId: restock.id,
    });
    return { data: { data: restock } } as { data: ApiResponse<Restock> };
  },

  // Default dummy: restok bisa dibatalkan (stok & expense dikembalikan)
  deleteRestock: async (id: number) => {
    const restock = loadRestocks().find((r) => r.id === id);
    if (restock) {
      restock.items.forEach((i) =>
        addStockAdjustment(i.productId, -i.quantity),
      );
      removeDummyExpenseByRestock(id);
    }
    saveRestocks(loadRestocks().filter((r) => r.id !== id));
    return { data: { data: "OK" } } as { data: ApiResponse<"OK"> };
  },
};

export { restockServices };
