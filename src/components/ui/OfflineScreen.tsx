import React, { useState } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
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

  const handleRetry = async () => {
    setIsChecking(true);
    await NetInfo.refresh();
    setTimeout(() => {
      setIsChecking(false);
    }, 1000); 
  };

  if (!isOffline) return null;

  return (
    <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]} edges={["bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        
        <ImageBackground
          source={require("@/assets/images/offline-animation.gif")} 
          style={styles.gifBackground}
          resizeMode="cover"
        >
          {/* <Text style={styles.giantText}>Offline</Text> */}
        </ImageBackground>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Look like you're lost</Text>
          <Text style={styles.message}>
            It seems you've lost your internet connection. Please check your Wi-Fi
            or mobile data and try again.
          </Text>

            <GradientButton
              text={isChecking ? "Checking Network..." : "Try Again"}
              onPress={handleRetry}
              disabled={isChecking}
            />
          {/* </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff", 
    zIndex: 99999,
    elevation: 99999,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gifBackground: {
    width: "100%",
    height: moderateScale(400),
    justifyContent: "center",
    alignItems: "center",
  },
  giantText: {
    fontSize: moderateScale(60),
    fontFamily: FONTS.extraBold || "System",
    color: "#1D1D1D",
    marginTop: moderateScale(-40),
  },
  textContainer: {
    paddingHorizontal: moderateScale(30),
    marginTop: moderateScale(-50), 
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: moderateScale(26),
    color: "#1D1D1D",
    fontFamily: FONTS.extraBold || "System",
    marginBottom: moderateScale(10),
    textAlign: "center",
  },
  message: {
    fontSize: moderateScale(15),
    color: "#6B7280", 
    fontFamily: FONTS.medium || "System",
    textAlign: "center",
    marginBottom: moderateScale(35),
    lineHeight: moderateScale(22),
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: moderateScale(30),
    overflow: "hidden",
    shadowColor: colors.Brand_Blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default OfflineScreen;