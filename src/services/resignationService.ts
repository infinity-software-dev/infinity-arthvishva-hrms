import apiClient from "@/apis/client";

export interface ResignationPayload {
    reason: string;
    requestedLastWorkingDay: string;
}

export const submitResignationRequest = async (payload: ResignationPayload) => {
    try {
        const response = await apiClient.post("/api/app/resignation/apply", payload);

        return {
            success: true,
            message: response.data?.message || "Resignation submitted successfully",
            data: response.data?.data,
        };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            "Failed to submit resignation request. Please try again.";
        throw new Error(errorMessage);
    }
};

//  NEW: Fetch employee's resignation history
export const getResignationHistory = async () => {
    try {
        const response = await apiClient.get("/api/app/resignation/my-history");
        return response.data?.data || [];
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            "Failed to fetch resignation history.";
        throw new Error(errorMessage);
    }
};

//  NEW: Withdraw an active resignation
export const withdrawResignationRequest = async (id: string) => {
    try {
        const response = await apiClient.patch(`/api/app/resignation/withdraw/${id}`);

        return {
            success: true,
            message: response.data?.message || "Resignation withdrawn successfully.",
        };
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            "Failed to withdraw resignation.";
        throw new Error(errorMessage);
    }
};