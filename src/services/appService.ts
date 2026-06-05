import apiClient from "@/apis/client";
import { AlertData } from "@/apis/types";
import { DOMAIN_URL } from "@/apis/url";
import axios from "axios";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

export const checkGlobalAlertStatus = async (
  versionCode: number,
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${DOMAIN_URL}/api/app/alert/check`,
      {
        platform: Platform.OS,
        versionCode: versionCode,
      }
    );
    return response.data.showAlert;
  } catch (error) {
    console.error("Error fetching alert:", error);
    return false;
  }
};

export const fetchGlobalAlertData = async (versionCode: number): Promise<AlertData | null> => {
  try {
    const response = await axios.post(
      `${DOMAIN_URL}/api/app/alert/check`,
      {
        platform: Platform.OS,
        versionCode: versionCode,
      }
    );
    return response.data.data as AlertData;
  } catch (error) {
    console.error("Error fetching alert data:", error);
    return null;
  }
};

export const updateFcmTokenService = async (token: string): Promise<boolean> => {
  // console.log(token);
  // return true;
  try {
    const deviceId = await DeviceInfo.getUniqueId();

    const payload = {
      fcmToken: token,
      deviceType: Platform.OS, // 'android' or 'ios'
      deviceId: deviceId,
    };

    const response = await apiClient.patch(
      `${DOMAIN_URL}/api/app/employee/profile/fcm-token`,
      payload,
    );

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return false;
  }
};
