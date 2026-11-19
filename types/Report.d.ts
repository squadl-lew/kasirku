export interface DailyReport {
  date: string; // YYYY-MM-DD
  totalIncome: number;
  totalExpense: number;
  profit: number; // pendapatan - pengeluaran
  salesCount: number;
  expensesCount: number;
}

export interface RangeReport {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  salesCount: number;
  expensesCount: number;
  daily: DailyReport[];
}

export interface ReportTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  label: string; // nomor invoice (penjualan) atau keterangan (pengeluaran)
  type: "sale" | "expense";
  amount: number; // + untuk penjualan, - untuk pengeluaran
}
