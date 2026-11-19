import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray } from "react-hook-form";
import { restockServices } from "../../../../service/restock.service";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import {
  restockSchema,
  type RestockFormValues,
} from "../../../lib/validation/restockSchema";
import { alertConfirm } from "../../../lib/alert";
import type { ToasterState } from "../../ui/Toaster";
import type { ICreateRestock, Restock } from "../../../../types/Restock";
import type { Product } from "../../../../types/Product";

export const useRestock = () => {
  const queryClient = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
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
    defaultValues: { items: [] },
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
  };

  const { mutate: mutateCreate, isPending: isSaving } = useMutation({
    mutationFn: (payload: ICreateRestock) =>
      restockServices.createRestock(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Restok berhasil disimpan" });
      form.reset({ items: [] });
      refresh();
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (id: number) => restockServices.deleteRestock(id),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Restok berhasil dibatalkan" });
      refresh();
    },
  });

  const addItem = (product: Product) => {
    if (fields.some((f) => f.productId === product.id)) return; // sudah ada di list
    append({ productId: product.id, quantity: 1, buyPrice: product.buyPrice });
    setPickerOpen(false);
    setPickerSearch("");
  };

  const handleDelete = async (restock: Restock) => {
    if (
      !(await alertConfirm(
        `Batalkan restok ${restock.items.length} item senilai ${restock.totalAmount}? Stok dan pengeluarannya akan dikembalikan.`,
      ))
    )
      return;
    mutateDelete(restock.id);
  };

  const handleSubmit = (values: RestockFormValues) => {
    mutateCreate({ items: values.items });
  };

  return {
    products: productsData ?? [],
    isLoadingProducts,
    restocks: restocksData?.data ?? [],
    isLoadingRestocks,
    fields,
    remove,
    addItem,
    pickerOpen,
    setPickerOpen,
    pickerSearch,
    setPickerSearch,
    totalBelanja,
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    isSaving,
    handleDelete,
    toaster,
  };
};
