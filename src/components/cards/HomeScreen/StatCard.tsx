import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { FONTS } from "@/constants/theme";

export interface StatCardProps {
  value: string | number;
  label: string;
  subLabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  colorTheme: { main: string; bg: string };
  watermarkIcon: keyof typeof Ionicons.glyphMap;
}

export default function StatCard({
  value,
  label,
  subLabel,
  iconName,
  colorTheme,
  watermarkIcon,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      {/* Absolute Watermark Icon */}
      <View style={styles.watermarkContainer}>
        <Ionicons
          name={watermarkIcon}
          size={moderateScale(85)}
          color={colorTheme.main}
          style={styles.watermarkIcon}
        />
      </View>

      {/* Card Content */}
      <View style={[styles.iconWrapper, { backgroundColor: colorTheme.bg }]}>
        <Ionicons
          name={iconName}
          size={moderateScale(18)}
          color={colorTheme.main}
        />
      </View>

      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.subLabelText}>{subLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    marginBottom: moderateScale(16),
    overflow: "hidden",
    // Modern soft, diffused shadow
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    // Subtle border for crispness on light backgrounds
    borderWidth: 1,
    borderColor: "#F8FAFC",
  },
  iconWrapper: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  valueText: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(26),
    color: "#0F172A",
    letterSpacing: -0.5, // Tighter tracking for large numbers
    marginBottom: moderateScale(4),
  },
  labelText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: "#64748B",
    letterSpacing: 0.2,
    marginBottom: moderateScale(2),
  },
  subLabelText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(11),
    color: "#94A3B8",
  },
  watermarkContainer: {
    position: "absolute",
    right: moderateScale(-20),
    bottom: moderateScale(-20),
    opacity: 0.03,
    zIndex: -1,
  },
  watermarkIcon: {
    transform: [{ rotate: "-20deg" }],
  },
});
