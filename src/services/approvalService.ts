// approvalService.ts
import apiClient from "@/apis/client";

export interface HistoryQueryParams {
    page: number;
    limit: number;
    status?: 'Approved' | 'Rejected' | 'Cancelled' | string;
}

export const fetchManagerDetailedRequests = async (managerId: string) => {
    try {
        // Hits the detailed-requests endpoint in your EmployeeController
        const res = await apiClient.get(`/api/app/employee/${managerId}/detailed-requests`);

        // Returns the clean data array parsed by the backend (.lean() array of LeaveHistory)
        return res.data;
    } catch (error) {
        console.error("Error fetching manager detailed leave requests:", error);
        throw error;
    }
};

export const fetchManagerRequestHistory = async (managerId: string, params: HistoryQueryParams) => {
    try {
        const res = await apiClient.get(`/api/app/employee/${managerId}/requests-history`, {
            params: {
                page: params.page,
                limit: params.limit,
                // Axios will automatically drop keys with undefined values
                status: params.status,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching manager request action history:", error);
        throw error;
    }
};

/**
 * Sends a Manager approval action for a specific leave request step.
 * @param managerId Logged-in manager's ID
 * @param leaveId Target leave history tracking ID
 */
export const approveLeaveRequestByManager = async (managerId: string, leaveId: string) => {
    try {
        const res = await apiClient.patch(`/api/app/employee/${managerId}/leaves/${leaveId}/approve`);
        return res.data;
    } catch (error) {
        console.error("API error approving leave request:", error);
        throw error;
    }
};

/**
 * Sends a Manager rejection action along with mandatory justification remarks.
 * @param managerId Logged-in manager's ID
 * @param leaveId Target leave history tracking ID
 * @param remarks Explanatory cancellation comment string
 */
export const rejectLeaveRequestByManager = async (managerId: string, leaveId: string, remarks: string) => {
    try {
        const res = await apiClient.patch(`/api/app/employee/${managerId}/leaves/${leaveId}/reject`, {
            remarks,
        });
        return res.data;
    } catch (error) {
        console.error("API error rejecting leave request:", error);
        throw error;
    }
};