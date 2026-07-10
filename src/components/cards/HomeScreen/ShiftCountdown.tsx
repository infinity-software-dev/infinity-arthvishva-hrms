import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

interface ShiftCountdownProps {
  checkInTime: Date;
  shiftDurationHours: number;
}

export default function ShiftCountdown({
  checkInTime,
  shiftDurationHours,
}: ShiftCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);
  const [isShiftOver, setIsShiftOver] = useState(false);

  // Calculate start time, end time, and formatting
  const { formattedStartTime, endTime, formattedEndTime, shiftDurationMs } =
    useMemo(() => {
      const durationMs = shiftDurationHours * 60 * 60 * 1000;
      const end = new Date(checkInTime.getTime() + durationMs);

      return {
        formattedStartTime: checkInTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: end,
        formattedEndTime: end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        shiftDurationMs: durationMs,
      };
    }, [checkInTime, shiftDurationHours]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime.getTime() - now;

      if (difference <= 0) {
        clearInterval(timer);
        setIsShiftOver(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });

        const timePassed = now - checkInTime.getTime();
        const percentComplete = Math.min(
          (timePassed / shiftDurationMs) * 100,
          100,
        );
        setProgress(percentComplete);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, shiftDurationMs, checkInTime]);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  if (isShiftOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.overtimeText}>Shift Completed! 🎉</Text>
        <Text style={styles.subText}>You can check out now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="timer-sand"
          size={moderateScale(16)}
          color={colors.BRAND_PRIMARY}
        />
        <Text style={styles.label}>Remaining Time</Text>
      </View>

      <Text style={styles.timerText}>
        {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m{" "}
        {formatTime(timeLeft.seconds)}s
      </Text>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      {/* NEW: Side-by-side Check-In and Check-Out timeline */}
      <View style={styles.timeRangeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.metaLabel}>Checked In</Text>
          <Text style={styles.metaValue}>{formattedStartTime}</Text>
        </View>
        <View style={styles.timeBlockRight}>
          <Text style={styles.metaLabel}>Expected Out</Text>
          <Text style={styles.metaValue}>{formattedEndTime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(4),
  },
  label: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: moderateScale(12),
    color: "#6B7280",
    marginLeft: moderateScale(4),
  },
  timerText: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(22),
    color: "#1F2937",
    fontVariant: ["tabular-nums"],
    marginBottom: moderateScale(8),
  },
  overtimeText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: colors.BRAND_SECONDARY,
  },
  subText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: moderateScale(12),
    color: "#6B7280",
  },
  progressBarBackground: {
    width: "100%",
    height: moderateScale(6),
    backgroundColor: "#E5E7EB",
    borderRadius: moderateScale(3),
    overflow: "hidden",
    marginBottom: moderateScale(10),
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.BRAND_PRIMARY,
    borderRadius: moderateScale(3),
  },
  timeRangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: moderateScale(4),
  },
  timeBlock: {
    alignItems: "flex-start",
  },
  timeBlockRight: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: moderateScale(11),
    color: "#9CA3AF",
  },
  metaValue: {
    fontFamily: "Nunito_700Bold",
    fontSize: moderateScale(13),
    color: "#374151",
    marginTop: moderateScale(2),
  },
});
