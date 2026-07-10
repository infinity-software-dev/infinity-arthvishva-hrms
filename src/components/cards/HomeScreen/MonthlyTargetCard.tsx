import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import { fetchPerformanceInsights } from "@/services/homeService";

export default function MonthlyTarget() {
  const [targetPercentage, setTargetPercentage] = useState(0);

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getTargetData = async () => {
      try {
        const insights = await fetchPerformanceInsights();

        if (insights) {
          const presentDays = insights.present ?? 0;

          // Calculate progress based on 22 working days baseline, capped at 100%
          const percentage = Math.round(
            Math.min((presentDays / 22) * 100, 100),
          );

          setTargetPercentage(percentage);

          // Animate the progress bar to the calculated percentage
          Animated.timing(animatedWidth, {
            toValue: percentage,
            duration: 1200,
            useNativeDriver: false,
          }).start();
        }
      } catch (error) {
        console.error("Failed to load monthly target:", error);
      }
    };

    getTargetData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Monthly Target</Text>
            <Text style={styles.subtitle}>Aiming for 100% attendance</Text>
          </View>
          <Text style={styles.percentageText}>{targetPercentage}%</Text>
        </View>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(25),
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(15),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#FFFFFF",
    marginBottom: moderateScale(2),
  },
  subtitle: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#9CA3AF",
  },
  percentageText: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(22),
    color: colors.BRAND_SECONDARY,
  },
  progressBarBackground: {
    width: "100%",
    height: moderateScale(8),
    backgroundColor: "#374151",
    borderRadius: moderateScale(4),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.BRAND_SECONDARY,
    borderRadius: moderateScale(4),
  },
});
