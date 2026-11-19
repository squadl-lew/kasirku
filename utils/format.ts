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

// YYYY-MM-DD dari Date/ISO string, memakai waktu lokal (bukan UTC —
// toISOString() bisa menggeser tanggal untuk zona WIB)
export const toLocalDateISO = (value: string | Date): string => {
  const d = typeof value === "string" ? new Date(value) : value;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export const addDaysISO = (dateISO: string, days: number): string => {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toLocalDateISO(d);
};

export const daysInMonth = (monthISO: string): number => {
  const [y, m] = monthISO.split("-").map(Number);
  return new Date(y, m, 0).getDate();
};
