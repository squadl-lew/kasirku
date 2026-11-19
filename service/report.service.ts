import { loadDummySales } from "./sale.service";
import { loadDummyExpenses } from "../src/lib/dummy/expenseStore";
import { formatTimeHM, todayISO, toLocalDateISO } from "../utils/format";
import type { ApiResponse } from "../types/api";
import type {
  DailyReport,
  RangeReport,
  ReportTransaction,
} from "../types/Report";

const sumSalesOn = (date: string) => {
  const sales = loadDummySales().filter(
    (s) => toLocalDateISO(s.createdAt) === date,
  );
  return {
    income: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    count: sales.length,
  };
};

const sumExpensesOn = (date: string) => {
  const expenses = loadDummyExpenses().filter((e) => e.date === date);
  return {
    expense: expenses.reduce((sum, e) => sum + e.amount, 0),
    count: expenses.length,
  };
};

const buildDaily = (date: string): DailyReport => {
  const { income, count: salesCount } = sumSalesOn(date);
  const { expense, count: expensesCount } = sumExpensesOn(date);
  return {
    date,
    totalIncome: income,
    totalExpense: expense,
    profit: income - expense,
    salesCount,
    expensesCount,
  };
};

const eachDate = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const d = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (d <= last) {
    dates.push(toLocalDateISO(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

const reportServices = {
  getDailyReport: async (date: string) => {
    return { data: { data: buildDaily(date) } } as {
      data: ApiResponse<DailyReport>;
    };
  },

  getRangeReport: async (startDate: string, endDate: string) => {
    const daily = eachDate(startDate, endDate).map(buildDaily);
    const totalIncome = daily.reduce((s, d) => s + d.totalIncome, 0);
    const totalExpense = daily.reduce((s, d) => s + d.totalExpense, 0);
    const data: RangeReport = {
      startDate,
      endDate,
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
      salesCount: daily.reduce((s, d) => s + d.salesCount, 0),
      expensesCount: daily.reduce((s, d) => s + d.expensesCount, 0),
      daily,
    };
    return { data: { data } } as { data: ApiResponse<RangeReport> };
  },

  // "Semua": dari tanggal data tertua sampai hari ini
  getAllRangeReport: async () => {
    const saleDates = loadDummySales().map((s) =>
      toLocalDateISO(s.createdAt),
    );
    const expenseDates = loadDummyExpenses().map((e) => e.date);
    const all = [...saleDates, ...expenseDates].sort();
    const start = all[0] ?? todayISO();
    const end = todayISO();
    return reportServices.getRangeReport(start, end);
  },

  getRangeTransactions: async (startDate: string, endDate: string) => {
    const sales = loadDummySales()
      .filter((s) => {
        const d = toLocalDateISO(s.createdAt);
        return d >= startDate && d <= endDate;
      })
      .map((s) => ({
        id: `sale-${s.id}`,
        date: toLocalDateISO(s.createdAt),
        time: formatTimeHM(s.createdAt),
        label: `Penjualan ${s.invoiceNumber} (${s.items.length} item)`,
        type: "sale" as const,
        amount: s.totalAmount,
      }));
    const expenses = loadDummyExpenses()
      .filter((e) => e.date >= startDate && e.date <= endDate)
      .map((e) => ({
        id: `expense-${e.id}`,
        date: e.date,
        time: formatTimeHM(e.createdAt),
        label: e.title,
        type: "expense" as const,
        amount: -e.amount,
      }));
    const data = [...sales, ...expenses].sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.time.localeCompare(a.time),
    );
    return { data: { data } } as { data: ApiResponse<ReportTransaction[]> };
  },
};

export { reportServices };
