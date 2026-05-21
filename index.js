import "expo-router/entry"; // or your app entry if not using Expo Router
import messaging from "@react-native-firebase/messaging";

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📩 Headless FCM message (background/killed):', remoteMessage);

  // Optional: delegate to notify.js
  const { handleBackgroundMessage } = await import("./notify");
  await handleBackgroundMessage(remoteMessage);
});
