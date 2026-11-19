import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saleServices } from "../../../../service/sale.service";
import { productServices } from "../../../../service/product.service";
import {
  saleSchema,
  type SaleFormValues,
} from "../../../lib/validation/saleSchema";
import type { ToasterState } from "../../ui/Toaster";
import type { CartItem, ICreateSale, Sale } from "../../../../types/Sale";
import type { Product } from "../../../../types/Product";

export const useSale = () => {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);

  // Produk dari API beneran, hanya yang stok > 0 (sesuai prototype)
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", "kasir"],
    queryFn: async () => {
      const res = await productServices.getProducts({ page: 1, size: 100 });
      return res.data.data.filter((p) => p.stock > 0);
    },
  });

  const products = useMemo(
    () =>
      (productsData ?? []).filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [productsData, search],
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.sellPrice * item.quantity,
    0,
  );

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: { paymentMethod: "CASH" },
    mode: "onBlur",
  });
  const cashReceived = form.watch("cashReceived") ?? 0;
  const change = cashReceived - totalAmount;

  const { mutate: mutateCheckout, isPending: isCheckingOut } = useMutation({
    mutationFn: (payload: ICreateSale) => saleServices.createSale(payload),
    onError: (error) =>
      setToaster({ type: "error", message: error.message }),
    onSuccess: (res) => {
      setReceipt(res.data.data);
      setPaymentOpen(false);
      setCart([]);
      form.reset({ paymentMethod: "CASH" });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        if (found.quantity >= product.stock) return prev; // tidak boleh melebihi stok
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i,
          ),
    );
  };

  const handleCheckout = (values: SaleFormValues) => {
    if (cart.length === 0) return;
    mutateCheckout({
      paymentMethod: values.paymentMethod,
      items: cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    });
  };

  return {
    products,
    isLoading,
    search,
    setSearch,
    cart,
    addToCart,
    updateQuantity,
    totalAmount,
    paymentOpen,
    setPaymentOpen,
    receipt,
    setReceipt,
    form,
    cashReceived,
    change,
    onCheckout: form.handleSubmit(handleCheckout),
    isCheckingOut,
    toaster,
  };
};
