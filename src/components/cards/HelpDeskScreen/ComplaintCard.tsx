import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { ComplaintProps } from "@/hooks/useHelpDesk";

interface ComplaintCardProps {
  complaint: ComplaintProps;
  onPress?: (complaint: ComplaintProps) => void;
}

export default function ComplaintCard({
  complaint,
  onPress,
}: ComplaintCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return { color: colors.Success_Green, bg: `${colors.Success_Green}15` };
      case "Rejected":
        return { color: colors.Danger_Red, bg: `${colors.Danger_Red}15` };
      case "Acknowledged":
      case "In Review":
        return { color: colors.Brand_Blue, bg: `${colors.Brand_Blue}15` };
      case "Pending":
      default:
        return {
          color: colors.Warning_Yellow,
          bg: `${colors.Warning_Yellow}15`,
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return colors.Danger_Red;
      case "Medium":
        return colors.Rise_Orange || "#F97316";
      case "Low":
        return colors.Brand_Green;
      default:
        return "#94A3B8";
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusTheme = getStatusStyle(complaint.status);
  const priorityColor = getPriorityColor(complaint.priority);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress && onPress(complaint)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Ionicons
            name="folder-outline"
            size={moderateScale(12)}
            color="#64748B"
          />
          <Text style={styles.categoryText}>{complaint.category}</Text>
        </View>
        <View style={styles.priorityWrapper}>
          <View
            style={[styles.priorityDot, { backgroundColor: priorityColor }]}
          />
          <Text style={[styles.priorityText, { color: priorityColor }]}>
            {complaint.priority}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {complaint.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.dateWrapper}>
          <Ionicons
            name="calendar-outline"
            size={moderateScale(14)}
            color="#94A3B8"
          />
          <Text style={styles.dateText}>{formatDate(complaint.createdAt)}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusTheme.bg }]}>
          <Text style={[styles.statusText, { color: statusTheme.color }]}>
            {complaint.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: colors.Brand_Green_Dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
    gap: moderateScale(4),
  },
  categoryText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(11),
    color: "#64748B",
  },
  priorityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  priorityDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  priorityText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    color: "#0F172A",
    marginBottom: moderateScale(6),
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(16),
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#94A3B8",
  },
  statusPill: {
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
});
