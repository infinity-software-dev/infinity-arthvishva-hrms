import React from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import QuickActions from "@/components/cards/HomeScreen/QuickActionsCard";
import MonthlyTarget from "@/components/cards/HomeScreen/MonthlyTargetCard";
import ActionModal from "@/components/modals/AlertModal";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import HighlightsFeed from "@/components/cards/HomeScreen/HighlightsFeedCard";
import Attendance from "@/components/cards/HomeScreen/AttendanceCard";
import PerformanceInsights from "@/components/cards/HomeScreen/PerformanceInsights";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/constants/theme";
import { getFirstName } from "@/utils/TextHelpers";
import { useLocationPermission } from "@/hooks/useLocationPermission";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  // Consume our extracted location logic
  const { isVisible, requiresSettings, handleModalConfirm } = useLocationPermission();

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
          <QuickActions />
          {/* <Attendance />
          
          <HighlightsFeed />
          <PerformanceInsights />*/}
        </ScrollView>
        {/* <MonthlyTarget />  */}


        <ActionModal
          visible={isVisible}
          title={requiresSettings ? "Action Required" : "Enable Location Services"}
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