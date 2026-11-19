import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import { addActivity } from "../../../lib/dummy/activityLog";
import {
  productSchema,
  type ProductFormValues,
} from "../../../lib/validation/productSchema";
import type { ToasterState } from "../../ui/Toaster";
import type {
  ICreateProduct,
  IUpdateProduct,
  Product,
} from "../../../../types/Product";

export const useProduct = () => {
  const queryClient = useQueryClient();
  const [name, setNameState] = useState("");
  const [category, setCategoryState] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);
  const deleteNameRef = useRef<{ name: string; category: string } | null>(
    null,
  );

  // Filter live (sesuai prototype): ganti filter kembali ke halaman 1
  const setName = (value: string) => {
    setNameState(value);
    setPage(1);
  };
  const setCategory = (value: string) => {
    setCategoryState(value);
    setPage(1);
  };

  // List + search + paging (5 baris/halaman, sesuai prototype)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", name, category, page],
    queryFn: async () => {
      const res = await productServices.getProducts({
        name,
        category,
        page,
        size: 5,
      });
      // Tempel selisih stok dummy (restok/jualan) di atas stok BE
      return { ...res.data, data: applyStockAdjustments(res.data.data) };
    },
  });

  // Total item terfilter (untuk "Menampilkan X–Y dari Z produk"):
  // dengan size 1, total_page BE sama dengan jumlah total
  const { data: countData } = useQuery({
    queryKey: ["products", "count", name, category],
    queryFn: async () => {
      const res = await productServices.getProducts({
        name,
        category,
        page: 1,
        size: 1,
      });
      return res.data.paging.total_page;
    },
  });

  // Daftar kategori dari semua produk (untuk select filter + form)
  const { data: categoriesData } = useQuery({
    queryKey: ["products", "categories"],
    queryFn: async () => {
      const res = await productServices.getProducts({ page: 1, size: 100 });
      return [...new Set(res.data.data.map((p) => p.category))].sort();
    },
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      categoryNew: "",
      buyPrice: 0,
      sellPrice: 0,
    },
    mode: "onBlur",
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (payload: ICreateProduct) =>
      productServices.createProduct(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: (res) => {
      const created = res.data.data;
      addActivity({
        kind: "product",
        label: `Produk ${created.name} ditambah`,
        detail: created.category,
      });
      setToaster({ type: "success", message: "Produk berhasil ditambah" });
      setFormOpen(false);
      refresh();
    },
  });

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: IUpdateProduct) => {
      // Form tidak punya field stok (prototype) — kirim stok ASLI dari BE,
      // bukan stok tampilan (yang sudah ditempel selisih dummy)
      const real = await productServices.getProduct(payload.id);
      return productServices.updateProduct(payload.id, {
        ...payload,
        stock: real.data.data.stock,
      });
    },
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: (_res, payload) => {
      addActivity({
        kind: "product",
        label: `Produk ${payload.name} diubah`,
        detail: payload.category,
      });
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
      const deleted = deleteNameRef.current;
      if (deleted) {
        addActivity({
          kind: "product",
          label: `Produk ${deleted.name} dihapus`,
          detail: deleted.category,
        });
        deleteNameRef.current = null;
      }
      setToaster({ type: "success", message: "Produk berhasil dihapus" });
      refresh();
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({
      name: "",
      category: "",
      categoryNew: "",
      buyPrice: 0,
      sellPrice: 0,
    });
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    form.reset({
      id: product.id,
      name: product.name,
      category: product.category,
      categoryNew: "",
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
    });
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteNameRef.current = {
      name: deleteTarget.name,
      category: deleteTarget.category,
    };
    mutateDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSubmit = (values: ProductFormValues) => {
    // Kategori baru (jika diisi) mengalahkan select
    const category =
      values.categoryNew?.trim() !== ""
        ? values.categoryNew!.trim()
        : values.category.trim();
    if (values.id !== undefined) {
      mutateUpdate({
        id: values.id,
        name: values.name,
        category,
        // Description tidak ada di form (prototype) — kirim nilai lama
        // supaya tidak berubah di BE
        description: editing?.description,
        buyPrice: values.buyPrice,
        sellPrice: values.sellPrice,
        stock: editing?.stock ?? 0, // ditimpa stok asli BE di mutationFn
      });
    } else {
      mutateCreate({
        name: values.name,
        category,
        buyPrice: values.buyPrice,
        sellPrice: values.sellPrice,
      }); // stock & description tidak dikirim
    }
  };

  return {
    products: data?.data ?? [],
    paging: data?.paging,
    totalItems: countData ?? 0,
    isLoading,
    isError,
    name,
    setName,
    category,
    setCategory,
    categories: categoriesData ?? [],
    page,
    setPage,
    form,
    formOpen,
    setFormOpen,
    editing,
    openCreate,
    openEdit,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    onSubmit: form.handleSubmit(handleSubmit),
    isSaving: isCreating || isUpdating,
    toaster,
  };
};
