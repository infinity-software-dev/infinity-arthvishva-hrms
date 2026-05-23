import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import UniversalButton from "../buttons/UniversalButton";

interface ChangePasswordFormProps {
  onCancel: () => void;
  onSubmit: (oldPass: string, newPass: string) => void;
}

const ChangePasswordModal = ({
  onCancel,
  onSubmit,
}: ChangePasswordFormProps) => {
  // Input states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation Logic
  // Only show the mismatch error if they have typed something in confirmPassword
  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  // Disable button if any field is empty OR if passwords don't match
  const isSubmitDisabled =
    !oldPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword;

  const handleSubmit = () => {
    // Extra safety net just in case
    if (isSubmitDisabled) return;

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }
    setLoading(true);

    // Pass data up to ProfileScreen, then clear the form
    onSubmit(oldPassword, newPassword);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Reusable Password Input Component
  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    isShowing: boolean,
    toggleShowing: () => void,
    placeholder: string,
    hasError?: boolean, // Optional prop to highlight input in red if there's an error
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, hasError && styles.inputError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={!isShowing}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={toggleShowing}
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
          oldPassword,
          setOldPassword,
          showOld,
          () => setShowOld(!showOld),
          "Enter current password",
        )}

        {renderPasswordInput(
          "New Password",
          newPassword,
          setNewPassword,
          showNew,
          () => setShowNew(!showNew),
          "Enter new password",
        )}

        {/* Added the hasError flag to turn border red when mismatching */}
        {renderPasswordInput(
          "Confirm New Password",
          confirmPassword,
          setConfirmPassword,
          showConfirm,
          () => setShowConfirm(!showConfirm),
          "Re-enter new password",
          isMismatch,
        )}

        {/* The note that appears if passwords don't match */}
        {isMismatch && (
          <Text style={styles.errorNote}>* Passwords do not match</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
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
          color={colors.Brand_Green}
          disabled={isSubmitDisabled}
          isLoading={loading}
        />
      </View>
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
