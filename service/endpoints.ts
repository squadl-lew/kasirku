// Object endpoint — hanya service yang memakainya.
// Path mengikuti BE yang sudah jadi (doc/product.md): /api/products (jamak).
export const endpoint = {
  PRODUCT: "/api/products",
  SALE: "/api/sales",
  RESTOCK: "/api/restocks",
  EXPENSE: "/api/expenses",
  REPORT: "/api/reports",
} as const;
