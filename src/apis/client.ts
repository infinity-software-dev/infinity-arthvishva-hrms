import { resetAndNavigate } from "@/utils/NavigationHelper";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { DOMAIN_URL } from "./url";
import NetInfo from "@react-native-community/netinfo";

const apiClient = axios.create({
  baseURL: DOMAIN_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  async (config) => {
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      // Instantly reject the request without making the user wait for a timeout
      return Promise.reject(new Error("No internet connection"));
    }

    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- Response Interceptor & Token Refresh Logic ---

let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Broader check to catch /employee/login, /hr/login, etc.
    if (
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post(`${DOMAIN_URL}/api/auth/refresh`, {
          refreshToken: refreshToken,
        });

        // Account for the backend's standard { success, message, data } wrapper
        const newAccessToken = data.data.accessToken;

        await SecureStore.setItemAsync("accessToken", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        resetAndNavigate("/(auth)/login");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
