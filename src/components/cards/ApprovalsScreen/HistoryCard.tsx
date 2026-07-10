import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

export const HistoryCard = ({ item }: { item: any }) => {
  const isApproved = item.overallStatus === "Approved";
  const isRejected = item.overallStatus === "Rejected";

  // 1. Extract the active rejection step, or fallback to the latest step with remarks
  const rejectionStep = item.workflowSteps?.find((step: any) => step.status === "Rejected");
  const approvedStepWithRemarks = item.workflowSteps?.find((step: any) => step.status === "Approved" && step.remarks);
  const activeFeedbackStep = rejectionStep || approvedStepWithRemarks;

  // Determine the display name for the actor who left the remarks
  let reviewerRole = "Reviewer";
  if (activeFeedbackStep) {
    if (activeFeedbackStep.isHRProfileStep) reviewerRole = "HR";
    else if (activeFeedbackStep.isDirectorProfileStep) reviewerRole = "Director";
    else reviewerRole = "Manager";
  }

  // Format Date gracefully (YYYY-MM-DD format handling)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  return (
    <View style={styles.card}>
      {/* Employee & Avatar Profile Information Header Block */}
      <View style={styles.headerRow}>
        {item.employeeId?.profileImageUrl ? (
          <Image
            source={{ uri: item.employeeId.profileImageUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>
              {item.employeeId?.name?.charAt(0) || "E"}
            </Text>
          </View>
        )}

        <View style={styles.employeeInfo}>
          <Text style={styles.empName} numberOfLines={1}>
            {item.employeeId?.name || "Unknown Employee"}
          </Text>
          <Text style={styles.empPosition}>
            {item.employeeId?.position || "Staff Member"}
          </Text>
          <Text style={styles.detailText}>
            {formatDate(item.startDate)} to {formatDate(item.endDate)}
          </Text>
        </View>

        {/* Global Structural Action Status Badge */}
        <View style={[
          styles.statusBadge,
          isApproved ? styles.approvedBadge : isRejected ? styles.rejectedBadge : styles.cancelledBadge
        ]}>
          <Text style={[
            styles.statusText,
            { color: isApproved ? colors.Success_Green : isRejected ? colors.Danger_Red : "#64748B" }
          ]}>
            {item.overallStatus}
          </Text>
        </View>
      </View>

      {/* Leave Details Parameters Meta Row */}
      <View style={styles.subInfoRow}>
        <Ionicons name="calendar-outline" size={moderateScale(13)} color="#475569" style={{ marginRight: moderateScale(4) }} />
        <Text style={styles.categoryText}>{item.leaveCategory} Leave</Text>
        <Text style={styles.dividerDot}>•</Text>
        <Ionicons name="time-outline" size={moderateScale(13)} color="#475569" style={{ marginRight: moderateScale(4) }} />
        <Text style={styles.categoryText}>
          {item.totalDays} {item.totalDays === 1 ? "Day" : "Days"}
          {item.isHalfDay && ` (${item.halfDayPeriod || "Half Day"})`}
        </Text>
      </View>

      {/* Application Reason Text */}
      <View style={styles.reasonContainer}>
        <Text style={styles.reasonLabel}>Employee Reason:</Text>
        <Text style={styles.reasonText}>{item.reason || "No description provided."}</Text>
      </View>

      {/* Dynamic Workflow Audit Execution Logs Trail */}
      {activeFeedbackStep?.remarks && (
        <View style={[styles.remarksContainer, isRejected && styles.remarksContainerRejected]}>
          <Text style={[styles.remarksLabel, isRejected && { color: colors.Danger_Red }]}>
            {reviewerRole} Remarks:
          </Text>
          <Text style={[styles.remarksText, isRejected && { color: "#991B1B" }]}>
            "{activeFeedbackStep.remarks}"
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(10),
    backgroundColor: "#F1F5F9",
  },
  avatarFallback: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10),
  },
  avatarFallbackText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#475569",
  },
  employeeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  empName: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(14),
    color: "#0F172A",
  },
  empPosition: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(11),
    color: "#64748B",
    marginBottom: moderateScale(2),
  },
  detailText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(11),
    color: "#94A3B8",
  },
  subInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(12),
    backgroundColor: "#F8FAFC",
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  categoryText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#334155",
  },
  dividerDot: {
    marginHorizontal: moderateScale(8),
    color: "#CBD5E1",
    fontFamily: FONTS.bold,
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    alignSelf: "flex-start",
  },
  approvedBadge: { backgroundColor: `${colors.Success_Green}12` },
  rejectedBadge: { backgroundColor: `${colors.Danger_Red}12` },
  cancelledBadge: { backgroundColor: "#F1F5F9" },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(10),
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  reasonContainer: {
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(2),
  },
  reasonLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  reasonText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#475569",
    marginTop: moderateScale(2),
  },
  remarksContainer: {
    marginTop: moderateScale(12),
    paddingTop: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  remarksContainerRejected: {
    backgroundColor: "#FEF2F2",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    borderTopWidth: 0,
    marginTop: moderateScale(12),
  },
  remarksLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#64748B",
  },
  remarksText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#334155",
    marginTop: moderateScale(2),
    fontStyle: "italic",
  },
});