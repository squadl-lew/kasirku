import type { PaymentMethod } from "../../types/Sale";

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Tunai",
  QRIS: "QRIS",
  CARD: "Kartu",
};

export const paymentMethods: Array<{ value: PaymentMethod; label: string }> =
  [
    { value: "CASH", label: "Tunai" },
    { value: "QRIS", label: "QRIS" },
    { value: "CARD", label: "Kartu" },
  ];
