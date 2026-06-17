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

export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  try {
    const response = await apiClient.post("/api/app/employee/change-password", {
      oldPassword,
      newPassword,
    });

    return response.data;
  } catch (error: any) {
    // console.error("Failed to change password", error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Failed to change password",
      );
    }
    throw new Error("Network error. Please try again later.");
  }
};

// Update your API function to accept the descriptors and the base64 image
export const addFaceDescriptor = async (faceDescriptors: number[][], imageBase64: string) => {
  try {
    const response = await apiClient.post("/api/app/employee/face", {
      faceDescriptors: faceDescriptors,
      image: imageBase64, // Sends the "data:image/jpeg;base64,..." string
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Failed to add face");
    }
    throw new Error("Network error. Please try again later.");
  }
};