import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { ComplaintProps } from "@/hooks/useHelpDesk";

interface ComplaintCardProps {
  complaint: ComplaintProps;
  onWithdraw?: (id: string) => void;
}

export default function ComplaintCard({ complaint, onWithdraw }: ComplaintCardProps) {
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
        return { bg: `${colors.BRAND_PRIMARY}15`, text: colors.BRAND_PRIMARY };
      case "Pending":
        return { bg: `${colors.Warning_Yellow}15`, text: colors.Warning_Yellow };
      case "Withdrawn":
        return { bg: "#F1F5F9", text: "#64748B" };
      default:
        return { bg: `${colors.Warning_Yellow}20`, text: colors.Warning_Yellow };
    }
  };

  const statusStyle = getStatusStyle(complaint.status);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.categoryPill}>
          <Ionicons name="pricetag-outline" size={moderateScale(12)} color="#64748B" />
          <Text style={styles.categoryText}> {complaint.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{complaint.status}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.title}>{complaint.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{complaint.description}</Text>

      {/* Unified Footer */}
      <View style={styles.footerRow}>
        <View style={styles.metaContainer}>
          <View style={styles.metaData}>
            <Ionicons name="calendar-outline" size={moderateScale(13)} color="#94A3B8" />
            <Text style={styles.dateText}>{formatDate(complaint.createdAt)}</Text>
          </View>

          {complaint.priority === "High" && (
            <View style={[styles.metaData, styles.highPriority]}>
              <Ionicons name="flame" size={moderateScale(13)} color={colors.Danger_Red} />
              <Text style={styles.highPriorityText}>High</Text>
            </View>
          )}
        </View>

        {complaint.status === 'Pending' && onWithdraw && (
          <TouchableOpacity onPress={() => onWithdraw(complaint._id)} style={styles.withdrawBtn}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F1F5F9",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
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
    marginTop: moderateScale(16),
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  metaContainer: {
    flexDirection: 'row',
    gap: moderateScale(12),
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
  highPriority: {
    backgroundColor: `${colors.Danger_Red}10`,
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(4),
  },
  highPriorityText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: colors.Danger_Red,
  },
  withdrawBtn: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    backgroundColor: '#FFF1F2',
    borderRadius: moderateScale(8),
  },
  withdrawText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: colors.Danger_Red,
  },
});