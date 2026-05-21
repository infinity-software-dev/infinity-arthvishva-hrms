import { useState, useEffect, useCallback } from "react";
import {
  fetchTodayAttendance,
  submitAttendancePunch,
  BackendAttendanceStatus,
  CheckoutData,
} from "@/services/attendanceService";
import { getCurrentLocation } from "@/utils/LocationHelper";

export type AttendanceStatus =
  | "pending"
  | "in"
  | "loading"
  | "completed"
  | "blocked";
export type WorkMode = "Office" | "Field" | "WFH";

export function useAttendanceSession() {
  const [status, setStatus] = useState<AttendanceStatus>("loading");
  const [workMode, setWorkMode] = useState<WorkMode>("Office");
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  const loadSession = async () => {
    try {
      const record = await fetchTodayAttendance();
      setStatus(record.uiStatus);
      setWorkMode(record.workMode);
      setCheckInTime(record.checkInTime);
      setCheckOutTime(record.checkOutTime);
      setStatusMessage(record.statusMessage);
    } catch (err) {
      setStatus("pending");
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAttendanceAction = useCallback(
    async (checkoutData?: CheckoutData) => {
      if (status === "loading" || status === "completed") return;

      const actionType = status === "pending" ? "in" : "out";
      const previousStatus = status;
      setStatus("loading");

      try {
        const location = await getCurrentLocation();

        const record = await submitAttendancePunch(
          actionType,
          location?.latitude || null,
          location?.longitude || null,
          workMode,
          checkoutData, // Pass the form data to the service
        );

        setStatus(record.uiStatus);
        setCheckInTime(record.checkInTime);
        setCheckOutTime(record.checkOutTime);
        setStatusMessage(record.statusMessage);
      } catch (error) {
        console.error("Punch Error:", error);
        setStatus(previousStatus);
      }
    },
    [status, workMode],
  );

  const getTotalTimeLogged = () => {
    if (!checkInTime || !checkOutTime) return "--";
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  };

  const formatPunchTime = (date: Date | null) => {
    return date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--";
  };

  return {
    status,
    statusMessage,
    workMode,
    setWorkMode,
    currentTime,
    checkInTime,
    checkOutTime,
    handleAttendanceAction,
    getTotalTimeLogged,
    formatPunchTime,
  };
}
