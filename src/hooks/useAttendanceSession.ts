import { useState, useEffect, useCallback } from "react";
import {
  fetchTodayAttendance,
  CheckoutData,
  submitCheckIn,
  submitCheckOut,
} from "@/services/attendanceService";
import { getCurrentLocation } from "@/utils/LocationHelper";

export type AttendanceStatus = "pending" | "in" | "loading" | "completed" | "blocked";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const loadSession = async () => {
    try {
      const record = await fetchTodayAttendance();

      setStatus(record.uiStatus);
      setWorkMode(record.workMode);
      setCheckInTime(record.checkInTime);
      setCheckOutTime(record.checkOutTime);
      setStatusMessage(record.statusMessage);
    } catch (err) {
      console.error("Load Session Failed:", err); //  ADD THIS
      setModalTitle("Error");
      setModalMessage("Failed to load attendance data. Please try restart the app.");
      setModalVisible(true);
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

  const handleCheckInPunch = useCallback(async () => {
    // 1. Lock the button: Prevent double-swipes or swiping if already checked in
    if (status === "loading" || status === "in" || status === "completed") return;

    const previousStatus = status;

    try {
      // 2. Fetch fresh GPS coordinates right when they swipe (prevents stale data)
      const location = await getCurrentLocation();
      const lat = location?.latitude || null;
      const lon = location?.longitude || null;

      // 3. Strict Validation: Office mode requires location
      if (workMode === "Office" && (!lat || !lon)) {
        setModalTitle("Location Required");
        setModalMessage("Please enable GPS to check in from the office.");
        setModalVisible(true);

        setStatus(previousStatus);
        return;
      }

      // 4. Call the dedicated Check-In API
      const newRecord = await submitCheckIn(lat, lon, workMode);

      // 5. Update UI on success
      setStatus(newRecord.uiStatus); // Safely moves to "in"
      setCheckInTime(newRecord.checkInTime);
      setStatusMessage(newRecord.statusMessage);

    } catch (error: any) {
      console.error("Check-In Error:", error);

      // Use custom modal instead of Alert
      setModalTitle("Check-In Failed");
      setModalMessage(error.message || "Something went wrong.");
      setModalVisible(true);

      // Rollback the UI state so the swipe button resets and they can try again
      setStatus(previousStatus);
    }
  }, [status, workMode]);

  const handleCheckOutPunch = useCallback(async (checkoutData: CheckoutData) => {
    // 1. Lock the button: Only allow this action if they are currently checked in
    if (status !== "in") return;

    const previousStatus = status;

    try {
      // 2. Fetch fresh GPS coordinates right when they swipe
      const location = await getCurrentLocation();
      const lat = location?.latitude || null;
      const lon = location?.longitude || null;

      // 3. Strict Validation: Office mode requires location
      if (workMode === "Office" && (!lat || !lon)) {
        // Use custom modal instead of Alert
        setModalTitle("Location Required");
        setModalMessage("Please enable GPS to check out from the office.");
        setModalVisible(true);

        setStatus(previousStatus);
        return;
      }

      // 4. Call the dedicated Check-Out API with the report data
      const newRecord = await submitCheckOut(lat, lon, workMode, checkoutData);

      // 5. Update UI on success
      setStatus(newRecord.uiStatus); // Safely moves to "completed"
      setCheckOutTime(newRecord.checkOutTime);
      setStatusMessage(newRecord.statusMessage);

    } catch (error: any) {
      console.error("Check-Out Error:", error);

      // Use custom modal instead of Alert
      setModalTitle("Check-Out Failed");
      setModalMessage(error.message || "Something went wrong.");
      setModalVisible(true);

      // Rollback the UI state so the swipe button resets
      setStatus(previousStatus);
    }
  }, [status, workMode]);

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
    modalVisible,
    modalTitle,
    modalMessage,
    setWorkMode,
    currentTime,
    checkInTime,
    checkOutTime,
    setModalVisible,
    setModalTitle,
    setModalMessage,
    handleCheckInPunch,
    handleCheckOutPunch,
    getTotalTimeLogged,
    formatPunchTime,
  };
}
