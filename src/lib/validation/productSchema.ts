import { z } from "zod";

// Satu schema untuk form create & edit. Bedanya:
// - create: id & stock tidak ada (tidak dikirim ke BE)
// - edit: id ada, stock wajib (aturan BE) — dicek lewat refine
export const productSchema = z
  .object({
    id: z.number().positive().optional(),
    name: z.string().min(1, "Nama wajib diisi").max(100),
    category: z.string().min(1, "Kategori wajib diisi").max(100),
    description: z.string().max(255).optional(),
    buyPrice: z.coerce.number().int().min(0, "Harga beli minimal 0"),
    sellPrice: z.coerce.number().int().min(0, "Harga jual minimal 0"),
    stock: z.coerce.number().int().min(0, "Stok minimal 0").optional(),
  })
  .refine((v) => v.id === undefined || v.stock !== undefined, {
    message: "Stok wajib diisi",
    path: ["stock"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;
