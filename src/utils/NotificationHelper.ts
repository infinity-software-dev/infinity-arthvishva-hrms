import {
  getMessaging,
  getToken,
  requestPermission,
  hasPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

/**
 * Requests notification permission from the user.
 */
export async function requestUserPermission(): Promise<boolean> {
  // 1. Handle Android 13+ native prompt
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  // 2. Handle iOS/Older Android using Firebase Modular SDK
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (err) {
    console.error("❌ Failed to request notification permission:", err);
    return false;
  }
}

/**
 * Silently checks if the user has already granted notification permission.
 */
export async function isNotificationPermissionGranted(): Promise<boolean> {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  try {
    const messaging = getMessaging();
    const authStatus = await hasPermission(messaging);

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (err) {
    console.warn("🔔 Failed to check notification permission:", err);
    return false;
  }
}

/**
 * Retrieves the current FCM token for this device.
 */
export async function getFcmToken(): Promise<string | null> {
  try {
    const messaging = getMessaging();
    // The modular way: pass the messaging instance as the first argument
    const token = await getToken(messaging);
    // console.log(token)

    return token;
  } catch (err) {
    console.error("❌ Failed to get FCM token:", err);
    return null;
  }
}
