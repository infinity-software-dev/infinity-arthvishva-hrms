import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import { AttendanceDayRecord } from "@/types/attendance";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import UniversalButton from "@/components/buttons/UniversalButton";
import { submitAttendanceCorrection } from "@/services/attendanceService";
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import CorrectionModal from "@/components/modals/CorrectionModal";
import ActionModal from "@/components/modals/AlertModal";

interface Props {
  data: AttendanceDayRecord;
  onCorrectionSuccess?: (attendanceId: string) => void;
}

const formatTime = (timeString?: string | null) => {
  if (!timeString || timeString === "--:--") return "--:--";
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function AttendanceDetails({ data, onCorrectionSuccess }: Props) {
  const att = data.myAttendance;
  const [isCorrectionModalVisible, setCorrectionModalVisible] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [actionConfig, setActionConfig] = useState({ title: "", message: "" });
  const [isRequestedLocally, setIsRequestedLocally] = useState(false);

  if (!att) return null;

  const isRequested = att.correctionRequested || isRequestedLocally;

  if (!att) return null;

  // Format Date for Header
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const taskData = {
    todayWork: att.todayWork ?? "No submitted report data found.",
    pendingWork: att.pendingWork ?? "NA",
    issuesFaced: att.issuesFaced ?? "NA",
  };

  const handleCorrectionSubmit = async (correctionData: any) => {
    try {
      const response = await submitAttendanceCorrection(
        att._id,
        correctionData,
      );

      setActionConfig({
        title: "Success",
        message: response.message,
      });
      setIsRequestedLocally(true);
      if (onCorrectionSuccess) {
        onCorrectionSuccess(att._id);
      }
      setActionModalVisible(true);
    } catch (error: any) {
      setActionConfig({
        title: "Request Failed",
        message: error.message || "Failed to submit correction.",
      });
      setActionModalVisible(true);
    } finally {
      setCorrectionModalVisible(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: moderateScale(30) }}
      >
        {/* --- HEADER --- */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerDate}>{formattedDate}</Text>
            <Text style={styles.headerSubtitle}>Daily Attendance Report</Text>
          </View>
          <View style={styles.hoursPill}>
            <Text style={styles.hoursPillText}>
              {att.totalHours ? `${att.totalHours}h` : "--"} logged
            </Text>
          </View>
        </View>

        {/* --- TIMELINE SECTION --- */}
        <View style={styles.timelineWrapper}>
          <View style={styles.badgeRow}>
            <View style={styles.modeBadge}>
              <Ionicons
                name="briefcase"
                size={moderateScale(12)}
                color={colors.Magic_Violet}
              />
              <Text style={styles.modeText}>{att.workMode || "Office"}</Text>
            </View>
            {att.isLate && (
              <View style={styles.lateBadge}>
                <Ionicons
                  name="warning"
                  size={moderateScale(12)}
                  color={colors.Warning_Yellow}
                />
                <Text style={styles.lateText}>Late</Text>
              </View>
            )}
          </View>

          <View style={styles.timelineContainer}>
            {/* IN Node */}
            <View style={styles.timelineRow}>
              <View style={styles.nodeContainer}>
                <View
                  style={[
                    styles.node,
                    { backgroundColor: colors.Success_Green },
                  ]}
                />
                <View style={styles.line} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timeLabel}>PUNCH IN</Text>
                <Text style={styles.timeValue}>{formatTime(att.inTime)}</Text>
              </View>
            </View>

            {/* OUT Node */}
            <View
              style={[styles.timelineRow, { marginTop: moderateScale(15) }]}
            >
              <View style={styles.nodeContainer}>
                <View
                  style={[styles.node, { backgroundColor: colors.Danger_Red }]}
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timeLabel}>PUNCH OUT</Text>
                <Text style={styles.timeValue}>{formatTime(att.outTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- REPORT SECTION --- */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>MY REPORT</Text>

          <View style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="work-outline"
                size={moderateScale(16)}
                color="#6366F1"
              />
              <Text style={[styles.cardTitle, { color: colors.Magic_Violet }]}>
                TODAY'S WORK
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{taskData.todayWork}</Text>
            </View>
          </View>

          <View style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="format-list-bulleted"
                size={moderateScale(16)}
                color={colors.Warning_Yellow}
              />
              <Text
                style={[styles.cardTitle, { color: colors.Warning_Yellow }]}
              >
                PENDING TASKS
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{taskData.pendingWork}</Text>
            </View>
          </View>

          <View style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="error-outline"
                size={moderateScale(16)}
                color={colors.Danger_Red}
              />
              <Text style={[styles.cardTitle, { color: colors.Danger_Red }]}>
                ISSUES FACED
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>{taskData.issuesFaced}</Text>
            </View>
          </View>
        </View>

        {/* --- CORRECTION BUTTON --- */}
        <UniversalButton
          title={isRequested ? "Correction Requested" : "Request Correction"}
          variant="soft"
          color={isRequested ? colors.Success_Green : colors.BRAND_PRIMARY}
          icon={
            isRequested ? (
              <Ionicons
                name="checkmark-circle-outline"
                size={moderateScale(18)}
                color={colors.Success_Green}
              />
            ) : (
              <Ionicons
                name="create-outline"
                size={moderateScale(18)}
                color={colors.BRAND_PRIMARY}
              />
            )
          }
          onPress={() => setCorrectionModalVisible(true)}
          style={{ marginTop: moderateScale(10) }}
          disabled={isRequested}
        />
      </ScrollView>
      <CustomBottomModal
        isVisible={isCorrectionModalVisible}
        onClose={() => setCorrectionModalVisible(false)}
        title="Request Correction"
      >
        <CorrectionModal
          attendanceId={att._id}
          recordDate={data.date}
          defaultInTime={att.inTime}
          defaultOutTime={att.outTime}
          onSubmit={handleCorrectionSubmit}
          onCancel={() => setCorrectionModalVisible(false)}
        />
      </CustomBottomModal>

      <ActionModal
        visible={isActionModalVisible}
        title={actionConfig.title}
        message={actionConfig.message}
        onConfirm={() => {
          setActionModalVisible(false);
        }}
        confirmText="OK"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateScale(10),
  },
  // Header Styles
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(20),
  },
  headerDate: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(20),
    color: "#0F172A",
  },
  headerSubtitle: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#94A3B8",
    marginTop: moderateScale(2),
  },
  hoursPill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(12),
  },
  hoursPillText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: colors.Magic_Violet,
  },
  // Timeline Styles
  timelineWrapper: {
    backgroundColor: "#F8FAFC",
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(24),
  },
  badgeRow: {
    flexDirection: "row",
    gap: moderateScale(8),
    marginBottom: moderateScale(16),
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    gap: moderateScale(4),
  },
  modeText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(10),
    color: colors.Magic_Violet,
  },
  lateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    gap: moderateScale(4),
  },
  lateText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(10),
    color: colors.Warning_Yellow,
  },
  timelineContainer: {
    marginLeft: moderateScale(4),
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  nodeContainer: {
    alignItems: "center",
    width: moderateScale(16),
  },
  node: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    marginTop: moderateScale(4),
    zIndex: 2,
  },
  line: {
    width: moderateScale(2),
    height: moderateScale(40),
    backgroundColor: "#E2E8F0",
    position: "absolute",
    top: moderateScale(16),
    zIndex: 1,
  },
  timelineContent: {
    marginLeft: moderateScale(12),
  },
  timeLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(10),
    color: "#64748B",
    marginBottom: moderateScale(2),
  },
  timeValue: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#0F172A",
  },
  // Report Styles
  reportSection: {
    marginTop: moderateScale(8),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: "#94A3B8",
    marginBottom: moderateScale(12),
    letterSpacing: 0.5,
  },
  reportCard: {
    marginBottom: moderateScale(16),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(8),
    gap: moderateScale(6),
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    letterSpacing: 0.5,
  },
  cardBody: {
    backgroundColor: "#F8FAFC",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#334155",
    lineHeight: moderateScale(20),
  },
  // Correction Button Styles
  correctionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF", // Light blue background
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginTop: moderateScale(10),
    gap: moderateScale(8),
  },
  correctionButtonText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(14),
    color: colors.BRAND_PRIMARY, // Assuming you have BRAND_PRIMARY in your theme
  },
});
