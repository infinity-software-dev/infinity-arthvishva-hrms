import apiClient from "@/apis/client";
import { Employee } from "@/apis/types";

export const getProfileDetails = async (): Promise<Employee> => {
  try {
    const response = await apiClient.get("/api/auth/me");
    // Your docs state the profile data is directly inside response.data.data
    const profileData = response.data.data;
    return profileData;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    throw error;
  }
};

// export const updateFaceDescriptor = async (faceDescriptor: number[]) => {
//   const response = await apiClient.put('/profile/face-descriptor', {
//     faceDescriptor: faceDescriptor,
//   });
//   return response.data;
// };

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const response = await apiClient.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Failed to change password",
      );
    }
    throw new Error("Network error. Please try again later.");
  }
};
