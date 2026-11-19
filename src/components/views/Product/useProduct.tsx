import { useState } from "react";
import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import {
  productSchema,
  type ProductFormValues,
} from "../../../lib/validation/productSchema";
import { alertConfirm } from "../../../lib/alert";
import type { ToasterState } from "../../ui/Toaster";
import type {
  ICreateProduct,
  IUpdateProduct,
  Product,
} from "../../../../types/Product";

export const useProduct = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);

  // List + search + paging
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", name, category, page],
    queryFn: async () => {
      const res = await productServices.getProducts({
        name,
        category,
        page,
        size: 10,
      });
      // Tempel selisih stok dummy (restok/jualan) di atas stok BE
      return { ...res.data, data: applyStockAdjustments(res.data.data) };
    },
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", category: "", buyPrice: 0, sellPrice: 0 },
    mode: "onBlur",
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["products"] });

  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (payload: ICreateProduct) =>
      productServices.createProduct(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Produk berhasil ditambah" });
      setFormOpen(false);
      refresh();
    },
  });

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (payload: IUpdateProduct) =>
      productServices.updateProduct(payload.id, payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Produk berhasil diubah" });
      setFormOpen(false);
      refresh();
    },
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (id: number) => productServices.deleteProduct(id),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: () => {
      setToaster({ type: "success", message: "Produk berhasil dihapus" });
      refresh();
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", category: "", buyPrice: 0, sellPrice: 0 });
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    form.reset({ ...product });
    setFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!(await alertConfirm(`Hapus produk "${product.name}"?`))) return;
    mutateDelete(product.id);
  };

  const handleSubmit = (values: ProductFormValues) => {
    const description =
      values.description === "" ? undefined : values.description;
    if (values.id !== undefined) {
      mutateUpdate({
        ...values,
        id: values.id,
        stock: values.stock ?? 0,
        description,
      });
    } else {
      mutateCreate({ ...values, description }); // stock tidak dikirim
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return {
    products: data?.data ?? [],
    paging: data?.paging,
    isLoading,
    isError,
    name,
    setName,
    category,
    setCategory,
    page,
    setPage,
    handleSearch,
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
