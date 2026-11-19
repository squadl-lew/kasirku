export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  description?: string;
  date: string; // YYYY-MM-DD
  restockId?: number; // ada kalau tercatat otomatis dari Restok
  createdAt: string;
  updatedAt: string;
}

export interface ICreateExpense {
  title: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export interface IUpdateExpense {
  id: number;
  title: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export interface ExpenseSearchParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  category?: string;
  page: number;
  size: number;
}
