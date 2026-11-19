export const formatCurrency = (value: number): string =>
  `Rp${value.toLocaleString("id-ID")}`;

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// "19 November 2026" (bulan panjang, tanpa hari)
export const formatDateLong = (value: string): string =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// "Kamis, 19 November 2026" (dengan nama hari)
export const formatDateFull = (value: string | Date): string => {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// "19 November 2026 11:45" (tanggal + jam, untuk struk & rincian transaksi)
export const formatDateTime = (value: string): string => {
  const d = new Date(value);
  const date = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
};

// "Jum" / "Sab" / "Min" / ... (nama hari pendek, untuk grafik)
export const formatWeekdayShort = (value: string): string =>
  new Date(value).toLocaleDateString("id-ID", { weekday: "short" });

// "November" (nama bulan panjang)
export const formatMonthLong = (year: number, month: number): string =>
  new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "long" });

// "11:45" (jam lokal, untuk feed aktivitas)
export const formatTimeHM = (value: string): string =>
  new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

// "Rp385 rb" untuk nilai besar, "Rp500" untuk nilai kecil (label grafik)
export const formatShortCurrency = (value: number): string =>
  value >= 1000 ? `Rp${Math.round(value / 1000)} rb` : `Rp${value}`;

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
