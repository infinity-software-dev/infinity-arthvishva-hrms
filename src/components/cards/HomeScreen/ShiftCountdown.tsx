import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  
  // NEW: State to track which expected out time to show
  const [showHalfDay, setShowHalfDay] = useState(false);

  // Calculate start time, end times, and formatting
  const {
    formattedStartTime,
    endTime,
    formattedEndTime,
    formattedHalfDayEndTime,
    shiftDurationMs,
  } = useMemo(() => {
    const fullDurationMs = shiftDurationHours * 60 * 60 * 1000;
    const halfDurationMs = (shiftDurationHours / 2) * 60 * 60 * 1000;

    const end = new Date(checkInTime.getTime() + fullDurationMs);
    const halfEnd = new Date(checkInTime.getTime() + halfDurationMs);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      formattedStartTime: checkInTime.toLocaleTimeString([], timeOptions),
      endTime: end,
      formattedEndTime: end.toLocaleTimeString([], timeOptions),
      formattedHalfDayEndTime: halfEnd.toLocaleTimeString([], timeOptions),
      shiftDurationMs: fullDurationMs,
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
          100
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

      <View style={styles.timeRangeRow}>
        {/* Left Side: Check In */}
        <View style={styles.timeBlock}>
          <Text style={styles.metaLabel}>Checked In</Text>
          <Text style={styles.metaValue}>{formattedStartTime}</Text>
        </View>

        {/* Right Side: Clickable Expected Out */}
        <TouchableOpacity 
          style={styles.timeBlockRight}
          activeOpacity={0.7}
          onPress={() => setShowHalfDay((prev) => !prev)}
        >
          <Text style={styles.metaLabel}>Expected Out</Text>
          <Text style={styles.metaValue}>
            {showHalfDay ? formattedHalfDayEndTime : formattedEndTime}
          </Text>
          <Text style={styles.subMetaLabel}>
            {showHalfDay ? "Half Day" : "Full Day"}
          </Text>
        </TouchableOpacity>
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
    alignItems: "flex-start", // Ensures alignment at the top even with the extra label on the right
    width: "100%",
    paddingHorizontal: moderateScale(4),
  },
  timeBlock: {
    alignItems: "flex-start",
    flex: 1,
  },
  timeBlockRight: {
    alignItems: "flex-end",
    flex: 1,
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
  subMetaLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: moderateScale(10),
    color: colors.BRAND_PRIMARY, // Using primary color to hint it's interactive/toggled
    marginTop: moderateScale(2),
  }
});