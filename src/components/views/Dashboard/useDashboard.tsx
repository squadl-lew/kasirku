import { useQuery } from "@tanstack/react-query";
import { reportServices } from "../../../../service/report.service";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import { loadDummyExpenses } from "../../../lib/dummy/expenseStore";
import { useActivities } from "../../../lib/dummy/activityLog";
import { addDaysISO, todayISO } from "../../../../utils/format";

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

  // Pengeluaran bulan ini (+ jumlahnya, untuk sub-teks kartu)
  const { data: monthExpense } = useQuery({
    queryKey: ["expenses", "month", month],
    queryFn: async () => {
      const list = loadDummyExpenses().filter((e) =>
        e.date.startsWith(month),
      );
      return {
        total: list.reduce((sum, e) => sum + e.amount, 0),
        count: list.length,
      };
    },
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

  // Aktivitas terakhir (8 terbaru dari activity log)
  const activities = useActivities();

  return {
    todayIncome: daily?.totalIncome ?? 0,
    salesCount: daily?.salesCount ?? 0,
    monthExpense: monthExpense?.total ?? 0,
    monthExpenseCount: monthExpense?.count ?? 0,
    lowStock: lowStock ?? [],
    weekDaily: week?.daily ?? [],
    activities,
  };
};
