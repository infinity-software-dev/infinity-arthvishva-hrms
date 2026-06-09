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
  consumedLedgerIds?: string[]; // NEW: Array of specific tokens to burn
}

export const fetchMyLeaves = async () => {
  try {
    const response = await apiClient.get("/api/app/leaves/my?limit=50");
    const payload = response.data?.data;

    //  UPDATE THIS FALLBACK
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

    // UPDATE THIS FALLBACK TOO
    return {
      leaves: [],
      summary: { approved: 0, pending: 0, total: 0, rejected: 0, cancelled: 0 },
    };
  }
};

export const fetchActiveLedgers = async () => {
  try {
    const response = await apiClient.get("/api/app/leaves/ledger?status=Active");
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch active ledger array:", error);
    return [];
  }
};

export const submitLeaveRequest = async (payload: LeaveRequestPayload) => {
  try {
    const backendPayload = {
      leaveCategory: payload.leaveType,      // Maps to leaveCategory
      startDate: payload.fromDate,
      endDate: payload.toDate,
      totalDays: payload.totalDays,          // Must be included
      isHalfDay: payload.isHalfDay,          // Maps to isHalfDay
      halfDayPeriod: payload.isHalfDay ? payload.halfDayShift : "",
      reason: payload.reason,
      consumedLedgerIds: payload.consumedLedgerIds,
    };

    const response = await apiClient.post("/api/app/leaves/apply", backendPayload);

    return {
      success: true,
      message: response.data?.message || "Leave applied successfully",
      data: response.data?.data,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to submit leave request. Please try again.";
    throw new Error(errorMessage);
  }
};
