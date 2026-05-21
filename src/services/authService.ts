import apiClient from "@/apis/client";
import { DOMAIN_URL } from "@/apis/url";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORT YOUR TYPES
import { Employee, LoginResponse } from "@/apis/types";

// Apply the LoginResponse type to the promise
export const loginEmployee = async (
  employeeCode: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${DOMAIN_URL}/api/auth/login`,
      {
        employeeCode,
        password,
      },
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to connect to server" };
  }
};

export const logoutEmployee = async (): Promise<void> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (refreshToken) {
      await apiClient.post("/api/auth/logout", {
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    console.error("Logout API failed", error);
  } finally {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
};

// Apply the Employee type to the profile fetcher
export const getMyProfile = async (): Promise<Employee | null> => {
  try {
    const response = await apiClient.get("/api/auth/me");
    // Your docs state the profile data is directly inside response.data.data
    const profileData = response.data.data;
    return profileData;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return null;
  }
};
