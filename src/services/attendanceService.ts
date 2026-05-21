import apiClient from "@/apis/client";
import { WorkMode } from "@/hooks/useAttendanceSession";
import { AttendanceApiResponse } from "@/types/attendance";

export type BackendAttendanceStatus =
  | "P"
  | "A"
  | "WO"
  | "L"
  | "Coff"
  | "AUTO"
  | "H";

export interface DailyAttendanceRecord {
  uiStatus: "pending" | "in" | "completed" | "blocked";
  backendStatus: BackendAttendanceStatus;
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
  Coff: "Comp. Off",
  AUTO: "Auto Logged-Out",
  H: "Holiday",
};

export interface CheckoutData {
  todayWork: string;
  pendingWork: string;
  issuesFaced: string;
  reportParticipants: string[];
}

export interface ManagementEmployee {
  _id: string;
  name: string;
  employeeCode: string;
  role: string;
}

export interface CorrectionPayload {
  reason: string;
  requestedInTime: Date;
  requestedOutTime: Date;
  proofUrl?: string;
}

/**
 * Helper to handle inconsistent backend keys ('record' vs 'attendance')
 */
const extractRecord = (data: any) => data?.record || data?.attendance;

export async function fetchTodayAttendance(): Promise<DailyAttendanceRecord> {
  try {
    const response = await apiClient.get("/api/attendance/today");
    const data = response.data.data;
    const record = extractRecord(data);

    if (!record) {
      return {
        uiStatus: "pending",
        backendStatus: "P",
        checkInTime: null,
        checkOutTime: null,
        workMode: "Office",
        statusMessage: "Ready to Work",
      };
    }

    const { inTime, outTime, workMode, status } = record;

    let uiStatus: DailyAttendanceRecord["uiStatus"] = "pending";
    if (["H", "L", "WO", "A"].includes(status)) {
      uiStatus = "blocked";
    } else if (outTime || status === "AUTO") {
      uiStatus = "completed";
    } else if (inTime) {
      uiStatus = "in";
    }

    return {
      uiStatus,
      backendStatus: status as BackendAttendanceStatus,
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

export async function submitAttendancePunch(
  action: "in" | "out",
  latitude: number | null,
  longitude: number | null,
  workMode: WorkMode,
  checkoutData?: CheckoutData, // Add optional parameter here
): Promise<DailyAttendanceRecord> {
  try {
    const url =
      action === "in"
        ? "/api/attendance/check-in"
        : "/api/attendance/check-out";

    // Attach the checkoutData to the payload if it exists (for check-out)
    const payload =
      action === "in"
        ? { latitude, longitude, workMode }
        : { latitude, longitude, workMode, ...checkoutData };

    const response = await apiClient.post(url, payload);
    const data = response.data.data;

    const record = extractRecord(data);

    return {
      uiStatus: record.outTime ? "completed" : "in",
      backendStatus: record.status,
      checkInTime: record.inTime ? new Date(record.inTime) : null,
      checkOutTime: record.outTime ? new Date(record.outTime) : null,
      workMode: record.workMode,
      statusMessage:
        STATUS_LABELS[record.status as BackendAttendanceStatus] || "",
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Punch failed");
  }
}

export const getAttendanceSummary = async (
  fromDate: string,
  toDate: string,
): Promise<AttendanceApiResponse> => {
  try {
    const response = await apiClient.get(
      `/api/attendance/my-summary?from=${fromDate}&to=${toDate}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    throw error;
  }
};

export const fetchManagementEmployees = async (): Promise<
  ManagementEmployee[]
> => {
  try {
    // Adjust the endpoint URL if your actual route differs
    const response = await apiClient.get("/api/employees/management");

    // The backend uses ApiResponse, so the array is inside response.data.data
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching management employees:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch management employees",
    );
  }
};

export async function submitAttendanceCorrection(
  attendanceId: string,
  payload: CorrectionPayload,
) {
  try {
    const response = await apiClient.post(
      `/api/attendance/correction/${attendanceId}`,
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
    await apiClient.post("/api/attendance/track", { latitude, longitude });
  } catch (error) {
    console.error("Failed to sync location to server:", error);
  }
}
