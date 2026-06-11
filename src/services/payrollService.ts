import apiClient from "@/apis/client";

export interface GeneratePayrollPayload {
  month?: number;
  year?: number;
  startDate?: string; // Expected format: "YYYY-MM-DD"
  endDate?: string;   // Expected format: "YYYY-MM-DD"
}

export interface PayrollResponse {
  _id: string;
  employeeId: string;
  targetMonth?: number;
  targetYear?: number;
  fromDate: string;
  toDate: string;
  processedBy: string;
  // add other fields if needed, like netSalary, grossEarnings, etc.
  [key: string]: any;
}

export interface GetPayrollListParams {
  month?: number;
  year?: number;
  status?: string;
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
  employeeId?: string;
  self?: boolean;
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PayrollListResponse {
  payrolls: PayrollResponse[];
  pagination: Pagination;
}

export async function generateEmployeePayroll(
  payload: GeneratePayrollPayload,
): Promise<PayrollResponse> {
  try {
    const response = await apiClient.post("/api/app/payroll/preview", payload);

    // The backend uses ApiResponse, so the actual data is inside response.data.data
    return response.data.data;
  } catch (error: any) {
    // console.error("Error generating payroll:", error);
    throw new Error(
      error.response?.data?.message || "Failed to generate payroll"
    );
  }
}

export async function getPayrollList(
  params: GetPayrollListParams
): Promise<PayrollListResponse> {
  try {
    // Adjust the endpoint URL if needed (assuming GET /api/payroll)
    const response = await apiClient.get("/api/app/payroll/list", { params });

    // The backend uses ApiResponse, so data is inside response.data.data
    return response.data.data.payrolls;
  } catch (error: any) {
    console.error("Error fetching payroll list:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch payroll list"
    );
  }
}

//3670.97
//3187.1