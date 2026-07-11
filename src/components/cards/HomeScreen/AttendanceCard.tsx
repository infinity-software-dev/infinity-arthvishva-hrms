import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import CustomSwipeButton from "@/components/buttons/SwipeButton";
import ShiftCountdown from "./ShiftCountdown";
import { useAttendanceLocation } from "@/hooks/useAttendanceLocation";
import { useAttendanceSession, WorkMode } from "@/hooks/useAttendanceSession";
import { CheckoutData } from "@/services/attendanceService";
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import CheckoutModal from "@/components/modals/CheckoutModal";
import { useFaceVerification } from "@/hooks/useFaceVerification";
import ActionModal from "@/components/modals/AlertModal";

export default function AttendanceCard() {
  const {
    status,
    statusMessage,
    workMode,
    modalVisible,
    modalTitle,
    modalMessage,
    currentTime,
    checkInTime,
    checkOutTime,
    setWorkMode,
    setModalVisible,
    setModalTitle,
    setModalMessage,
    handleCheckInPunch,
    handleCheckOutPunch,
    getTotalTimeLogged,
    formatPunchTime,
  } = useAttendanceSession();

  const { isInsideOffice, distance, shiftHours, isLoadingLocation } =
    useAttendanceLocation(workMode, status);

  const { verifyFaceAction } = useFaceVerification();

  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);


  const isLocationBlocked = workMode === "Office" && !isInsideOffice;

  const handleFaceError = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const onSwipeComplete = () => {
    if (status === "pending") {

      //  CHECK-IN FLOW
      verifyFaceAction(
        "checkin",
        () => handleCheckInPunch(),
        handleFaceError,
      );

    } else if (status === "in") {

      //  CHECK-OUT FLOW
      verifyFaceAction(
        "checkout",
        () => setCheckoutModalVisible(true),
        handleFaceError,
      );

    }
  };

  const handleModalConfirm = (data: CheckoutData) => {
    setCheckoutModalVisible(false);
    handleCheckOutPunch(data);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.label}>Current Time</Text>
            <Text style={styles.timeText}>{currentTime}</Text>
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: isLoadingLocation
                  ? "#EFF6FF" // Light blue for loading
                  : workMode !== "Office" || isInsideOffice
                    ? "#ECFDF5" // Green for active/in-range
                    : "#FFF1F2", // Red for out-of-range
              },
            ]}
          >
            {isLoadingLocation ? (
              <ActivityIndicator
                size={moderateScale(12)}
                color={colors.BRAND_SECONDARY}
                style={{ marginRight: moderateScale(4) }}
              />
            ) : (
              <Ionicons
                name={
                  workMode !== "Office" || isInsideOffice
                    ? "location"
                    : "location-outline"
                }
                size={moderateScale(14)}
                color={
                  workMode !== "Office" || isInsideOffice
                    ? colors.BRAND_SECONDARY
                    : colors.Danger_Red
                }
              />
            )}

            <Text
              style={[
                styles.badgeText,
                {
                  color: isLoadingLocation
                    ? colors.BRAND_SECONDARY
                    : workMode !== "Office" || isInsideOffice
                      ? colors.BRAND_SECONDARY
                      : colors.Danger_Red,
                },
              ]}
            >
              {isLoadingLocation
                ? "Locating..."
                : workMode !== "Office"
                  ? `${workMode} Active`
                  : isInsideOffice
                    ? "At Office"
                    : "Out of Range"}
            </Text>
          </View>
        </View>

        {status === "pending" && (
          <View style={styles.modeSelector}>
            {(["Office", "Field", "WFH"] as WorkMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modePill,
                  workMode === mode && styles.activeModePill,
                ]}
                onPress={() => setWorkMode(mode)}
              >
                <Text
                  style={[
                    styles.modeText,
                    workMode === mode && styles.activeModeText,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.infoBox}>
          {status === "pending" && (
            <>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Shift Duration</Text>
                <Text style={styles.statValue}>{shiftHours} Hours</Text>
              </View>
              {workMode === "Office" && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{distance}</Text>
                  </View>
                </>
              )}
            </>
          )}

          {status === "in" && checkInTime && (
            <View style={{ flex: 1, paddingHorizontal: moderateScale(10) }}>
              <ShiftCountdown
                checkInTime={checkInTime}
                shiftDurationHours={shiftHours}
              />
            </View>
          )}

          {(status === "completed" || status === "blocked") && (
            <View style={styles.summaryContainer}>
              <View style={styles.totalTimeRow}>
                <Text style={styles.statLabel}>
                  {status === "blocked" ? "Status" : "Total Time Logged"}
                </Text>
                <Text
                  style={[
                    styles.totalTimeHighlight,
                    status === "blocked" && { color: colors.Danger_Red },
                  ]}
                >
                  {status === "blocked" ? statusMessage : getTotalTimeLogged()}
                </Text>
              </View>
              <View style={styles.horizontalDivider} />
              <View style={styles.punchTimesRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Check-In</Text>
                  <Text style={styles.statValue}>
                    {formatPunchTime(checkInTime)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Check-Out</Text>
                  <Text style={styles.statValue}>
                    {formatPunchTime(checkOutTime)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {status === "loading" && (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="large" color={colors.BRAND_SECONDARY} />
              <Text style={styles.loadingText}>Verifying...</Text>
            </View>
          )}

          {status === "completed" && (
            <View style={styles.completedWrapper}>
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(30)}
                color={colors.BRAND_SECONDARY}
              />
              <Text style={styles.completedText}>
                {statusMessage || "Shift Completed"}
              </Text>
            </View>
          )}

          {status === "blocked" && (
            <View style={styles.completedWrapper}>
              <Ionicons
                name="calendar-outline"
                size={moderateScale(30)}
                color={colors.BRAND_SECONDARY}
              />
              <Text
                style={[styles.completedText, { color: colors.BRAND_SECONDARY }]}
              >
                {statusMessage}
              </Text>
            </View>
          )}

          {(status === "pending" || status === "in") && (
            <CustomSwipeButton
              title={
                status === "pending"
                  ? "Swipe to Check-In"
                  : "Swipe to Check-Out"
              }
              onComplete={onSwipeComplete}
              disabled={isLocationBlocked}
            />
          )}
        </View>
      </View>
      <CustomBottomModal
        isVisible={isCheckoutModalVisible}
        onClose={() => setCheckoutModalVisible(false)}
        title="Check-out Summary"
      >
        <CheckoutModal
          onConfirm={handleModalConfirm}
          onCancel={() => setCheckoutModalVisible(false)}
        />
      </CustomBottomModal>
      <ActionModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        confirmText="Understood"
        onConfirm={() => setModalVisible(false)}
        confirmColor={colors.Danger_Red}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginHorizontal: moderateScale(20),
    // marginTop: moderateScale(-50),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(20),
  },
  timeText: {
    fontSize: moderateScale(24),
    fontFamily: FONTS.bold,
    color: "#1F2937",
  },
  label: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.semiBold,
    color: "#6B7280",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(12),
  },
  badgeText: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.bold,
    marginLeft: moderateScale(4),
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
    marginBottom: moderateScale(15),
  },
  modePill: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: "center",
    borderRadius: moderateScale(10),
  },
  activeModePill: { backgroundColor: "#FFFFFF", elevation: 3 },
  modeText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#6B7280",
  },
  activeModeText: { color: colors.BRAND_SECONDARY, fontFamily: FONTS.bold },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
    marginBottom: moderateScale(25),
  },
  stat: { flex: 1, alignItems: "center" },
  statLabel: {
    fontSize: moderateScale(11),
    color: "#9CA3AF",
    fontFamily: FONTS.semiBold,
  },
  statValue: {
    fontSize: moderateScale(14),
    color: "#374151",
    fontFamily: FONTS.bold,
  },
  divider: { width: 1, backgroundColor: "#E5E7EB", height: "100%" },
  summaryContainer: { flex: 1, paddingVertical: moderateScale(5) },
  totalTimeRow: { alignItems: "center", marginBottom: moderateScale(12) },
  totalTimeHighlight: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(20),
    color: colors.BRAND_SECONDARY,
    marginTop: moderateScale(2),
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
    marginBottom: moderateScale(12),
  },
  punchTimesRow: { flexDirection: "row", justifyContent: "space-between" },
  buttonContainer: { alignItems: "center" },
  loaderWrapper: {
    height: moderateScale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: moderateScale(8),
    fontFamily: FONTS.semiBold,
    color: colors.BRAND_PRIMARY,
  },
  completedWrapper: {
    height: moderateScale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  completedText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: colors.BRAND_SECONDARY,
    marginTop: moderateScale(4),
  },
});
