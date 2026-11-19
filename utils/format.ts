export const formatCurrency = (value: number): string =>
  `Rp${value.toLocaleString("id-ID")}`;

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Tanggal hari ini (waktu lokal) format YYYY-MM-DD
export const todayISO = (): string => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};
