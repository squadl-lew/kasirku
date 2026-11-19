export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Create: tanpa stock (produk baru mulai stok 0, sesuai prototype)
export interface ICreateProduct {
  name: string;
  category: string;
  description?: string;
  buyPrice: number;
  sellPrice: number;
}

// Update: stock wajib (aturan BE)
export interface IUpdateProduct {
  id: number;
  name: string;
  category: string;
  description?: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

export interface ProductSearchParams {
  name?: string;
  category?: string;
  page: number;
  size: number;
}
