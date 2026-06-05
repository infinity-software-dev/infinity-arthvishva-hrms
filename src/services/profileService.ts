import apiClient from "@/apis/client";
import { Employee } from "@/apis/types";

// Apply the Employee type to the profile fetcher
export const getMyProfile = async (): Promise<Employee | null> => {
  try {
    const response = await apiClient.get("/api/app/employee/profile");
    const profileData = response.data.data as Employee;
    return profileData;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return null;
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
