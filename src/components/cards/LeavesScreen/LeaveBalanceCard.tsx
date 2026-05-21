import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

// Define the shape of your backend summary data
export interface LeaveSummaryData {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  cancelled?: number;
}

export interface LeaveBalanceProps {
  data: LeaveSummaryData;
  title?: string;
  subTitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap; // Allows passing any Ionicons name
}

export default function LeaveBalanceCard({
  data,
  title = "Apply for Leave",
  subTitle = "PLANNING TO TAKE OFF?",
  iconName = "airplane-outline", // Defaults to airplane
}: LeaveBalanceProps) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroHeader}>
        <View>
          <Text style={styles.heroSubTitle}>{subTitle}</Text>
          <Text style={styles.heroTitle}>{title}</Text>
        </View>
        <View style={styles.iconWrapper}>
          <Ionicons
            name={iconName}
            size={moderateScale(24)}
            color={colors.Brand_Blue}
          />
        </View>
      </View>

      {/* Leave Balances - 4 Column Layout */}
      <View style={styles.balancesWrapper}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceCount}>{data.total}</Text>
          <Text style={styles.balanceLabel}>TOTAL</Text>
        </View>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceItem}>
          <Text
            style={[
              styles.balanceCount,
              { color: colors.Success_Green || "#10B981" },
            ]}
          >
            {data.approved}
          </Text>
          <Text style={styles.balanceLabel}>APPROVED</Text>
        </View>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceItem}>
          <Text
            style={[
              styles.balanceCount,
              { color: colors.Warning_Yellow || "#F59E0B" },
            ]}
          >
            {data.pending}
          </Text>
          <Text style={styles.balanceLabel}>PENDING</Text>
        </View>

        <View style={styles.balanceDivider} />

        <View style={styles.balanceItem}>
          <Text
            style={[
              styles.balanceCount,
              { color: colors.Danger_Red || "#EF4444" },
            ]}
          >
            {data.rejected}
          </Text>
          <Text style={styles.balanceLabel}>REJECTED</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: moderateScale(24),
    shadowColor: colors.Brand_Green_Dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(20),
  },
  heroSubTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: moderateScale(4),
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(22),
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  iconWrapper: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: `${colors.Brand_Blue}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  balancesWrapper: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(16),
    alignItems: "center",
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceCount: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16), // Slightly reduced to fit 4 items
    color: colors.Brand_Blue,
    marginBottom: moderateScale(2),
  },
  balanceLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(9), // Slightly reduced to prevent text wrapping
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  balanceDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E2E8F0",
  },
});
