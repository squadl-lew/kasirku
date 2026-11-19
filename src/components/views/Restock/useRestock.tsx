import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { restockServices } from "../../../../service/restock.service";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import { addActivity } from "../../../lib/dummy/activityLog";
import {
  restockSchema,
  type RestockFormValues,
} from "../../../lib/validation/restockSchema";
import { formatCurrency, todayISO } from "../../../../utils/format";
import type { ToasterState } from "../../ui/Toaster";
import type { ICreateRestock } from "../../../../types/Restock";
import type { Product } from "../../../../types/Product";

export const useRestock = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [toaster, setToaster] = useState<ToasterState | null>(null);

  // Semua produk (termasuk stok 0) — restok hanya untuk produk yang sudah ada
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "restock"],
    queryFn: async () => {
      const res = await productServices.getProducts({ page: 1, size: 100 });
      return applyStockAdjustments(res.data.data);
    },
  });

  const { data: restocksData, isLoading: isLoadingRestocks } = useQuery({
    queryKey: ["restocks"],
    queryFn: async () => {
      const res = await restockServices.getRestocks({ page: 1, size: 10 });
      return res.data;
    },
  });

  const form = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema),
    defaultValues: { date: todayISO(), note: "", items: [] },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const items = form.watch("items");
  const totalBelanja = items.reduce(
    (sum, i) => sum + (i.buyPrice ?? 0) * (i.quantity ?? 0),
    0,
  );

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["restocks"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const { mutate: mutateCreate, isPending: isSaving } = useMutation({
    mutationFn: (payload: ICreateRestock) =>
      restockServices.createRestock(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: (res) => {
      const restock = res.data.data;
      addActivity({
        kind: "restock",
        label: `Restok: ${restock.items
          .map((i) => `${i.productName} x${i.quantity}`)
          .join(", ")}`,
        detail: "Belanja Stok",
        amount: -restock.totalAmount,
      });
      setToaster({
        type: "success",
        message: `Restok tersimpan: stok bertambah & pengeluaran ${formatCurrency(restock.totalAmount)} tercatat`,
      });
      form.reset({ date: todayISO(), note: "", items: [] });
      refresh();
      // Toast sempat terlihat dulu, baru pindah ke Pengeluaran (toast
      // tinggal di halaman ini, ikut hilang kalau langsung navigasi)
      setTimeout(() => navigate("/pengeluaran"), 1200);
    },
  });

  const addItem = (product: Product) => {
    if (fields.some((f) => f.productId === product.id)) return; // sudah ada di list
    append({ productId: product.id, quantity: 1, buyPrice: product.buyPrice });
  };

  const handleSubmit = (values: RestockFormValues) => {
    mutateCreate({
      date: values.date,
      note: values.note?.trim() ? values.note.trim() : undefined,
      items: values.items,
    });
  };

  return {
    products: productsData ?? [],
    isLoadingProducts,
    restocks: restocksData?.data ?? [],
    isLoadingRestocks,
    fields,
    remove,
    addItem,
    totalBelanja,
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    isSaving,
    toaster,
  };
};
