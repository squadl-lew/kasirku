// DUMMY ONLY — activity log di localStorage untuk feed "Aktivitas terakhir"
// di Dashboard. Dicatat saat mutasi berhasil: tambah/edit/hapus produk,
// checkout kasir, restok, tambah/hapus pengeluaran manual.
// Expense dari restok TIDAK dicatat terpisah (sudah tercakup aktivitas restok).
import { useQuery } from "@tanstack/react-query";

export type ActivityKind = "sale" | "expense" | "restock" | "product";

export interface Activity {
  id: number;
  kind: ActivityKind;
  label: string; // mis. "Penjualan INV-20261119-004 (3 item)"
  detail: string; // mis. "3 item · Kartu" / "Belanja Stok" / "Minuman"
  amount?: number; // + penjualan, - pengeluaran/restok; kosong untuk produk
  createdAt: string; // ISO
}

const KEY = "kasirku-dummy-activities";

export const getActivities = (): Activity[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Activity[];
  } catch {
    return [];
  }
};

export const addActivity = (
  input: Omit<Activity, "id" | "createdAt">,
): Activity => {
  const activity: Activity = {
    ...input,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  const all = [activity, ...getActivities()].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(all));
  return activity;
};

// Hook baca 8 aktivitas terbaru (untuk Dashboard)
export const useActivities = () => {
  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: async () =>
      [...getActivities()]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 8),
  });
  return data ?? [];
};
