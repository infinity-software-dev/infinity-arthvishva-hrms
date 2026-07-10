import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import UniversalButton from "../buttons/UniversalButton";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ActionModal from "./AlertModal";
import { useCorrectionModal } from "@/hooks/useCorrectionModal";

interface CorrectionModalProps {
  attendanceId: string;
  recordDate: string | Date;
  defaultInTime?: string | null;
  defaultOutTime?: string | null;
  onSubmit: (data: {
    reason: string;
    requestedInTime: Date;
    requestedOutTime: Date;
    proofUrl?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function CorrectionModal({
  recordDate,
  defaultInTime,
  defaultOutTime,
  onSubmit,
  onCancel,
}: CorrectionModalProps) {
  const insets = useSafeAreaInsets();

  // Destructure everything from our custom hook
  const {
    reason,
    setReason,
    proofUrl,
    setProofUrl,
    isLoading,
    hasModifiedTime,
    isConfirmModalVisible,
    setConfirmModalVisible,
    inTime,
    outTime,
    isPickerVisible,
    activePicker,
    isFormIncomplete,
    formattedInTime,
    formattedOutTime,
    workingDuration,
    showPicker,
    hidePicker,
    handleConfirmTime,
    handlePreSubmit,
    handleFinalSubmit,
  } = useCorrectionModal({ recordDate, defaultInTime, defaultOutTime, onSubmit });

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, moderateScale(10)) },
      ]}
    >
      <Text style={styles.subtitle}>
        Provide the correct timings and the reason for this adjustment.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={styles.timeRow}>
          <View style={styles.timeGroup}>
            <Text style={styles.label}>Requested In-Time *</Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => showPicker("in")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={moderateScale(18)}
                color="#64748B"
              />
              <Text style={styles.timeText}>{formattedInTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeGroup}>
            <Text style={styles.label}>Requested Out-Time *</Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => showPicker("out")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={moderateScale(18)}
                color="#64748B"
              />
              <Text style={styles.timeText}>{formattedOutTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reason for Correction *</Text>
          <TextInput
            style={[styles.textInput, { minHeight: moderateScale(80) }]}
            placeholder="E.g., Forgot to punch out, system error..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Proof Link (Optional)</Text>
          <TextInput
            style={[styles.textInput, { minHeight: moderateScale(45) }]}
            placeholder="https://link-to-screenshot-or-email..."
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            value={proofUrl}
            onChangeText={setProofUrl}
          />
        </View>
      </ScrollView>

      {!hasModifiedTime && (
        <Text style={styles.warningText}>
          * Please explicitly select your corrected In-Time or Out-Time.
        </Text>
      )}

      <View style={styles.footer}>
        <UniversalButton
          title="Cancel"
          variant="ghost"
          color="#9CA3AF"
          onPress={onCancel}
          style={{ flex: 1, marginRight: moderateScale(10) }}
        />
        <UniversalButton
          title="Submit Request"
          variant="solid"
          color={colors.BRAND_PRIMARY}
          onPress={handlePreSubmit}
          disabled={isFormIncomplete || isLoading}
          isLoading={isLoading}
          style={{ flex: 1.5 }}
        />
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        date={activePicker === "in" ? inTime : outTime}
        onConfirm={handleConfirmTime}
        onCancel={hidePicker}
        display={Platform.OS === "ios" ? "spinner" : "default"}
      />

      <ActionModal
        visible={isConfirmModalVisible}
        title="Confirm Times"
        message={`Are you sure you want to submit this correction?\n\nIn-Time: ${formattedInTime}\nOut-Time: ${formattedOutTime}\nTotal Working Hours: ${workingDuration}`}
        confirmText="Confirm & Submit"
        cancelText="Review Again"
        onConfirm={handleFinalSubmit}
        onCancel={() => setConfirmModalVisible(false)}
        icon={
          <Ionicons
            name="help-circle-outline"
            size={moderateScale(30)}
            color={colors.BRAND_PRIMARY}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  subtitle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.semiBold,
    color: "#6B7280",
    marginBottom: moderateScale(20),
  },
  scrollView: { flexShrink: 1 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
    gap: moderateScale(15),
  },
  timeGroup: { flex: 1 },
  label: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.bold,
    color: "#374151",
    marginBottom: moderateScale(8),
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    gap: moderateScale(8),
  },
  timeText: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.semiBold,
    color: "#1F2937",
  },
  inputGroup: { marginBottom: moderateScale(20) },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    fontSize: moderateScale(14),
    fontFamily: FONTS.semiBold,
    color: "#1F2937",
  },
  warningText: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.medium,
    color: "#EF4444",
    marginBottom: moderateScale(5),
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateScale(10),
    paddingTop: moderateScale(15),
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
});