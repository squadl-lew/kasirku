import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportServices } from "../../../../service/report.service";
import { daysInMonth, todayISO } from "../../../../utils/format";

type Mode = "today" | "all" | "range";
type Granularity = "day" | "month" | "year";

export const useReport = () => {
  const today = todayISO();
  const [mode, setMode] = useState<Mode>("today");
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7)); // YYYY-MM
  const [year, setYear] = useState(today.slice(0, 4)); // YYYY

  // Rentang efektif dari mode + granularity
  const range: { start: string; end: string } = (() => {
    if (mode === "today") return { start: today, end: today };
    if (mode === "range" && granularity === "month")
      return { start: `${month}-01`, end: `${month}-${daysInMonth(month)}` };
    if (mode === "range" && granularity === "year")
      return { start: `${year}-01-01`, end: `${year}-12-31` };
    return { start: startDate, end: endDate };
  })();

  const { data: report, isLoading } = useQuery({
    queryKey: ["reports", mode, granularity, startDate, endDate, month, year],
    queryFn: async () => {
      if (mode === "all") {
        const res = await reportServices.getAllRangeReport();
        return res.data.data;
      }
      const res = await reportServices.getRangeReport(range.start, range.end);
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
    month,
    setMonth,
    year,
    setYear,
    report,
    transactions: transactions ?? [],
    isLoading,
  };
};
