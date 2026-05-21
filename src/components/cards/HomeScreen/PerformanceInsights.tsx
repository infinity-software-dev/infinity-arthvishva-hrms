import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FONTS } from "@/constants/theme";
import StatCard from "./StatCard";
import { fetchPerformanceInsights } from "@/services/homeService";

const STAT_COLORS = {
  present: { main: "#10B981", bg: "#ECFDF5" },
  absent: { main: "#EF4444", bg: "#FEF2F2" },
  late: { main: "#F59E0B", bg: "#FFFBEB" },
  avgHours: { main: "#3B82F6", bg: "#EFF6FF" },
};

// Defined an interface to avoid TypeScript complaints on data properties
interface InsightsData {
  present?: number;
  absent?: number;
  late?: number;
  totalHours?: number;
}

export default function PerformanceInsights() {
  const [data, setData] = useState<InsightsData>({});

  useEffect(() => {
    const getInsights = async () => {
      try {
        const insights = await fetchPerformanceInsights();
        if (insights) {
          setData(insights);
        }
      } catch (error) {
        console.error("Failed to load insights:", error);
      }
    };

    getInsights();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Performance Insights</Text>

      <View style={styles.grid}>
        <StatCard
          value={data.present ?? 0}
          label="Days Present"
          subLabel="This month"
          iconName="checkmark-circle"
          colorTheme={STAT_COLORS.present}
          watermarkIcon="checkmark-circle"
        />

        <StatCard
          value={data.absent ?? 0}
          label="Days Absent"
          subLabel="This month"
          iconName="close-circle"
          colorTheme={STAT_COLORS.absent}
          watermarkIcon="close-circle"
        />

        <StatCard
          value={data.late ?? 0}
          label="Late Entries"
          subLabel="Needs attention"
          iconName="time"
          colorTheme={STAT_COLORS.late}
          watermarkIcon="time"
        />

        <StatCard
          value={data.totalHours ?? 0}
          label="Avg. Hours"
          subLabel="Daily average"
          iconName="flash"
          colorTheme={STAT_COLORS.avgHours}
          watermarkIcon="flash"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  sectionTitle: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    color: "#0F172A",
    marginBottom: moderateScale(15),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: moderateScale(12),
  },
});
