import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface CustomHeaderProps {
  title: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    router.back();
  };

  return (
    <LinearGradient
      colors={[colors.Brand_Green, colors.Brand_Green_Dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.headerContent}>
        {/* Back Button */}
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

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Invisible placeholder to ensure the title remains perfectly centered */}
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
