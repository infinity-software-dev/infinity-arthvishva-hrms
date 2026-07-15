import { getMessaging, onMessage } from "@react-native-firebase/messaging";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { User } from "lucide-react-native";
import { colors, FONTS } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { toTitleCase } from "@/utils/TextHelpers";
import { formattedDate, getGreeting } from "@/utils/Date-TimeHelpers";
import { LinearGradient } from "expo-linear-gradient";
import HelloWave from "../animations/HelloWave";
import { router, useIsFocused } from "expo-router";
import {
  getFcmToken,
  isNotificationPermissionGranted,
} from "@/utils/NotificationHelper";
import { updateFcmTokenService } from "@/services/appService";

import * as Notifications from "expo-notifications";

interface HomeNavbarProps {
  userName: string;
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({ userName = "User" }) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  useEffect(() => {
    const syncFcmToken = async () => {
      // 1. Await the silent check
      const isNoteOk = await isNotificationPermissionGranted();

      if (isNoteOk) {
        // 2. Get the current token
        const fcmToken = await getFcmToken();

        if (fcmToken) {
          // 3. Send to backend service
          await updateFcmTokenService(fcmToken);
        }
      }
    };

    if (isFocused) {
      syncFcmToken();
    }
  }, [isFocused]);

  useEffect(() => {
    // 1. Get the modular messaging instance
    const messaging = getMessaging();

    // 2. Use the standalone onMessage function
    const unsubOnMessage = onMessage(messaging, async (remoteMessage) => {
      // console.log("🔵 Foreground FCM message:", remoteMessage);

      const title =
        typeof remoteMessage.data?.title === "string"
          ? remoteMessage.data.title
          : typeof remoteMessage.notification?.title === "string"
            ? remoteMessage.notification.title
            : "Infinity HRMS";

      const body =
        typeof remoteMessage.data?.body === "string"
          ? remoteMessage.data.body
          : typeof remoteMessage.notification?.body === "string"
            ? remoteMessage.notification.body
            : "";

      // Using expo-notifications to show the heads-up alert while in foreground
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: remoteMessage.data ?? {},
        },
        trigger: null, // Show immediately
      });
    });

    return () => {
      unsubOnMessage(); // Clean up on unmount
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.BRAND_SECONDARY, colors.BRAND_SECONDARY_Dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          { paddingTop: insets.top + moderateScale(12) },
        ]}
      >
        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.greetingText}>{getGreeting()},</Text>
              <Text style={styles.dateText}> • {formattedDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.userName} numberOfLines={1} onPress={()=>{}}>
                {toTitleCase(userName.split(" ")[0])}
              </Text>
              {isFocused && <HelloWave />}
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push("/(main)/screens/profile")}
            activeOpacity={0.7}
          >
            <User size={moderateScale(24)} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default HomeNavbar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.Base_Background,
  },
  container: {
    paddingHorizontal: moderateScale(24),
    paddingBottom: moderateScale(70),
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
    // Elevated shadow for a layered look
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: moderateScale(14),
    fontFamily: FONTS.regular,
  },
  dateText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: moderateScale(12),
    fontFamily: FONTS.medium,
  },
  userName: {
    color: "#FFF",
    fontSize: moderateScale(28), // Bold font scale
    fontFamily: FONTS.extraBold,
    letterSpacing: -0.5,
    marginRight: 5,
    marginTop: 5,
  },
  profileBtn: {
    width: moderateScale(48),
    height: moderateScale(48),
    backgroundColor: "rgba(255,255,255,0.18)", // Glass effect over the green gradient
    borderRadius: moderateScale(16),
    justifyContent: "center",
    alignItems: "center",
  },
});
