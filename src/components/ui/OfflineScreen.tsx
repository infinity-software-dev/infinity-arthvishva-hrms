import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import NetInfo from "@react-native-community/netinfo";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { colors, FONTS } from "@/constants/theme";
import GradientButton from "../buttons/GradientButton";
import { StatusBar } from "expo-status-bar";

const OfflineScreen = () => {
  const { isOffline } = useNetworkStatus();
  const [isChecking, setIsChecking] = useState(false);

  // Manual retry function for the button
  const handleRetry = async () => {
    setIsChecking(true);
    // Force NetInfo to check the connection immediately
    await NetInfo.refresh();
    setTimeout(() => {
      setIsChecking(false);
    }, 1000); // Artificial delay so the button press feels responsive
  };

  // If online, render absolutely nothing
  if (!isOffline) return null;

  return (
    // We use absoluteFillObject to completely cover whatever screen the user was on
    <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/Offline-image.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>You're Offline</Text>
        <Text style={styles.message}>
          It seems you've lost your internet connection. Please check your Wi-Fi
          or mobile data and try again.
        </Text>

        <GradientButton
          text={isChecking ? "Checking Network..." : "Try Again"}
          onPress={handleRetry}
          disabled={isChecking}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.Base_Background,
    zIndex: 99999, // Guarantees this sits on top of all navigation headers/tabs
    elevation: 99999,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(30),
  },
  image: {
    width: moderateScale(500),
    height: moderateScale(250),
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(26),
    color: "#1D1D1D",
    fontFamily: FONTS.extraBold,
    marginBottom: moderateScale(10),
    textAlign: "center",
  },
  message: {
    fontSize: moderateScale(15),
    color: "#6B7280", // Modern slate grey
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: moderateScale(35),
    lineHeight: moderateScale(22),
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: moderateScale(30),
    overflow: "hidden",
    shadowColor: "#2076C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: moderateScale(15),
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(55), // Fixed height so it doesn't jump when loading spinner appears
  },
  buttonText: {
    fontSize: moderateScale(16),
    color: "#ffffff",
    fontFamily: FONTS.bold,
  },
});

export default OfflineScreen;
