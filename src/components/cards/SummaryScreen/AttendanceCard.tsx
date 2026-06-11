import { colors, FONTS } from "@/constants/theme";
import { AttendanceDayRecord } from "@/types/attendance";
import { formatTime } from "@/utils/Date-TimeHelpers";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface AttendanceCardProps {
  data: AttendanceDayRecord;
  onViewDetails: () => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  data,
  onViewDetails,
}) => {
  const { date, status, myAttendance, isWeekOff } = data;
  const dateObj = new Date(date);

  const dayNum = dateObj.getDate().toString().padStart(2, "0");
  const dayName = dateObj
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();

  // 1. Identify the specific statuses (adjust strings based on your exact API response)
  const isPresent = status === "P" || status === "Present";
  const isAbsent = status === "A" || status === "Absent";
  const isHalfDay = status === "H" || status === "Half";
  const isCompOff = status === "CO" || status === "CompOff";

  // 2. Assign unique colors for each status badge
  let badgeColor = "#64748B"; // Default (WeekOff or undefined status)

  if (isPresent) {
    badgeColor = colors.Success_Green;
  } else if (isAbsent && !isWeekOff) {
    badgeColor = colors.Danger_Red;
  } else if (isHalfDay) {
    badgeColor = colors.Warning_Yellow;
  } else if (isCompOff) {
    badgeColor = colors.Brand_Blue
  }

  return (
    <View
      style={[
        styles.cardContainer,
        isCompOff ? { borderColor: badgeColor, borderWidth: 1.5 } : { borderTopColor: "#F1F5F9", borderTopWidth: 4 }
      ]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.dayNum}>{dayNum}</Text>
          <Text style={styles.dayName}>{dayName}</Text>
        </View>

        {/* Badge styling automatically adapts to the chosen color and applies 15% opacity to the background */}
        <View style={[styles.badge, { backgroundColor: badgeColor + "15" }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>
            {status}
          </Text>
        </View>
      </View>

      {/* 3. Safely check if myAttendance exists to prevent crashes on Absent/CompOff days */}
      {myAttendance ? (
        <View style={styles.timeSection}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>IN</Text>
            <Text style={styles.timeValue}>
              {formatTime(myAttendance.inTime)}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>OUT</Text>
            <Text style={styles.timeValue}>
              {formatTime(myAttendance.outTime)}
            </Text>
          </View>
          <View style={[styles.timeRow, styles.hoursRow]}>
            <Text style={styles.timeLabel}>HRS</Text>
            <Text style={styles.hoursValue}>
              {myAttendance.totalHours ? `${myAttendance.totalHours}h` : "--"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ghostButton, isCompOff ? { borderColor: badgeColor, borderWidth: 1.5 } : { borderColor: colors.Brand_Green, }]}
            activeOpacity={0.7}
            onPress={onViewDetails}
          >
            <Text style={[styles.ghostButtonText, isCompOff ? { color: badgeColor } : { color: colors.Brand_Green }]}>View Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptySpace} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    margin: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(12),
  },
  dayNum: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(22),
    color: "#0F172A",
  },
  dayName: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#64748B",
  },
  badge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
  },
  timeSection: {
    marginTop: moderateScale(8),
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(6),
  },
  timeLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#94A3B8",
  },
  timeValue: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: "#334155",
  },
  hoursRow: {
    marginTop: moderateScale(6),
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: moderateScale(6),
  },
  hoursValue: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(12),
    color: "#573CFF",
  },
  emptySpace: {
    minHeight: moderateScale(40),
  },
  ghostButton: {
    marginTop: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    alignItems: "center",
  },
  ghostButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
  },
});

export default AttendanceCard;