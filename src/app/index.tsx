import "../../notify";

import GlossyLogo from "@/components/glossy/GlossyLogo";
import {
  checkGlobalAlertStatus,
} from "@/services/appService";
import { useAuthStore } from "@/store/useAuthStore";
import { resetAndNavigate } from "@/utils/NavigationHelper";
import { getAppPermissionReport } from "@/utils/PermissionCheck";
import { LinearGradient } from "expo-linear-gradient";
import { router, SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { initializeAppConfigs } from "@/services/configService";

SplashScreen.preventAutoHideAsync();
// This tells the OS to show the banner even when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // 1. shouldShowBanner replaces the old 'alert' for the drop-down effect
    shouldShowBanner: true,

    // 2. shouldShowList ensures it stays in the notification center
    shouldShowList: true,

    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const fetchLatestProfile = useAuthStore((state) => state.fetchLatestProfile);

  useEffect(() => {
    let isMounted = true;
    const versionCode = parseInt(DeviceInfo.getBuildNumber(), 10);

    const initializeApp = async () => {
      try {
        // 1. Check for Global Alerts FIRST
        const isAlertActive = await checkGlobalAlertStatus(versionCode);
        if (!isMounted) return;

        if (isAlertActive) {
          const accessToken = await SecureStore.getItemAsync("accessToken");
          if (accessToken) {
            await Promise.all([
              initializeAppConfigs(),
              fetchLatestProfile(),
            ]).catch((err) => console.log("Silent profile fetch failed:", err));
          }

          setTimeout(() => resetAndNavigate("/globalAlert"), 1000);
          return;
        }

        // 2. Fetch App Configs & Token
        const [_, accessToken] = await Promise.all([
          initializeAppConfigs(),
          SecureStore.getItemAsync("accessToken"),
        ]);

        if (!accessToken) {
          resetAndNavigate("/(auth)/login");
          return;
        }

        // 3. MUST successfully fetch profile before proceeding
        await fetchLatestProfile();

        const currentUser = useAuthStore.getState().user;

        // GUARD: If profile could not be loaded, stop here and do not proceed to Home
        if (!currentUser) {
          throw new Error("PROFILE_FETCH_FAILED");
        }

        // Check Inactive status
        if (currentUser.status === "Inactive") {
          resetAndNavigate("/deactivedAccount/DeactivatedAccountScreen");
          return;
        }

        // 4. Check Permissions and Navigate
        const report = await getAppPermissionReport();

        if (report.allMandatoryGranted) {
          resetAndNavigate("/(main)/screens/home");
        } else {
          resetAndNavigate("/(setup)/permissions");
        }
      } catch (error: any) {
        if (!isMounted) return;

        // Only redirect to login if token is explicitly invalid/expired
        if (error?.response?.status === 401) {
          await SecureStore.deleteItemAsync("accessToken");
          resetAndNavigate("/(auth)/login");
        } else {
          // Network/Server issue: Alert the user without booting them to login
          console.error("Initialization error:", error);
          // Optional: keep splash screen visible or show retry dialog
        }
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LinearGradient
      colors={["#2076C7", "#1CADA3"]}
      style={styles.mainContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar hidden />
      <SafeAreaView style={{ flex: 1, width: "100%" }} edges={["bottom"]}>
        <View style={styles.centerContent}>
          <View style={styles.glowContainer}>
            <GlossyLogo
              text="HRMS"
              imageSource={require("@/assets/images/ic_launcher_index.png")}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  glowContainer: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF8C69",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
});
