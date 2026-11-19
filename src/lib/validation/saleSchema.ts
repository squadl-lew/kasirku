import { z } from "zod";

export const saleSchema = z
  .object({
    paymentMethod: z.enum(["CASH", "QRIS", "CARD"]),
    // uang diterima — hanya wajib kalau Tunai
    cashReceived: z.coerce.number().int().min(0).optional(),
  })
  .refine(
    (v) =>
      v.paymentMethod !== "CASH" ||
      (v.cashReceived !== undefined && v.cashReceived >= 0),
    { message: "Uang diterima wajib diisi", path: ["cashReceived"] },
  );

export type SaleFormValues = z.infer<typeof saleSchema>;
