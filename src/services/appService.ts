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
      `${DOMAIN_URL}/api/version/check`,
      {
        platform: Platform.OS,
        versionCode: versionCode,
      }
    );
    return response.data.data.updateRequired;
  } catch (error) {
    console.error("Error fetching alert:", error);
    return false;
  }
};

export const fetchGlobalAlertData = async (): Promise<AlertData | null> => {
  return {
    isActive: true,
    isSkippable: false, // Try changing this to false to see the close button disappear
    title: "System Maintenance 🛠️",
    message:
      "We are upgrading the HRMS servers this weekend to bring you a faster, smoother experience! Some features may be temporarily offline.",
    imageUrl: "https://illustrations.popsy.co/amber/surreal-hourglass.svg", // A nice placeholder illustration
    buttonText: "Read the Details",
    buttonLink: "https://expo.dev", // Dummy link
  };
  // try {
  //   const response = await axios.get(`${DOMAIN_URL}/api/alert`);
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching alert data:", error);
  //   return null;
  // }
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
      `${DOMAIN_URL}/api/employees/profile/fcm-token`,
      payload,
    );

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return false;
  }
};
