import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import UniversalButton from "../buttons/UniversalButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionModal from "./AlertModal";

interface ChangePasswordFormProps {
  onCancel: () => void;
  onSubmit: (oldPass: string, newPass: string) => void;
}

const ChangePasswordModal = ({
  onCancel,
  onSubmit,
}: ChangePasswordFormProps) => {
  const insets = useSafeAreaInsets();

  // Consolidated Object-Based State
  const [state, setState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    showOld: false,
    showNew: false,
    showConfirm: false,
    loading: false,
    modalVisible: false,
    modalTitle: "",
    modalMessage: "",
  });

  // Helper function to update individual state properties
  const updateState = (key: keyof typeof state, value: string | boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Validation Logic
  const isMismatch =
    state.confirmPassword.length > 0 && state.newPassword !== state.confirmPassword;

  const isSubmitDisabled =
    !state.oldPassword ||
    !state.newPassword ||
    !state.confirmPassword ||
    state.newPassword !== state.confirmPassword;

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    if (state.newPassword.length < 6) {
      setState((prev) => ({
        ...prev,
        modalTitle: "Error",
        modalMessage: "New password must be at least 6 characters.",
        modalVisible: true,
      }));
      return;
    }

    updateState("loading", true);

    // Pass data up to ProfileScreen, then clear the form
    onSubmit(state.oldPassword, state.newPassword);

    // Reset specific form fields after submission
    setState((prev) => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      loading: false,
    }));
  };

  // Reusable Password Input Component
  const renderPasswordInput = (
    label: string,
    value: string,
    stateKey: "oldPassword" | "newPassword" | "confirmPassword",
    isShowing: boolean,
    showStateKey: "showOld" | "showNew" | "showConfirm",
    placeholder: string,
    hasError?: boolean,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, hasError && styles.inputError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(val) => updateState(stateKey, val)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={!isShowing}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => updateState(showStateKey, !isShowing)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isShowing ? "eye-off-outline" : "eye-outline"}
            size={moderateScale(20)}
            color={hasError ? colors.Danger_Red : "#64748B"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {renderPasswordInput(
          "Old Password",
          state.oldPassword,
          "oldPassword",
          state.showOld,
          "showOld",
          "Enter current password"
        )}

        {renderPasswordInput(
          "New Password",
          state.newPassword,
          "newPassword",
          state.showNew,
          "showNew",
          "Enter new password"
        )}

        {renderPasswordInput(
          "Confirm New Password",
          state.confirmPassword,
          "confirmPassword",
          state.showConfirm,
          "showConfirm",
          "Re-enter new password",
          isMismatch
        )}

        {isMismatch && (
          <Text style={styles.errorNote}>* Passwords do not match</Text>
        )}
      </View>

      <View style={[styles.buttonRow, { paddingBottom: Math.max(insets.bottom, moderateScale(16)) }]}>
        <UniversalButton
          title="Cancel"
          onPress={onCancel}
          variant="ghost"
          color="#475569"
          style={styles.cancelButton}
        />

        <UniversalButton
          title="Update"
          onPress={handleSubmit}
          variant="solid"
          color={colors.BRAND_SECONDARY}
          disabled={isSubmitDisabled}
          isLoading={state.loading}
        />
      </View>

      <ActionModal
        title={state.modalTitle}
        message={state.modalMessage}
        visible={state.modalVisible}
        onConfirm={() => updateState("modalVisible", false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  formContainer: {
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  inputGroup: {
    marginBottom: moderateScale(16),
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#475569",
    marginBottom: moderateScale(6),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(10),
    backgroundColor: "#F8FAFC",
  },
  inputError: {
    borderColor: colors.Danger_Red,
    backgroundColor: `${colors.Danger_Red}1A`,
  },
  input: {
    flex: 1,
    paddingVertical: moderateScale(12),
    paddingLeft: moderateScale(14),
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#1E293B",
  },
  eyeButton: {
    padding: moderateScale(12),
  },
  errorNote: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: colors.Danger_Red,
    marginTop: moderateScale(-10),
    marginBottom: moderateScale(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(12),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  cancelButton: {
    backgroundColor: "#F1F5F9",
    borderRadius: moderateScale(8),
    minWidth: moderateScale(100),
  },
});

export default ChangePasswordModal;