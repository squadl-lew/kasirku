// Jumlah item keranjang — dipakai badge menu Kasir di Sidebar & tabbar bawah.
// Keranjang sendiri tinggal di useSale; jumlahnya dibagikan lewat query data
// ["cart", "count"] supaya Sidebar (di luar route Kasir) ikut ter-update.
import { useQuery } from "@tanstack/react-query";

export const CART_COUNT_KEY = ["cart", "count"] as const;

export const useCartCount = () => {
  const { data } = useQuery({
    queryKey: CART_COUNT_KEY,
    queryFn: async () => 0,
    initialData: 0,
    // Jangan pernah refetch (mis. saat window focus) — nilainya hanya
    // diubah lewat setQueryData dari useSale, kalau tidak badge bisa reset 0
    staleTime: Infinity,
  });
  return data;
};
