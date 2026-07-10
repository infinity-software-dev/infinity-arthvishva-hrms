import apiClient from "@/apis/client";

// Define the shape of the data returned by your backend .select()
export interface BirthdayEmployee {
  _id: string;
  name: string;
  employeeCode: string;
  profileImageUrl?: string;
  department?: string;
  dateOfBirth: string;
}

export interface BirthdaysResponse {
  today: BirthdayEmployee[];
  tomorrow: BirthdayEmployee[];
  upcoming: BirthdayEmployee[];
}

/**
 * Fetches today's and tomorrow's active employee birthdays.
 */
export const fetchUpcomingBirthdays = async (): Promise<BirthdaysResponse> => {
  try {
    const response = await apiClient.get("/api/app/employee/birthdays/upcoming");

    // ApiResponse wraps the payload in `data`
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching birthdays:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch birthdays",
    );
  }
};

export const fetchPerformanceInsights = async () => {
  try {
    const res = await apiClient.get("/api/app/attendance/insights/performance");

    return res.data.data;

  } catch (error) {
    console.error("Error fetching performance insights:", error);
    throw error;
  }
};


/**
 * Fetch approval metrics (isLeadership role check and pending approvals counter) for a manager
 * @param managerId The database ObjectId of the employee/manager
 */
export const fetchManagerApprovalMetrics = async (managerId: string) => {
  try {
    // Hits the endpoint created in your EmployeeController
    const res = await apiClient.get(`/api/app/employee/${managerId}/approval-metrics`);
    return res.data;
  } catch (error) {
    console.error("Error fetching manager approval metrics:", error);
    throw error;
  }
};