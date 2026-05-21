import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// --- NOTIFICATION CONFIGURATION ---
// Changing these constants later is all you need to do for future updates.
const CHANNEL_ID = "infinity-hrms-alerts";
const CHANNEL_NAME = "Attendance & Shift Alerts";
const CUSTOM_SOUND_NAME = null; // 👈 Future: Set to "brand_sound" (no extension)
// ----------------------------------

// 1️⃣ Initialize Firebase Messaging (Modular)
const messaging = getMessaging();

// 2️⃣ Configure Android Notification Channel
// This ensures heads-up alerts work on modern Android versions.
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: CHANNEL_NAME,
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    sound: CUSTOM_SOUND_NAME, // Defaults to system sound if null
    lightColor: "#1CAD9F", // Your Infinity Brand Green
  });
}

// 3️⃣ Define Background/Quit-State Handler
// This function MUST be exported and return a Promise.
export async function handleBackgroundMessage(remoteMessage) {
  // 1. Log for debugging
  // console.log("🌙 Background FCM Received:", remoteMessage);

  const { notification, data } = remoteMessage;

  /**
   * GUARD 1: If the OS already has a notification object,
   * STOP IMMEDIATELY. Android will handle the display natively.
   */
  if (notification || remoteMessage.data?.notification) {
    return;
  }

  /**
   * GUARD 2: Only show a manual notification if we have actual content.
   * We remove the hardcoded "New update received" to prevent
   * "ghost" notifications with no real info.
   */
  const title = data?.title;
  const body = data?.body;

  // If there is no title AND no body in the data payload, do nothing.
  if (!title && !body) {
    return;
  }

  // 2. Schedule only if it's a legitimate 'Data-Only' message
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || "Infinity HRMS",
      body: body || "",
      data: data ?? {},
      android: {
        channelId: CHANNEL_ID,
        // Only play sound if we actually have something to say
        sound: CUSTOM_SOUND_NAME ? CUSTOM_SOUND_NAME : undefined,
      },
    },
    trigger: null,
  });
}

// 4️⃣ THE FIX: Register the Background Handler
// This satisfies the native Android requirements and removes the console warning.
setBackgroundMessageHandler(messaging, handleBackgroundMessage);
