import { z } from "zod";

export const restockSchema = z.object({
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
