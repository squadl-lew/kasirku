import { useState } from "react";
import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../../../../service/expense.service";
import {
  expenseSchema,
  type ExpenseFormValues,
} from "../../../lib/validation/expenseSchema";
import { alertConfirm } from "../../../lib/alert";
import { todayISO } from "../../../../utils/format";
import type { ToasterState } from "../../ui/Toaster";
import type {
  Expense,
  ICreateExpense,
  IUpdateExpense,
} from "../../../../types/Expense";

export const useExpense = () => {
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [detail, setDetail] = useState<Expense | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses", startDate, endDate, category, page],
    queryFn: async () => {
      const res = await expenseServices.getExpenses({
        startDate,
        endDate,
        category,
        page,
        size: 10,
      });
      return res.data; // { data: Expense[]; paging: Paging }
    },
  });

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { title: "", category: "", amount: 0, date: todayISO() },
    mode: "onBlur",
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["expenses"] });

  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
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

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (payload: IUpdateExpense) =>
      expenseServices.updateExpense(payload.id, payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Pengeluaran berhasil diubah" });
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
    setEditing(null);
    form.reset({ title: "", category: "", amount: 0, date: todayISO() });
    setFormOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    form.reset({ ...expense });
    setFormOpen(true);
  };

  const handleDelete = async (expense: Expense) => {
    if (!(await alertConfirm(`Hapus pengeluaran "${expense.title}"?`))) return;
    mutateDelete(expense.id);
  };

  const handleSubmit = (values: ExpenseFormValues) => {
    const description =
      values.description === "" ? undefined : values.description;
    if (values.id !== undefined) {
      mutateUpdate({ ...values, id: values.id, description });
    } else {
      mutateCreate({ ...values, description });
    }
  };

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return {
    expenses: data?.data ?? [],
    paging: data?.paging,
    isLoading,
    isError,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    category,
    setCategory,
    page,
    setPage,
    handleFilter,
    form,
    formOpen,
    setFormOpen,
    editing,
    openCreate,
    openEdit,
    detail,
    setDetail,
    handleDelete,
    onSubmit: form.handleSubmit(handleSubmit),
    isSaving: isCreating || isUpdating,
    toaster,
  };
};
