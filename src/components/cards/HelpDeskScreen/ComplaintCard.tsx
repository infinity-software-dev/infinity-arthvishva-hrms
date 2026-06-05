import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { ComplaintProps } from "@/hooks/useComplaintsHistory";

interface ComplaintCardProps {
  complaint: ComplaintProps;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  // Helper to format MongoDB dates beautifully
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper to determine the status badge color dynamically
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return { bg: `${colors.Success_Green}15`, text: colors.Success_Green };
      case "Rejected":
        return { bg: `${colors.Danger_Red}15`, text: colors.Danger_Red };
      case "In Review":
      case "Acknowledged":
        return { bg: `${colors.Brand_Blue}15`, text: colors.Brand_Blue };
      case "Pending":
      default:
        return { bg: `${colors.Warning_Yellow}20`, text: colors.Warning_Yellow };
    }
  };

  const statusStyle = getStatusStyle(complaint.status);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{complaint.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {complaint.status}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {complaint.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.metaData}>
          <Ionicons name="calendar-outline" size={moderateScale(14)} color="#94A3B8" />
          <Text style={styles.dateText}>{formatDate(complaint.createdAt)}</Text>
        </View>

        {complaint.priority === "High" && (
          <View style={styles.metaData}>
            <Ionicons name="alert-circle" size={moderateScale(14)} color={colors.Danger_Red} />
            <Text style={[styles.dateText, { color: colors.Danger_Red }]}>High Priority</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(10),
  },
  categoryPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(11),
    color: "#475569",
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#0F172A",
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(20),
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(12),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  metaData: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#94A3B8",
  },
});