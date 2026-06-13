import { useState, useEffect, useCallback } from "react";
import { fetchMonthlyAttendance } from "../services/attendanceService";
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
    const month = date.getMonth() + 1;

    try {
      const data = await fetchMonthlyAttendance(year, month);
      setSummaryStats(data.summary);
      setRecords(data.records);
    } catch (err: any) {
      setError(err?.message || "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthData(currentDate);
  }, [currentDate, fetchMonthData]);

  //  NEW: Create the function HERE where setRecords exists
  const markCorrectionAsRequested = useCallback((attendanceId: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((day) => {
        if (day.myAttendance?._id === attendanceId) {
          return {
            ...day,
            myAttendance: {
              ...day.myAttendance,
              correctionRequested: true,
              correctionStatus: 'Pending',
            },
          };
        }
        return day;
      })
    );
  }, []);

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToPrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
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
    markCorrectionAsRequested, //  Export it so the screen can use it!
  };
};