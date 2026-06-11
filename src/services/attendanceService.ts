import apiClient from "@/apis/client";
import { WorkMode } from "@/hooks/useAttendanceSession";
import { AttendanceApiResponse } from "@/types/attendance";

export type BackendAttendanceStatus =  "P" | "A" | "WO" | "L" | "CompOff" | "AUTO" | "H" | "Half";

export interface DailyAttendanceRecord {
  uiStatus: "pending" | "in" | "completed" | "blocked";
  status: BackendAttendanceStatus;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  workMode: WorkMode;
  statusMessage: string;
}

const STATUS_LABELS: Record<BackendAttendanceStatus, string> = {
  P: "Present",
  A: "Absent",
  WO: "Week Off",
  L: "On Leave",
  CompOff: "Comp. Off",
  AUTO: "Auto Logged-Out",
  H: "Holiday",
  Half: "Half Day",
};

export interface CheckoutData {
  todayWork: string;
  pendingWork: string;
  issuesFaced: string;
}

export interface ManagementEmployee {
  _id: string;
  name: string;
  position: string;
}

export interface CorrectionPayload {
  reason: string;
  requestedInTime: Date;
  requestedOutTime: Date;
  proofUrl?: string;
}

/**
 * Helper to handle inconsistent backend keys 'attendance'
 */
const extractRecord = (data: any) => {
  return data?.record || null;
};

export async function fetchTodayAttendance(): Promise<DailyAttendanceRecord> {
  try {
    const response = await apiClient.get("/api/app/attendance/today-status");
    const data = response.data.data;
    const record = extractRecord(data);

    if (!record) {
      return {
        uiStatus: "pending",
        status: "P",
        checkInTime: null,
        checkOutTime: null,
        workMode: "Office",
        statusMessage: "Ready to Work",
      };
    }

    const { inTime, outTime, workMode, status } = record;

    let uiStatus: DailyAttendanceRecord["uiStatus"] = "pending";
    if (["L", "A"].includes(status)) { // Removed 'H' and 'WO'
      uiStatus = "blocked";
    } else if (outTime || status === "AUTO") {
      uiStatus = "completed";
    } else if (inTime) {
      uiStatus = "in";
    }

    return {
      uiStatus,
      status: status as BackendAttendanceStatus,
      checkInTime: inTime ? new Date(inTime) : null,
      checkOutTime: outTime ? new Date(outTime) : null,
      workMode: workMode || "Office",
      statusMessage:
        STATUS_LABELS[status as BackendAttendanceStatus] || "Unknown",
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

export const fetchMonthlyAttendance = async (year: number, month: number) => {
  try {
    // Passes the exact year and month to the backend
    const res = await apiClient.get(`/api/app/attendance/monthly?year=${year}&month=${month}`);

    // Returns { summary: {...}, records: [...] }
    return res.data.data;
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    throw error;
  }
};

// Used in attendance check-out screen to fetch list of managers for EOD report
export const fetchManagementEmployees = async (): Promise<
  ManagementEmployee
> => {
  try {
    // Adjust the endpoint URL if your actual route differs
    const response = await apiClient.get("/api/app/attendance/reporting-managers");

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching management employees:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch management employees",
    );
  }
};

export async function submitCheckIn(
  latitude: number | null,
  longitude: number | null,
  workMode: WorkMode
): Promise<DailyAttendanceRecord> {
  try {
    const payload = { latitude, longitude, workMode };

    // Hardcoded URL for the check-in route
    const response = await apiClient.post("/api/app/attendance/check-in", payload);
    const data = response.data.data;

    const record = extractRecord(data);

    return {
      // Safely hardcoded since this is strictly a check-in action
      uiStatus: "in",
      status: record.status || "P",
      checkInTime: record.inTime ? new Date(record.inTime) : null,

      // Check-out time will always be null at the exact moment of check-in
      checkOutTime: null,

      workMode: record.workMode || "Office",
      statusMessage: STATUS_LABELS[record.status as BackendAttendanceStatus] || "Present",
    };
  } catch (error: any) {
    // Specific error message for this exact flow
    throw new Error(error.response?.data?.message || "Check-in failed");
  }
}

export async function submitCheckOut(
  latitude: number | null,
  longitude: number | null,
  workMode: WorkMode,
  checkoutData: CheckoutData // Require this if your EOD report is mandatory
): Promise<DailyAttendanceRecord> {
  try {
    const payload = { latitude, longitude, workMode, ...checkoutData };

    // Hardcoded URL for the check-out route
    const response = await apiClient.post("/api/app/attendance/check-out", payload);
    const data = response.data.data;

    const record = extractRecord(data);

    return {
      // Safely hardcoded since this is strictly a check-out action
      uiStatus: "completed",
      status: record.status || "P",
      checkInTime: record.inTime ? new Date(record.inTime) : null,
      checkOutTime: record.outTime ? new Date(record.outTime) : null,
      workMode: record.workMode || "Office",
      statusMessage: STATUS_LABELS[record.status as BackendAttendanceStatus] || "Present",
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Check-out failed");
  }
}

export async function submitAttendanceCorrection(
  attendanceId: string,
  payload: CorrectionPayload,
) {
  try {
    const response = await apiClient.post(
      `/api/app/attendance/correction/${attendanceId}`,
      {
        reason: payload.reason,
        requestedInTime: payload.requestedInTime.toISOString(),
        requestedOutTime: payload.requestedOutTime.toISOString(),
        proofUrl: payload.proofUrl || "",
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Correction Request Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit correction",
    );
  }
}

export async function trackLocation(
  latitude: number,
  longitude: number,
): Promise<void> {
  try {
    await apiClient.post("/api/app/attendance/track-location", { latitude, longitude });
  } catch (error) {
    console.error("Failed to sync location to server:", error);
  }
}
