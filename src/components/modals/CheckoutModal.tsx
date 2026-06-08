import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import GradientButton from "../buttons/GradientButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  fetchManagementEmployees,
  ManagementEmployee,
} from "@/services/attendanceService";

interface CheckoutFormData {
  todayWork: string;
  pendingWork: string;
  issuesFaced: string;
  reportParticipants: string[];
}

interface CheckoutModalProps {
  onConfirm: (data: CheckoutFormData) => void;
  onCancel: () => void;
}

export default function CheckoutModal({
  onConfirm,
  onCancel,
}: CheckoutModalProps) {
  const [todayWork, setTodayWork] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [issuesFaced, setIssuesFaced] = useState("");

  const [employees, setEmployees] = useState<ManagementEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const insets = useSafeAreaInsets();

  // 1. Validation updated: No longer depends on participant selection
  const isFormIncomplete =
    !todayWork.trim() || !pendingWork.trim() || !issuesFaced.trim();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchManagementEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to load management employees", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const handleSubmit = () => {
    onConfirm({
      todayWork,
      pendingWork,
      issuesFaced,
      reportParticipants: employees.map((emp) => emp._id),
    });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, moderateScale(10)) },
      ]}
    >
      <Text style={styles.subtitle}>
        Please fill out your work summary before checking out.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Today's Work *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What did you accomplish today?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={todayWork}
            onChangeText={setTodayWork}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pending Work *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What is left for tomorrow?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            value={pendingWork}
            onChangeText={setPendingWork}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Issues Faced *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Any blockers or challenges?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            value={issuesFaced}
            onChangeText={setIssuesFaced}
          />
        </View>

        {/* 3. Read-only UI for Reporting Managers */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reporting To</Text>
          <View style={styles.pillContainer}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.Brand_Blue}
                style={styles.loader}
              />
            ) : employees.length === 0 ? (
              <Text style={styles.emptyText}>
                No reporting managers assigned.
              </Text>
            ) : (
              employees.map((emp) => (
                // Replaced TouchableOpacity with a static View
                <View key={emp._id} style={styles.readOnlyPill}>
                  <Text style={styles.readOnlyPillText}>{emp.name}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: moderateScale(15) }}>
          <GradientButton
            text="Submit"
            onPress={handleSubmit}
            disabled={isFormIncomplete}
            customStyles={{ marginVertical: 0 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexShrink: 1,
  },
  scrollView: {
    flexShrink: 1,
    flexGrow: 1,
  },
  subtitle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.semiBold,
    color: "#6B7280",
    marginBottom: moderateScale(20),
  },
  scrollContent: {
    paddingBottom: moderateScale(20),
  },
  inputGroup: {
    marginBottom: moderateScale(16),
  },
  label: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.bold,
    color: "#374151",
    marginBottom: moderateScale(8),
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
    minHeight: moderateScale(80),
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
    minHeight: moderateScale(35),
  },
  loader: {
    marginTop: moderateScale(5),
  },
  emptyText: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.semiBold,
    color: "#9CA3AF",
    marginTop: moderateScale(5),
  },
  // 4. Updated pill styles to look like static tags
  readOnlyPill: {
    backgroundColor: "#EFF6FF", // Light blue background
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8), // Less rounded, looks more like a tag
    borderWidth: 1,
    borderColor: "#DBEAFE", // Very subtle border
  },
  readOnlyPillText: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.bold,
    color: colors.Brand_Blue, // Matches your brand
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
  cancelButton: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(30),
  },
  cancelText: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.bold,
    color: "#9CA3AF",
  },
});