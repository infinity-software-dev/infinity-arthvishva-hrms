import { useState, useEffect, useCallback } from "react";
import { getAttendanceSummary } from "../services/attendanceService";
import { SummaryStats, AttendanceDayRecord } from "../types/attendance";

export const useAttendanceSummary = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [records, setRecords] = useState<AttendanceDayRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthData = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);

    const year = date.getFullYear();
    const month = date.getMonth();

    // Format to YYYY-MM-DD
    const fromDate = new Date(year, month, 1).toLocaleDateString("en-CA");
    const toDate = new Date(year, month + 1, 0).toLocaleDateString("en-CA");

    try {
      const data = await getAttendanceSummary(fromDate, toDate);
      // console.log(data)
      setSummaryStats(data.summary);

      // FIX: Sort records chronologically (1 to 31)
      const sortedRecords = [...data.records].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setRecords(sortedRecords);
    } catch (err: any) {
      setError(err?.message || "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthData(currentDate);
  }, [currentDate, fetchMonthData]);

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const goToPrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const formattedMonthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return {
    summaryStats,
    records,
    loading,
    error,
    formattedMonthYear,
    goToNextMonth,
    goToPrevMonth,
    refetch: () => fetchMonthData(currentDate),
  };
};
