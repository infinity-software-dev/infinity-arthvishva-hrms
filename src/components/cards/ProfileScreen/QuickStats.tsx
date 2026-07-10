import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import { useProfile } from "@/hooks/useProfile";

export default function QuickStats() {
  const { state } = useProfile();

  // Safe fallback to an empty array if activeLedgerTokens is undefined
  const tokens = state?.activeLedgerTokens || [];

  // Calculate sums by reducing the matching token values
  const paidLeavesValue = tokens.reduce((acc, token) => {
    return token.leaveType === "Paid" ? acc + (token.value || 0) : acc;
  }, 0);

  const compOffsValue = tokens.reduce((acc, token) => {
    return token.leaveType === "CompOff" ? acc + (token.value || 0) : acc;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{paidLeavesValue}</Text>
        <Text style={styles.statLabel}>Paid Leaves</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={[styles.statValue, { color: colors.BRAND_SECONDARY }]}>
          {compOffsValue}
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
    color: colors.BRAND_SECONDARY,
    marginBottom: moderateScale(4),
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#64748B",
  },
});