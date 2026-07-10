import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";

interface CustomHeaderProps {
  title: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.back();
  };

  return (
    <LinearGradient
      colors={[colors.BRAND_SECONDARY, colors.BRAND_SECONDARY_Dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <StatusBar style="light" />
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{
            top: moderateScale(10),
            bottom: moderateScale(10),
            left: moderateScale(10),
            right: moderateScale(10),
          }}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(22.5)}
            color="#ffffff"
          />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightPlaceholder} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerContent: {
    height: moderateScale(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(16),
  },
  backButton: {
    width: moderateScale(40),
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    color: "#ffffff",
    fontSize: moderateScale(18),
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
  rightPlaceholder: {
    width: moderateScale(40),
  },
});
