import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saleServices } from "../../../../service/sale.service";
import { productServices } from "../../../../service/product.service";
import { applyStockAdjustments } from "../../../lib/dummy/stockAdjustments";
import { addActivity } from "../../../lib/dummy/activityLog";
import { CART_COUNT_KEY } from "../../../lib/cartCount";
import { paymentMethodLabels } from "../../../lib/paymentMethod";
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
  const [category, setCategory] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<{
    cashReceived: number;
    change: number;
  } | null>(null);
  const [toaster, setToaster] = useState<ToasterState | null>(null);
  const lastPaymentRef = useRef<{ cashReceived?: number }>({});

  // Produk dari API beneran, hanya yang stok > 0 (sesuai prototype)
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", "kasir"],
    queryFn: async () => {
      const res = await productServices.getProducts({ page: 1, size: 100 });
      // Tempel selisih stok dummy, baru saring yang stok > 0
      return applyStockAdjustments(res.data.data).filter((p) => p.stock > 0);
    },
  });

  // Pil kategori: hanya kategori produk yang stok > 0
  const categories = useMemo(
    () => [...new Set((productsData ?? []).map((p) => p.category))].sort(),
    [productsData],
  );

  const products = useMemo(
    () =>
      (productsData ?? []).filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          (category === "" || p.category === category),
      ),
    [productsData, search, category],
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.sellPrice * item.quantity,
    0,
  );

  // Badge keranjang di Sidebar & tabbar (jumlah total item)
  useEffect(() => {
    queryClient.setQueryData(
      CART_COUNT_KEY,
      cart.reduce((sum, i) => sum + i.quantity, 0),
    );
  }, [cart, queryClient]);

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
      const sale = res.data.data;
      const cash = lastPaymentRef.current.cashReceived;
      setReceiptPayment(
        sale.paymentMethod === "CASH" && cash !== undefined
          ? { cashReceived: cash, change: cash - totalAmount }
          : null,
      );
      addActivity({
        kind: "sale",
        label: `Penjualan ${sale.invoiceNumber} (${sale.items.length} item)`,
        detail: `${sale.items.length} item · ${paymentMethodLabels[sale.paymentMethod]}`,
        amount: sale.totalAmount,
      });
      setReceipt(sale);
      setPaymentOpen(false);
      setCart([]);
      form.reset({ paymentMethod: "CASH" });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const addToCart = (product: Product) => {
    const found = cart.find((i) => i.product.id === product.id);
    if (found && found.quantity >= product.stock) {
      setToaster({
        type: "error",
        message: `Stok "${product.name}" tidak cukup`,
      });
      return;
    }
    setCart((prev) => {
      if (found) {
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
    const item = cart.find((i) => i.product.id === productId);
    if (item && quantity > item.product.stock) {
      setToaster({
        type: "error",
        message: `Stok "${item.product.name}" tidak cukup`,
      });
      quantity = item.product.stock;
    }
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

  const clearCart = () => setCart([]);

  const handleCheckout = (values: SaleFormValues) => {
    if (cart.length === 0) return;
    lastPaymentRef.current = { cashReceived: values.cashReceived };
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
    categories,
    isLoading,
    search,
    setSearch,
    category,
    setCategory,
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    totalAmount,
    paymentOpen,
    setPaymentOpen,
    receipt,
    setReceipt,
    receiptPayment,
    form,
    cashReceived,
    change,
    onCheckout: form.handleSubmit(handleCheckout),
    isCheckingOut,
    toaster,
  };
};
