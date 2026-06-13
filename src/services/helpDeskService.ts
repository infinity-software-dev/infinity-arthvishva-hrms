import apiClient from "@/apis/client";

// Define the shape of the data you send to the backend
export interface CreateComplaintPayload {
  title: string;
  category: string;
  priority: string;
  description: string;
}

export const helpDeskService = {
  // GET: Fetch all complaints for the logged-in user
  fetchMyComplaints: async () => {
    try {
      const response = await apiClient.get("/api/app/complaints/my");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      throw error;
    }
  },

  // POST: Create a new complaint
  createComplaint: async (payload: CreateComplaintPayload) => {
    try {
      const response = await apiClient.post("/api/app/complaints", payload);
      return response.data;
    } catch (error) {
      console.error("Failed to create complaint:", error);
      throw error;
    }
  },

  withdrawComplaint: async (complaintId: string) => {
    try {
      const response = await apiClient.delete(`/api/app/complaints/withdraw/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to withdraw complaint:", error);
      throw error;
    }
  },
};