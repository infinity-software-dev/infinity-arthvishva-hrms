import apiClient from "@/apis/client";

export interface FetchDirectoryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

export const fetchEmployeeDirectory = async (params: FetchDirectoryParams) => {
  const response = await apiClient.get("/api/app/employee/directory", {
    params: {
      limit: 20,
      ...params,
    },
  });
  return response.data.data;
};
