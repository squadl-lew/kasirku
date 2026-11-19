import {
  addDummyExpense,
  loadDummyExpenses,
  saveDummyExpenses,
} from "../src/lib/dummy/expenseStore";
import { restockServices } from "./restock.service";
import type { ApiResponse, PagedResponse } from "../types/api";
import type {
  Expense,
  ICreateExpense,
  IUpdateExpense,
  ExpenseSearchParams,
} from "../types/Expense";

const expenseServices = {
  getExpenses: async (params: ExpenseSearchParams & { search?: string }) => {
    const all = loadDummyExpenses()
      .filter((e) => !params.startDate || e.date >= params.startDate)
      .filter((e) => !params.endDate || e.date <= params.endDate)
      .filter((e) => !params.category || e.category === params.category)
      .filter(
        (e) =>
          !params.search ||
          e.title.toLowerCase().includes(params.search.toLowerCase()),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
    const start = (params.page - 1) * params.size;
    const data: PagedResponse<Expense> = {
      data: all.slice(start, start + params.size),
      paging: {
        current_page: params.page,
        total_page: Math.max(1, Math.ceil(all.length / params.size)),
        size: params.size,
      },
    };
    return { data } as { data: PagedResponse<Expense> };
  },

  getExpense: async (id: number) => {
    const expense = loadDummyExpenses().find((e) => e.id === id);
    if (!expense) throw new Error("Expense is not found");
    return { data: { data: expense } } as { data: ApiResponse<Expense> };
  },

  createExpense: async (payload: ICreateExpense) => {
    const expense = addDummyExpense(payload);
    return { data: { data: expense } } as { data: ApiResponse<Expense> };
  },

  updateExpense: async (id: number, payload: IUpdateExpense) => {
    const all = loadDummyExpenses();
    const found = all.find((e) => e.id === id);
    if (!found) throw new Error("Expense is not found");
    if (found.restockId !== undefined) {
      throw new Error(
        "Pengeluaran dari restok tidak bisa diubah, batalkan lewat menu Restok",
      );
    }
    const updated: Expense = {
      ...found,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    saveDummyExpenses(all.map((e) => (e.id === id ? updated : e)));
    return { data: { data: updated } } as { data: ApiResponse<Expense> };
  },

  deleteExpense: async (id: number) => {
    const found = loadDummyExpenses().find((e) => e.id === id);
    if (!found) throw new Error("Expense is not found");
    if (found.restockId !== undefined) {
      // Expense dari restok: hapus restoknya sekalian — stok dikembalikan,
      // expense ikut terhapus (sama seperti Batalkan di menu Restok)
      await restockServices.deleteRestock(found.restockId);
      return { data: { data: "OK" } } as { data: ApiResponse<"OK"> };
    }
    saveDummyExpenses(loadDummyExpenses().filter((e) => e.id !== id));
    return { data: { data: "OK" } } as { data: ApiResponse<"OK"> };
  },
};

export { expenseServices };
