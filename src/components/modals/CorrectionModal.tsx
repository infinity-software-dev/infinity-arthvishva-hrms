import React, { useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CorrectionModalProps {
  attendanceId: string;
  recordDate: string | Date;
  defaultInTime?: string | null;
  defaultOutTime?: string | null;
  onSubmit: (data: {
    reason: string;
    requestedInTime: Date;
    requestedOutTime: Date;
    proofUrl?: string; // <-- Added proofUrl to the submit payload
  }) => Promise<void>;
  onCancel: () => void;
}

export default function CorrectionModal({
  attendanceId,
  recordDate,
  defaultInTime,
  defaultOutTime,
  onSubmit,
  onCancel,
}: CorrectionModalProps) {
  const [reason, setReason] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const baseDate = new Date(recordDate);
  const initialIn = defaultInTime
    ? new Date(defaultInTime)
    : new Date(baseDate.setHours(9, 0, 0, 0));
  const initialOut = defaultOutTime
    ? new Date(defaultOutTime)
    : new Date(baseDate.setHours(18, 0, 0, 0));

  const [inTime, setInTime] = useState<Date>(initialIn);
  const [outTime, setOutTime] = useState<Date>(initialOut);

  const [showInPicker, setShowInPicker] = useState(false);
  const [showOutPicker, setShowOutPicker] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleInTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowInPicker(false);
    if (selectedDate) setInTime(selectedDate);
  };

  const handleOutTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowOutPicker(false);
    if (selectedDate) setOutTime(selectedDate);
  };

  const handleDismiss = (type: "in" | "out") => {
    type === "in" ? setShowInPicker(false) : setShowOutPicker(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit({
        reason: reason.trim(),
        requestedInTime: inTime,
        requestedOutTime: outTime,
        proofUrl: proofUrl.trim(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only reason is mandatory for correction requests
  const isFormIncomplete = !reason.trim();

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
              onPress={() => setShowInPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={moderateScale(18)}
                color="#64748B"
              />
              <Text style={styles.timeText}>{formatTime(inTime)}</Text>
            </TouchableOpacity>

            {showInPicker && (
              <DateTimePicker
                value={inTime}
                mode="time"
                display="default"
                onValueChange={handleInTimeChange}
                onDismiss={() => handleDismiss("in")}
              />
            )}
          </View>

          <View style={styles.timeGroup}>
            <Text style={styles.label}>Requested Out-Time *</Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowOutPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={moderateScale(18)}
                color="#64748B"
              />
              <Text style={styles.timeText}>{formatTime(outTime)}</Text>
            </TouchableOpacity>

            {showOutPicker && (
              <DateTimePicker
                value={outTime}
                mode="time"
                display="default"
                onValueChange={handleOutTimeChange}
                onDismiss={() => handleDismiss("out")}
              />
            )}
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
          color={colors.Brand_Blue}
          onPress={handleSubmit}
          disabled={isFormIncomplete || isLoading}
          isLoading={isLoading}
          style={{ flex: 1.5 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  subtitle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.semiBold,
    color: "#6B7280",
    marginBottom: moderateScale(20),
  },
  scrollView: {
    flexShrink: 1,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
    gap: moderateScale(15),
  },
  timeGroup: {
    flex: 1,
  },
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
  inputGroup: {
    marginBottom: moderateScale(20),
  },
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
