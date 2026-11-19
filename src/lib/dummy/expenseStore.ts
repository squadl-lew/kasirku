// Penyimpanan expense dummy di localStorage — dipakai service Restok
// (satu Expense "Belanja Stok" per Restock) dan service Expense di Fase 4.
// Bentuknya mengikuti doc/expense.md (title, category, amount, description,
// date) ditambah restockId sebagai penghubung ke Restock yang membuatnya.
// Saat BE Expense jadi, file ini diganti service Expense beneran.
export interface DummyExpense {
  id: number;
  title: string;
  category: string;
  amount: number;
  description?: string;
  date: string; // YYYY-MM-DD
  restockId?: number;
  createdAt: string;
}

const KEY = "kasirku-dummy-expenses";

export const loadDummyExpenses = (): DummyExpense[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as DummyExpense[];
  } catch {
    return [];
  }
};

export const saveDummyExpenses = (expenses: DummyExpense[]) =>
  localStorage.setItem(KEY, JSON.stringify(expenses));

export const addDummyExpense = (
  input: Omit<DummyExpense, "id" | "createdAt">,
): DummyExpense => {
  const expense: DummyExpense = {
    ...input,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  saveDummyExpenses([expense, ...loadDummyExpenses()]);
  return expense;
};

export const removeDummyExpenseByRestock = (restockId: number) =>
  saveDummyExpenses(
    loadDummyExpenses().filter((e) => e.restockId !== restockId),
  );
