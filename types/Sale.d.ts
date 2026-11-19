import type { Product } from "./Product";

export type PaymentMethod = "CASH" | "QRIS" | "TRANSFER";

export interface SaleItem {
  productId: number;
  productName: string;
  price: number; // harga jual saat transaksi (snapshot)
  buyPrice: number; // harga beli saat transaksi (snapshot, untuk laba)
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  invoiceNumber: string; // INV-YYYYMMDD-0001
  paymentMethod: PaymentMethod;
  totalAmount: number;
  totalProfit: number;
  items: SaleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSale {
  paymentMethod: PaymentMethod;
  items: Array<{ productId: number; quantity: number }>;
}

export interface SaleSearchParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  page: number;
  size: number;
}

// Keranjang — hanya ada di FE, tidak dikirim ke BE
export interface CartItem {
  product: Product;
  quantity: number;
}
