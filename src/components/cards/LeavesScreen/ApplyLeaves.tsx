import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import UniversalButton from "@/components/buttons/UniversalButton";
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import LeaveTypesModal from "@/components/modals/LeaveTypesModal";
import { useApplyLeave } from "@/hooks/useApplyLeave";
import ActionModal from "@/components/modals/AlertModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import LedgerSelectionVault from "./LedgerSelectionVault";
import LedgerBalanceCard from "./LedgerBalanceCard";
import LedgerTokenDetails from "@/components/modals/LedgerTokenDetails";

export default function ApplyLeaves() {
  const { state, actions } = useApplyLeave();

  // 1. Basic Form Validation
  const isFormValid = state.selectedValue !== "" && state.reason.trim() !== "";

  // 2.NEW: Token Validation
  const needsTokens = state.selectedValue === "CompOff" || state.selectedValue === "Paid";
  const hasEnoughTokens = state.selectedTokenValueSum >= state.totalDays;

  // 3. Final Button State (Disabled if form is empty, submitting, OR if they haven't picked enough tokens)
  const isDisabled = state.isSubmitting || !isFormValid || (needsTokens && !hasEnoughTokens);

  return (
    <>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={moderateScale(120)}
      >
        <LedgerBalanceCard
          balances={{
            paid: state.activeLedgerTokens
              .filter(t => t.leaveType === 'Paid')
              .reduce((sum, token) => sum + (token.value || 1), 0),

            // Sum the 'value' of all CompOff tokens (so two 0.5 tokens equal 1.0)
            compOff: state.activeLedgerTokens
              .filter(t => t.leaveType === 'CompOff')
              .reduce((sum, token) => sum + (token.value || 1), 0)
          }}
          onViewDetails={actions.openLedgerInfo}
        />

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Leave Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LEAVE TYPE</Text>
            <TouchableOpacity
              style={styles.inputBox}
              activeOpacity={0.7}
              onPress={() => actions.setOptionVisible(true)}
            >
              {state.selectedValue ? (
                <Text style={styles.inputText}>{state.selectedValue}</Text>
              ) : (
                <Text style={styles.inputTextPlaceholder}>
                  Choose leave category
                </Text>
              )}
              <Ionicons
                name="chevron-down"
                size={moderateScale(20)}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* NEW: Ledger Selection Vault rendered dynamically  */}
          {(state.selectedValue === "CompOff" || state.selectedValue === "Paid") && (
            <LedgerSelectionVault
              leaveType={state.selectedValue}
              allTokens={state.activeLedgerTokens}
              selectedTokenIds={state.selectedTokenIds}
              onToggleToken={actions.toggleTokenSelection}
              requiredDays={state.totalDays}
            />
          )}

          {/* Dates Row */}
          <View style={styles.row}>
            {/* FROM DATE */}
            <View
              style={[
                styles.inputGroup,
                { flex: 1, marginRight: moderateScale(12) },
              ]}
            >
              <Text style={styles.inputLabel}>FROM DATE</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={actions.openFromPicker}
                activeOpacity={0.7}
              >
                <Text style={styles.inputText}>
                  {actions.formatDate(state.fromDate)}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={moderateScale(18)}
                  color={colors.Brand_Blue}
                />
              </TouchableOpacity>
            </View>

            {/* TO DATE */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>TO DATE</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={actions.openToPicker}
                activeOpacity={0.7}
              >
                <Text style={styles.inputText}>
                  {actions.formatDate(state.toDate)}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={moderateScale(18)}
                  color={colors.Brand_Blue}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration & Half Day Toggle */}
          <View
            style={[
              styles.durationRow,
              state.isHalfDay && { marginBottom: moderateScale(12) },
            ]}
          >
            <View style={styles.durationPill}>
              <Ionicons
                name="time-outline"
                size={moderateScale(16)}
                color={colors.Brand_Blue}
              />
              <Text style={styles.durationText}>
                {state.totalDays} {state.totalDays === 1 ? "Day" : "Days"}{" "}
                Selected
              </Text>
            </View>

            <TouchableOpacity
              style={styles.halfDayToggle}
              activeOpacity={0.7}
              onPress={() => actions.setIsHalfDay(!state.isHalfDay)}
            >
              <Text style={styles.halfDayText}>Half Day</Text>
              <View
                style={[
                  styles.radioCircle,
                  state.isHalfDay && styles.radioCircleActive,
                ]}
              >
                {state.isHalfDay && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Shift Selection */}
          {state.isHalfDay && (
            <View style={styles.shiftRow}>
              <TouchableOpacity
                style={[
                  styles.shiftPill,
                  state.halfDayShift === "Morning" && styles.shiftPillActive,
                ]}
                onPress={() => actions.setHalfDayShift("Morning")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="partly-sunny-outline"
                  size={moderateScale(16)}
                  color={
                    state.halfDayShift === "Morning"
                      ? "#FFFFFF"
                      : colors.Brand_Blue
                  }
                />
                <Text
                  style={[
                    styles.shiftPillText,
                    state.halfDayShift === "Morning" &&
                    styles.shiftPillTextActive,
                  ]}
                >
                  Morning
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shiftPill,
                  state.halfDayShift === "Afternoon" && styles.shiftPillActive,
                ]}
                onPress={() => actions.setHalfDayShift("Afternoon")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="sunny-outline"
                  size={moderateScale(16)}
                  color={
                    state.halfDayShift === "Afternoon"
                      ? "#FFFFFF"
                      : colors.Brand_Blue
                  }
                />
                <Text
                  style={[
                    styles.shiftPillText,
                    state.halfDayShift === "Afternoon" &&
                    styles.shiftPillTextActive,
                  ]}
                >
                  Afternoon
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reason Text Area */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>REASON FOR LEAVE</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Explain why you're taking time off..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={state.reason}
              onChangeText={actions.setReason}
            />
          </View>
        </View>

        {/* Submit Button */}
        <UniversalButton
          title={state.isSubmitting ? "Submitting..." : "Submit Leave Request"}
          color={colors.Brand_Green}
          onPress={actions.handleSubmit}
          disabled={isDisabled}
          icon={
            state.isSubmitting ? (
              <ActivityIndicator
                color="#FFFFFF"
                size="small"
                style={{ marginRight: moderateScale(8) }}
              />
            ) : (
              <Ionicons
                name="send"
                size={moderateScale(18)}
                color="#FFFFFF"
                style={{ marginRight: moderateScale(8) }}
              />
            )
          }
        />
      </KeyboardAwareScrollView>

      <ActionModal
        visible={state.actionModal.visible}
        title={state.actionModal.title}
        message={state.actionModal.message}
        onConfirm={actions.closeActionModal}
        confirmText="Got it"
        confirmColor={
          state.actionModal.type === "success"
            ? colors.Brand_Green
            : colors.Danger_Red
        }
        icon={
          state.actionModal.type === "success" ? (
            <Ionicons
              name="checkmark-circle"
              size={moderateScale(32)}
              color={colors.Brand_Green}
            />
          ) : (
            <Ionicons
              name="alert-circle"
              size={moderateScale(32)}
              color={colors.Danger_Red}
            />
          )
        }
      />

      <CustomBottomModal
        title="Select Leave Type"
        onClose={() => actions.setOptionVisible(false)}
        isVisible={state.isOptionVisible}
      >
        <LeaveTypesModal
          selectedValue={state.selectedValue}
          onSelect={(val: string) => {
            actions.setSelectedValue(val);
          }}
        />
      </CustomBottomModal>


      <LedgerTokenDetails
        tokens={state.activeLedgerTokens.filter(t => t.leaveType === state.ledgerInfoModal.leaveType)}
        leaveType={state.ledgerInfoModal.leaveType}
        onClose={actions.closeLedgerInfo}
        isVisible={state.ledgerInfoModal.visible}
      />

      {/* iOS ONLY: Render DatePickers safely inside Bottom Sheets */}
      {Platform.OS === "ios" && (
        <>
          <CustomBottomModal
            title="Select Start Date"
            isVisible={state.showFromPicker}
            onClose={() => actions.handleDismiss("from")}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <DateTimePicker
                value={state.fromDate || new Date()}
                mode="date"
                display="spinner"
                onChange={actions.handleFromDateChange}
              />
            </View>
            <UniversalButton
              title="Confirm Date"
              color={colors.Brand_Blue}
              onPress={() => actions.handleDismiss("from")}
            />
          </CustomBottomModal>

          <CustomBottomModal
            title="Select End Date"
            isVisible={state.showToPicker}
            onClose={() => actions.handleDismiss("to")}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <DateTimePicker
                value={state.toDate || new Date()}
                mode="date"
                display="spinner"
                onChange={actions.handleToDateChange}
              />
            </View>
            <UniversalButton
              title="Confirm Date"
              color={colors.Brand_Blue}
              onPress={() => actions.handleDismiss("to")}
            />
          </CustomBottomModal>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.Base_Background },
  contentContainer: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(20),
  },

  formSection: { marginBottom: moderateScale(24) },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputGroup: { marginBottom: moderateScale(16) },
  inputLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#64748B",
    marginBottom: moderateScale(8),
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(50),
  },
  inputTextPlaceholder: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#94A3B8",
  },
  inputText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(14),
    color: "#0F172A",
  },
  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.Brand_Blue}15`,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  durationText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: colors.Brand_Blue,
    marginLeft: moderateScale(6),
  },
  halfDayToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  halfDayText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(13),
    color: "#475569",
    marginRight: moderateScale(10),
  },
  radioCircle: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleActive: { borderColor: colors.Brand_Green },
  radioInner: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.Brand_Green,
  },
  shiftRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(24),
    gap: moderateScale(12),
  },
  shiftPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: moderateScale(6),
  },
  shiftPillActive: {
    backgroundColor: colors.Brand_Blue,
    borderColor: colors.Brand_Blue,
  },
  shiftPillText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(13),
    color: "#475569",
  },
  shiftPillTextActive: { color: "#FFFFFF" },
  textArea: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#0F172A",
    minHeight: moderateScale(100),
  },
});