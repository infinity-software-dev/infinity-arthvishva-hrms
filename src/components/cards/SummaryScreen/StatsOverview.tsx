import { colors, FONTS } from "@/constants/theme";
import { SummaryStats } from "@/types/attendance";
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface StatsOverviewProps {
  stats: SummaryStats | null;
  loading: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color={colors.Brand_Green} />
      </View>
    );
  }

  const StatItem = ({
    value,
    label,
    color,
  }: {
    value: string | number;
    label: string;
    color: string;
  }) => (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatItem value={stats.present} label="PRESENT" color={colors.Success_Green} />
      <StatItem value={stats.absent} label="ABSENT" color={colors.Danger_Red} />
      <StatItem value={stats.halfDay} label="HALF DAY" color={colors.Warning_Yellow} />
      <StatItem
        value={stats.weekOffHoliday}
        label="Week Off/Holiday"
        color={colors.Magic_Violet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: moderateScale(16),
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  center: {
    height: moderateScale(80),
    justifyContent: "center",
    alignItems: "center",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(20),
    marginBottom: moderateScale(4),
  },
  statLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(10),
    color: "#64748B",
    textTransform: "uppercase",
  },
});

export default StatsOverview;
