import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number().positive().optional(),
  title: z.string().min(1, "Keterangan wajib diisi").max(100),
  category: z.string().min(1, "Kategori wajib diisi").max(100),
  amount: z.coerce.number().int().min(1, "Harga minimal Rp1"),
  description: z.string().max(255).optional(),
  date: z
    .string()
    .min(1, "Tanggal wajib diisi")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Tanggal tidak valid"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
