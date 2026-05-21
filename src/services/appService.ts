import { AlertData } from "@/apis/types";
import { DOMAIN_URL } from "@/apis/url";
import axios from "axios";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

export const checkGlobalAlertStatus = async (
  versionCode: number,
): Promise<boolean> => {
  return false;
  // try {
  //   const response = await axios.get(
  //     `${DOMAIN_URL}/customer/checkAlert/${versionCode}`,
  //   );
  //   return response.data.isActive;
  // } catch (error) {
  //   console.error("Error fetching alert:", error);
  //   return false;
  // }
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
  //   const response = await axios.get(`${DOMAIN_URL}/api/app/alert`);
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching alert data:", error);
  //   return null;
  // }
};

export const updateFcmTokenService = async (token: string): Promise<boolean> => {
  // console.log(token);
  return true;
  // try {
  //   const deviceId = await DeviceInfo.getUniqueId();

  //   const payload = {
  //     fcmToken: token,
  //     deviceType: Platform.OS, // 'android' or 'ios'
  //     deviceId: deviceId,
  //   };

  //   const response = await axios.post(
  //     `${DOMAIN_URL}/employee/update-fcm-token`,
  //     payload,
  //   );

  //   return response.status === 200 || response.status === 201;
  // } catch (error) {
  //   console.error("Error updating FCM token:", error);
  //   return false;
  // }
};
