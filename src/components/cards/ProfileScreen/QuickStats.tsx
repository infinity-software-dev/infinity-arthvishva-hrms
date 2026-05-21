import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import { EmployeeProfile } from "@/services/profileService";

interface QuickStatsProps {
  profile: EmployeeProfile;
}

export default function QuickStats({ profile }: QuickStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{profile.paidLeaveBalance || 0}</Text>
        <Text style={styles.statLabel}>Paid Leaves</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={[styles.statValue, { color: colors.Magic_Violet }]}>
          {profile.compOffBalance || 0}
        </Text>
        <Text style={styles.statLabel}>Comp-Offs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(16),
    marginBottom: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(22),
    color: colors.Brand_Green,
    marginBottom: moderateScale(4),
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#64748B",
  },
});
