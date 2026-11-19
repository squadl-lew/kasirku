import { z } from "zod";

// Satu schema untuk form create & edit. Bedanya:
// - create: id tidak ada (tidak dikirim ke BE)
// - edit: id ada; stok TIDAK ada di form (prototype tidak punya field stok —
//   stok dikirim dari data produk yang sedang diedit, lihat useProduct)
// Kategori diisi dari salah satu: select kategori yang sudah ada ATAU input
// "atau kategori baru" (kategori baru menang saat submit, lihat useProduct).
export const productSchema = z
  .object({
    id: z.number().positive().optional(),
    name: z.string().min(1, "Nama wajib diisi").max(100),
    category: z.string().max(100),
    categoryNew: z.string().max(100).optional(),
    buyPrice: z.coerce.number().int().min(0, "Harga beli minimal 0"),
    sellPrice: z.coerce.number().int().min(0, "Harga jual minimal 0"),
  })
  .refine(
    (v) =>
      v.category.trim() !== "" || (v.categoryNew?.trim() ?? "") !== "",
    {
      message: "Kategori wajib diisi",
      path: ["category"],
    },
  );

export type ProductFormValues = z.infer<typeof productSchema>;
