// Object endpoint — hanya service yang memakainya.
// baseURL (VITE_API_PATH) sudah mengandung /api, jadi path di sini
// TIDAK diawali /api lagi. Path mengikuti BE (doc/product.md): /products (jamak).
export const endpoint = {
  PRODUCT: "/products",
  SALE: "/sales",
  RESTOCK: "/restocks",
  EXPENSE: "/expenses",
  REPORT: "/reports",
} as const;
