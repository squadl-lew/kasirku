import { useQuery } from "@tanstack/react-query";
import { reportServices } from "../../../../service/report.service";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import { loadDummyExpenses } from "../../../lib/dummy/expenseStore";
import { loadDummySales } from "../../../../service/sale.service";
import { addDaysISO, todayISO, toLocalDateISO } from "../../../../utils/format";

export const useDashboard = () => {
  const today = todayISO();
  const month = today.slice(0, 7);

  // Penjualan hari ini
  const { data: daily } = useQuery({
    queryKey: ["reports", "daily", today],
    queryFn: async () => {
      const res = await reportServices.getDailyReport(today);
      return res.data.data;
    },
  });

  // Pengeluaran bulan ini
  const { data: monthExpense } = useQuery({
    queryKey: ["expenses", "month", month],
    queryFn: async () =>
      loadDummyExpenses()
        .filter((e) => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0),
  });

  // Stok menipis (stok di bawah 10, sesuai prototype), dari BE + selisih dummy
  const { data: lowStock } = useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: async () => {
      const res = await productServices.getProducts({ page: 1, size: 100 });
      return applyStockAdjustments(res.data.data).filter((p) => p.stock < 10);
    },
  });

  // Grafik 7 hari terakhir
  const { data: week } = useQuery({
    queryKey: ["reports", "week", today],
    queryFn: async () => {
      const start = addDaysISO(today, -6);
      const res = await reportServices.getRangeReport(start, today);
      return res.data.data;
    },
  });

  // Transaksi terakhir (5 penjualan + pengeluaran terbaru, digabung)
  const { data: recent } = useQuery({
    queryKey: ["reports", "recent"],
    queryFn: async () => {
      const sales = loadDummySales().map((s) => ({
        id: `sale-${s.id}`,
        type: "sale" as const,
        label: s.invoiceNumber,
        date: toLocalDateISO(s.createdAt),
        amount: s.totalAmount,
      }));
      const expenses = loadDummyExpenses().map((e) => ({
        id: `expense-${e.id}`,
        type: "expense" as const,
        label: e.title,
        date: e.date,
        amount: -e.amount,
      }));
      return [...sales, ...expenses]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5);
    },
  });

  return {
    todayIncome: daily?.totalIncome ?? 0,
    monthExpense: monthExpense ?? 0,
    lowStock: lowStock ?? [],
    weekDaily: week?.daily ?? [],
    recent: recent ?? [],
  };
};
