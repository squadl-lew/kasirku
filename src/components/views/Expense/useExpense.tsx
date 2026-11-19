import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../../../../service/expense.service";
import { restockServices } from "../../../../service/restock.service";
import {
  expenseSchema,
  type ExpenseFormValues,
} from "../../../lib/validation/expenseSchema";
import { alertConfirm } from "../../../lib/alert";
import { todayISO } from "../../../../utils/format";
import type { ToasterState } from "../../ui/Toaster";
import type { Expense, ICreateExpense } from "../../../../types/Expense";

export const useExpense = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(todayISO());
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<Expense | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses", date, search],
    queryFn: async () => {
      const res = await expenseServices.getExpenses({
        startDate: date || undefined,
        endDate: date || undefined,
        search: search || undefined,
        page: 1,
        size: 100,
      });
      return res.data; // { data: Expense[]; paging: Paging }
    },
  });

  // Item restok untuk modal rincian (kalau expense berasal dari restok)
  const { data: detailRestock } = useQuery({
    queryKey: ["restocks", detail?.restockId],
    queryFn: async () => {
      const res = await restockServices.getRestock(detail!.restockId!);
      return res.data.data;
    },
    enabled: detail?.restockId !== undefined,
  });

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { title: "", category: "Operasional", amount: 0, date: todayISO() },
    mode: "onBlur",
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["restocks"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const { mutate: mutateCreate, isPending: isSaving } = useMutation({
    mutationFn: (payload: ICreateExpense) =>
      expenseServices.createExpense(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Pengeluaran berhasil ditambah" });
      setFormOpen(false);
      refresh();
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (id: number) => expenseServices.deleteExpense(id),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Pengeluaran berhasil dihapus" });
      refresh();
    },
  });

  const openCreate = () => {
    form.reset({ title: "", category: "Operasional", amount: 0, date: todayISO() });
    setFormOpen(true);
  };

  const handleDelete = async (expense: Expense) => {
    const extra =
      expense.restockId !== undefined
        ? " Restoknya juga ikut terhapus dan stok dikembalikan."
        : "";
    if (!(await alertConfirm(`Hapus pengeluaran "${expense.title}"?${extra}`)))
      return;
    mutateDelete(expense.id);
  };

  const handleSubmit = (values: ExpenseFormValues) => {
    mutateCreate({
      title: values.title,
      category: values.category,
      amount: values.amount,
      date: values.date,
    });
  };

  const showAllDates = () => setDate("");

  return {
    expenses: data?.data ?? [],
    isLoading,
    isError,
    date,
    setDate,
    search,
    setSearch,
    showAllDates,
    form,
    formOpen,
    setFormOpen,
    openCreate,
    detail,
    setDetail,
    detailRestock: detailRestock ?? null,
    handleDelete,
    onSubmit: form.handleSubmit(handleSubmit),
    isSaving,
    toaster,
  };
};
