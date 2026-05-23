import apiClient from "@/apis/client";

export interface FetchDirectoryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

export const fetchEmployeeDirectory = async (params: FetchDirectoryParams) => {
  const response = await apiClient.get("/api/employees/directory", {
    params: {
      limit: 20,
      ...params,
    },
  });

  // Assumes your backend wraps the response in your ApiResponse class
  // e.g., { statusCode: 200, data: { employees: [...], totalPages: 5, ... }, message: "..." }
  return response.data.data;
};
