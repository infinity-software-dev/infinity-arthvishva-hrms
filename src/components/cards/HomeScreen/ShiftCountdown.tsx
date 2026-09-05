import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

interface ShiftCountdownProps {
  checkInTime: Date;
  shiftDurationHours?: number;
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
  const [isTargetReached, setIsTargetReached] = useState(false);
  const [showHalfDay, setShowHalfDay] = useState(false);

  // Automatically detect Saturday from checkInTime
  const isSaturday = checkInTime.getDay() === 6;

  // Saturday: 7h full / 3.5h half. Mon-Fri: 8.5h full / 4.5h half
  const FULL_DAY_HOURS = shiftDurationHours ?? (isSaturday ? 7 : 8.5);
  const HALF_DAY_HOURS = FULL_DAY_HOURS / 2;

  const {
    formattedStartTime,
    fullEndTime,
    halfEndTime,
    formattedEndTime,
    formattedHalfDayEndTime,
    fullDurationMs,
    halfDurationMs,
  } = useMemo(() => {
    const fullMs = FULL_DAY_HOURS * 60 * 60 * 1000;
    const halfMs = HALF_DAY_HOURS * 60 * 60 * 1000;

    const fullEnd = new Date(checkInTime.getTime() + fullMs);
    const halfEnd = new Date(checkInTime.getTime() + halfMs);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      formattedStartTime: checkInTime.toLocaleTimeString([], timeOptions),
      fullEndTime: fullEnd,
      halfEndTime: halfEnd,
      formattedEndTime: fullEnd.toLocaleTimeString([], timeOptions),
      formattedHalfDayEndTime: halfEnd.toLocaleTimeString([], timeOptions),
      fullDurationMs: fullMs,
      halfDurationMs: halfMs,
    };
  }, [checkInTime, FULL_DAY_HOURS, HALF_DAY_HOURS]);

  const currentTargetTime = showHalfDay ? halfEndTime : fullEndTime;
  const currentDurationMs = showHalfDay ? halfDurationMs : fullDurationMs;
  const currentTargetHours = showHalfDay ? HALF_DAY_HOURS : FULL_DAY_HOURS;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = currentTargetTime.getTime() - now;

      if (difference <= 0) {
        setIsTargetReached(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
      } else {
        setIsTargetReached(false);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });

        const timePassed = now - checkInTime.getTime();
        const percentComplete = Math.min(
          (timePassed / currentDurationMs) * 100,
          100
        );
        setProgress(Math.max(percentComplete, 0));
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [currentTargetTime, currentDurationMs, checkInTime]);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <View style={styles.container}>
      {isTargetReached ? (
        <View style={styles.completedContainer}>
          <Text style={styles.overtimeText}>
            {showHalfDay ? "Half Day Completed! 🎯" : "Shift Completed! 🎉"}
          </Text>
          <Text style={styles.subText}>You can check out now.</Text>
        </View>
      ) : (
        <>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="timer-sand"
              size={moderateScale(16)}
              color={colors.BRAND_PRIMARY}
            />
            <Text style={styles.label}>
              {showHalfDay
                ? `Remaining to Half Day (${HALF_DAY_HOURS}h)`
                : `Remaining to Full Day (${FULL_DAY_HOURS}h)`}
            </Text>
          </View>

          <Text style={styles.timerText}>
            {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m{" "}
            {formatTime(timeLeft.seconds)}s
          </Text>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </>
      )}

      <View style={styles.timeRangeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.metaLabel}>Checked In</Text>
          <Text style={styles.metaValue}>{formattedStartTime}</Text>
        </View>

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
            {`● ${showHalfDay ? "Half Day" : "Full Day"} (${currentTargetHours} hrs)`}
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
  completedContainer: {
    alignItems: "center",
    marginBottom: moderateScale(10),
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
    alignItems: "flex-start",
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
    color: colors.BRAND_PRIMARY,
    marginTop: moderateScale(2),
  },
});