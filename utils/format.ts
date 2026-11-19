export const formatCurrency = (value: number): string =>
  `Rp${value.toLocaleString("id-ID")}`;

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
