import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportServices } from "../../../../service/report.service";
import {
  daysInMonth,
  formatDateFull,
  formatDateLong,
  todayISO,
} from "../../../../utils/format";

export type ReportMode = "today" | "all" | "range";
export type ReportGranularity = "day" | "month" | "year";

export const useReport = () => {
  const today = todayISO();
  const [mode, setModeState] = useState<ReportMode>("today");
  const [granularity, setGranularity] = useState<ReportGranularity>("day");
  // Input draft — baru berlaku setelah "Terapkan Rentang" diklik
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startMonth, setStartMonth] = useState(today.slice(0, 7)); // YYYY-MM
  const [endMonth, setEndMonth] = useState(today.slice(0, 7));
  const [startYear, setStartYear] = useState(today.slice(0, 4)); // YYYY
  const [endYear, setEndYear] = useState(today.slice(0, 4));
  // Rentang yang sedang diterapkan
  const [appliedRange, setAppliedRange] = useState({
    start: today,
    end: today,
  });

  const applyRange = () => {
    const monthFallback = today.slice(0, 7);
    const yearFallback = today.slice(0, 4);
    let start: string;
    let end: string;
    if (granularity === "month") {
      const sm = startMonth || monthFallback;
      const em = endMonth || monthFallback;
      start = `${sm}-01`;
      end = `${em}-${daysInMonth(em)}`;
    } else if (granularity === "year") {
      const sy = startYear || yearFallback;
      const ey = endYear || yearFallback;
      start = `${sy}-01-01`;
      end = `${ey}-12-31`;
    } else {
      start = startDate || today;
      end = endDate || today;
    }
    // Rentang terbalik otomatis ditukar
    if (start > end) [start, end] = [end, start];
    setAppliedRange({ start, end });
  };

  const setMode = (next: ReportMode) => {
    setModeState(next);
    if (next === "today") setAppliedRange({ start: today, end: today });
  };

  // Label periode ala prototype
  const periodLabel =
    mode === "today"
      ? formatDateFull(today)
      : mode === "all"
        ? "Semua transaksi"
        : `${formatDateLong(appliedRange.start)} – ${formatDateLong(appliedRange.end)}`;

  const { data: report, isLoading } = useQuery({
    queryKey: ["reports", mode, appliedRange.start, appliedRange.end],
    queryFn: async () => {
      if (mode === "all") {
        const res = await reportServices.getAllRangeReport();
        return res.data.data;
      }
      const res = await reportServices.getRangeReport(
        appliedRange.start,
        appliedRange.end,
      );
      return res.data.data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ["reports", "transactions", report?.startDate, report?.endDate],
    queryFn: async () => {
      const res = await reportServices.getRangeTransactions(
        report!.startDate,
        report!.endDate,
      );
      return res.data.data;
    },
    enabled: report !== undefined,
  });

  return {
    mode,
    setMode,
    granularity,
    setGranularity,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startMonth,
    setStartMonth,
    endMonth,
    setEndMonth,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    applyRange,
    periodLabel,
    report,
    transactions: transactions ?? [],
    isLoading,
  };
};
