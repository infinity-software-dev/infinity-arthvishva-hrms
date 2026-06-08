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
    const res = await apiClient.get("/api/dashboard/employee-dashboard");
    return res.data.data.monthlySummary;
  } catch (error) {
    console.error("Error fetching performance insights:", error);
    throw error;
  }
};
