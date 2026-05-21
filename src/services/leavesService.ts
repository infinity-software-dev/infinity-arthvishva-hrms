// services/leaveService.ts

import apiClient from "@/apis/client";

export interface LeaveRequestPayload {
  leaveType: string;
  fromDate: string;
  toDate: string;
  isHalfDay: boolean;
  halfDayShift?: "Morning" | "Afternoon";
  totalDays: number;
  reason: string;
}

export const fetchMyLeaves = async () => {
  try {
    const response = await apiClient.get("/api/leaves/my?limit=50");
    const payload = response.data?.data;

    // 1. UPDATE THIS FALLBACK
    if (!payload) {
      return {
        leaves: [],
        summary: {
          approved: 0,
          pending: 0,
          total: 0,
          rejected: 0,
          cancelled: 0,
        },
      };
    }

    return {
      leaves: payload.leaves || [],
      summary: {
        approved: payload.summary?.approved || 0,
        pending: payload.summary?.pending || 0,
        total: payload.summary?.total || 0,
        rejected: payload.summary?.rejected || 0,
        cancelled: payload.summary?.cancelled || 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch leaves data:", error);

    // 2. UPDATE THIS FALLBACK TOO
    return {
      leaves: [],
      summary: { approved: 0, pending: 0, total: 0, rejected: 0, cancelled: 0 },
    };
  }
};

export const submitLeaveRequest = async (payload: LeaveRequestPayload) => {
  try {
    // Map frontend state names to exactly match backend req.body expectations
    const backendPayload = {
      leaveType: payload.leaveType,
      startDate: payload.fromDate,
      endDate: payload.toDate,
      reason: payload.reason,
      halfDay: payload.isHalfDay,
      halfDayPeriod: payload.isHalfDay ? payload.halfDayShift : "",
    };

    // Replace "/api/leaves/apply" with your exact backend route
    const response = await apiClient.post("/api/leaves/apply", backendPayload);

    return {
      success: true,
      message: response.data?.message || "Leave applied successfully",
      data: response.data?.data,
    };
  } catch (error: any) {
    // console.error("Submit Leave Error:", error);

    // Extract the exact ApiError message thrown by your Express controller
    const errorMessage =
      error.response?.data?.message ||
      "Failed to submit leave request. Please try again.";

    // Throw the error so the hook can catch it and show it in the Alert
    throw new Error(errorMessage);
  }
};
