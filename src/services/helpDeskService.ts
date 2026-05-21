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
    const response = await apiClient.get("/api/complaints/my");
    return response.data;
  },

  // POST: Create a new complaint
  createComplaint: async (payload: CreateComplaintPayload) => {
    const response = await apiClient.post("/api/complaints/apply", payload);
    return response.data;
  },
};