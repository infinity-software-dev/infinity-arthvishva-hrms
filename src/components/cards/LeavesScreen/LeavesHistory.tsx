import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { fetchMyLeaves } from "@/services/leavesService";
import LeaveBalanceCard from "./LeaveBalanceCard";

export default function LeavesHistory() {
  const [leavesData, setLeavesData] = useState<any[]>([]);

  // 1. ADD THIS STATE to hold the summary data from the backend
  const [summaryData, setSummaryData] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    cancelled: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch function
  const loadLeaves = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchMyLeaves();

    setLeavesData(data.leaves);

    // 2. SAVE THE SUMMARY DATA so the card can use it!
    if (data.summary) {
      setSummaryData(data.summary);
    }

    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  // Helper to format backend ISO strings to readable dates (e.g., 2026-05-18)
  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Helper for dynamic styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return {
          color: colors.Success_Green,
          bg: `${colors.Success_Green}15`,
        };
      case "Pending":
        return {
          color: colors.Warning_Yellow,
          bg: `${colors.Warning_Yellow}15`,
        };
      case "Rejected":
      case "Cancelled":
        return {
          color: colors.Danger_Red,
          bg: `${colors.Danger_Red}15`,
        };
      default:
        return {
          color: "#94A3B8",
          bg: "#F1F5F9",
        };
    }
  };

  const renderLeaveCard = ({ item }: { item: any }) => {
    const currentStatus = item.overallStatus || "Unknown";
    const statusTheme = getStatusStyle(currentStatus);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <Text style={styles.leaveType}>{item.leaveType} Leave</Text>
          <View
            style={[styles.statusPill, { backgroundColor: statusTheme.bg }]}
          >
            <Text style={[styles.statusText, { color: statusTheme.color }]}>
              {currentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>FROM</Text>
            <Text style={styles.dateValue}>{formatDate(item.startDate)}</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(16)}
            color="#CBD5E1"
          />
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>TO</Text>
            <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.durationWrapper}>
            <Ionicons
              name="time-outline"
              size={moderateScale(14)}
              color="#64748B"
            />
            <Text style={styles.durationText}>
              {item.totalDays} {item.totalDays === 1 ? "Day" : "Days"}
              {item.halfDay ? ` (${item.halfDayPeriod})` : ""}
            </Text>
          </View>
          <Text style={styles.appliedText}>
            Applied: {formatDate(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && leavesData.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.Brand_Green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 3. The card now successfully receives the summaryData state! */}
      <LeaveBalanceCard
        data={summaryData}
        title="Leave History"
        subTitle="YOUR ATTENDANCE RECORD"
        iconName="calendar-outline"
      />
      <FlatList
        data={leavesData}
        keyExtractor={(item) => item._id}
        renderItem={renderLeaveCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadLeaves}
            tintColor={colors.Brand_Green}
            colors={[colors.Brand_Green]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="folder-open-outline"
              size={moderateScale(48)}
              color="#CBD5E1"
            />
            <Text style={styles.emptyText}>No leave history found</Text>
          </View>
        }
      />
    </View>
  );
}

// ... your existing styles below

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
    padding: moderateScale(16),
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: moderateScale(40),
  },
  // Card Styles
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    shadowColor: colors.Brand_Green_Dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  leaveType: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    color: "#0F172A",
  },
  statusPill: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  // Dates
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(10),
    color: "#94A3B8",
    marginBottom: moderateScale(2),
    letterSpacing: 0.5,
  },
  dateValue: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(14),
    color: "#334155",
  },
  // Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    marginLeft: moderateScale(6),
  },
  appliedText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(11),
    color: "#94A3B8",
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: moderateScale(60),
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#94A3B8",
    marginTop: moderateScale(12),
  },
});
