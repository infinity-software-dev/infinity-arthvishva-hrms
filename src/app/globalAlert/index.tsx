import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import DeviceInfo from "react-native-device-info";

// Import your internal helpers and services
import { AlertData } from "@/apis/types";
import { fetchGlobalAlertData } from "@/services/appService";
import { resetAndNavigate } from "@/utils/NavigationHelper";
import { colors, FONTS } from "@/constants/theme";
import { getMyProfile } from "@/services/profileService";

const GlobalAlertScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  const versionCode = parseInt(DeviceInfo.getBuildNumber(), 10);

  // Safely extract the link for the current OS
  const platformLink = alertData?.buttonLink?.[Platform.OS as 'ios' | 'android'];

  // Smart routing
  const navigateForward = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        const profile = await getMyProfile();
        if (profile) {
          return resetAndNavigate("/(main)/screens/home");
        }
      }
      resetAndNavigate("/(auth)/login");
    } catch (e) {
      resetAndNavigate("/(auth)/login");
    }
  };

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const data = await fetchGlobalAlertData(versionCode);
        if (!data) throw new Error("Failed to fetch alert. Please try again later.");
        setAlertData(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
  }, [versionCode]);

  // ── NEW LOGIC: Dynamic Button Handler ──
  const handlePrimaryAction = () => {
    if (platformLink) {
      // If there is a link, open the App Store / Play Store
      Linking.openURL(platformLink).catch((err) => {
        console.error("Failed to open URL:", err);
      });
    } else {
      // If there is no link, just dismiss the alert and enter the app
      navigateForward();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ActivityIndicator size="large" color="#2076C7" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.card}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{error}</Text>
          <TouchableOpacity style={styles.skipButtonError} onPress={navigateForward}>
            <Text style={styles.skipText}>Continue to App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!alertData?.isActive) {
    navigateForward();
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar style="dark" />

      {/* Optional Top-Right Skip Button */}
      {alertData.isSkippable && (
        <TouchableOpacity style={styles.skipButton} onPress={navigateForward}>
          <Text style={styles.skipText}>Close</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        {alertData.imageUrl && (
          <Image
            source={{ uri: alertData.imageUrl }}
            style={styles.image}
            contentFit="contain"
          />
        )}

        <Text style={styles.title}>{alertData.title}</Text>
        <Text style={styles.message}>{alertData.message}</Text>

        {/* ── NEW LOGIC: Always render the primary button ── */}
        <TouchableOpacity
          style={styles.actionButtonWrapper}
          onPress={handlePrimaryAction}
        >
          <LinearGradient
            colors={[colors.BRAND_PRIMARY, colors.BRAND_SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>
              {alertData.buttonText || "Continue"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(20),
  },
  skipButton: {
    position: "absolute",
    top: moderateScale(40),
    right: moderateScale(20),
    zIndex: 10,
    padding: moderateScale(8),
  },
  skipButtonError: {
    marginTop: moderateScale(15),
    padding: moderateScale(8),
  },
  skipText: {
    fontSize: moderateScale(14),
    color: "#888",
    fontFamily: FONTS.semiBold,
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: moderateScale(16),
    padding: moderateScale(24),
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: moderateScale(220),
    height: moderateScale(180),
    marginBottom: moderateScale(16),
  },
  title: {
    fontSize: moderateScale(22),
    color: "#1D1D1D",
    fontFamily: FONTS.bold,
    marginBottom: moderateScale(8),
    textAlign: "center",
  },
  message: {
    fontSize: moderateScale(15),
    color: "#4B4B4B",
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: moderateScale(24),
    lineHeight: moderateScale(22),
  },
  actionButtonWrapper: {
    width: "100%",
    borderRadius: moderateScale(24),
    overflow: "hidden",
  },
  actionButton: {
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: moderateScale(15),
    color: "#fff",
    fontFamily: FONTS.bold,
  },
});

export default GlobalAlertScreen;
