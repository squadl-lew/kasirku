import { z } from "zod";

export const restockSchema = z.object({
  date: z
    .string()
    .min(1, "Tanggal belanja wajib diisi")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Tanggal tidak valid"),
  note: z.string().max(255).optional(),
  items: z
    .array(
      z.object({
        productId: z.number().positive(),
        quantity: z.coerce.number().int().min(1, "Jumlah minimal 1"),
        buyPrice: z.coerce.number().int().min(0, "Harga beli minimal 0"),
      }),
    )
    .min(1, "Minimal 1 produk untuk restok"),
});

export type RestockFormValues = z.infer<typeof restockSchema>;
