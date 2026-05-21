import QuickActions from "@/components/cards/HomeScreen/QuickActionsCard";
import MonthlyTarget from "@/components/cards/HomeScreen/MonthlyTargetCard";
import ActionModal from "@/components/modals/AlertModal";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";
import {
  checkLocationPermission,
  requestLocationPermission,
} from "@/utils/LocationHelper";
import { getFirstName } from "@/utils/TextHelpers";
import { useIsFocused } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, AppState, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import HighlightsFeed from "@/components/cards/HomeScreen/HighlightsFeedCard";
import Attendance from "@/components/cards/HomeScreen/AttendanceCard";
import PerformanceInsights from "@/components/cards/HomeScreen/PerformanceInsights";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const isFocused = useIsFocused();

  const [isVisible, setIsVisible] = useState(false);
  const [requiresSettings, setRequiresSettings] = useState(false);

  const handleLocationFlow = async () => {
    const isPermitted = await checkLocationPermission();

    if (isPermitted) {
      setIsVisible(false);
      setRequiresSettings(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      handleLocationFlow();
    }
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        handleLocationFlow();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const handleModalConfirm = async () => {
    if (requiresSettings) {
      Linking.openSettings();
      return;
    }

    const granted = await requestLocationPermission();

    if (granted) {
      handleLocationFlow();
    } else {
      setRequiresSettings(true);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.Base_Background }}
        edges={["bottom"]}
      >
        <HomeNavbar userName={user?.name ? getFirstName(user.name) : "User"} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: -50, zIndex: 100 }}
          contentContainerStyle={{ paddingBottom: moderateScale(10) }}
        >
          <Attendance />
          <QuickActions />
          {/* <MonthlyTarget /> */}
          <HighlightsFeed />
          <PerformanceInsights />
        </ScrollView>

        <ActionModal
          visible={isVisible}
          title={
            requiresSettings ? "Action Required" : "Enable Location Services"
          }
          message={
            requiresSettings
              ? "Location permissions have been disabled. Please enable them in your device settings to continue."
              : "To provide accurate attendance tracking and localized features, we need access to your location."
          }
          confirmText={requiresSettings ? "Open Settings" : "Allow Access"}
          onConfirm={handleModalConfirm}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
