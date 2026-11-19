export interface RestockItem {
  productId: number;
  productName: string;
  buyPrice: number; // harga beli saat restok (snapshot per item)
  quantity: number;
  subtotal: number;
}

export interface Restock {
  id: number;
  date: string; // YYYY-MM-DD — Tanggal belanja
  note?: string; // Catatan / toko tempat belanja
  items: RestockItem[];
  totalAmount: number; // Total Belanja
  createdAt: string;
}

export interface ICreateRestock {
  date: string;
  note?: string;
  items: Array<{ productId: number; quantity: number; buyPrice: number }>;
}

export interface RestockSearchParams {
  page: number;
  size: number;
}
