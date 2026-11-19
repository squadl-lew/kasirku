import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../../../../service/expense.service";
import { restockServices } from "../../../../service/restock.service";
import { loadDummyExpenses } from "../../../lib/dummy/expenseStore";
import { addActivity } from "../../../lib/dummy/activityLog";
import {
  expenseSchema,
  type ExpenseFormValues,
} from "../../../lib/validation/expenseSchema";
import { todayISO } from "../../../../utils/format";
import type { ToasterState } from "../../ui/Toaster";
import type { Expense, ICreateExpense } from "../../../../types/Expense";

export const useExpense = () => {
  const queryClient = useQueryClient();
  const today = todayISO();
  const month = today.slice(0, 7);
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);
  const deleteNameRef = useRef<{
    title: string;
    category: string;
    amount: number;
  } | null>(null);

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

  // Ringkasan bulan berjalan (kartu statistik, bukan yang terfilter)
  const { data: monthSummary } = useQuery({
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
    defaultValues: {
      title: "",
      category: "Operasional",
      amount: 0,
      date: today,
    },
    mode: "onBlur",
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["restocks"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const { mutate: mutateCreate, isPending: isSaving } = useMutation({
    mutationFn: (payload: ICreateExpense) =>
      expenseServices.createExpense(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: (res) => {
      const created = res.data.data;
      addActivity({
        kind: "expense",
        label: created.title,
        detail: created.category,
        amount: -created.amount,
      });
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
      const deleted = deleteNameRef.current;
      if (deleted) {
        addActivity({
          kind: "expense",
          label: `Pengeluaran "${deleted.title}" dihapus`,
          detail: deleted.category,
          amount: -deleted.amount,
        });
        deleteNameRef.current = null;
      }
      setToaster({ type: "success", message: "Pengeluaran berhasil dihapus" });
      refresh();
    },
  });

  const openCreate = () => {
    form.reset({ title: "", category: "Operasional", amount: 0, date: today });
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteNameRef.current = {
      title: deleteTarget.title,
      category: deleteTarget.category,
      amount: deleteTarget.amount,
    };
    mutateDelete(deleteTarget.id);
    setDeleteTarget(null);
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
    monthSummary: monthSummary ?? { total: 0, count: 0 },
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
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    onSubmit: form.handleSubmit(handleSubmit),
    isSaving,
    toaster,
  };
};
