import apiClient from "@/apis/client";
import { DOMAIN_URL } from "@/apis/url";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORT YOUR TYPES
import { LoginResponse } from "@/apis/types";

export const loginEmployee = async (
  employeeCode: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${DOMAIN_URL}/api/auth/employee/login`,
      {
        employeeCode,
        password,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Login API failed", error);
    throw error.response?.data || { message: "Failed to connect to server" };
  }
};

export const logoutEmployee = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  } catch (error) {
    console.error("Logout API failed", error);
  }
};
