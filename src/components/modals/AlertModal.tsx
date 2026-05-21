import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
// Assuming you have your theme colors
import { colors, FONTS } from "@/constants/theme";

export type ActionModalProps = {
  visible: boolean;
  title: string;
  message: string;
  icon?: React.ReactNode; // Allows passing any custom icon
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void; // If undefined, the Cancel button is hidden
  confirmColor?: string; // Allows overriding the button color for destructive actions (e.g., Red for Delete)
};

export default function ActionModal({
  visible,
  title,
  message,
  icon,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmColor = colors.Brand_Blue || "#2076C7",
}: ActionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel || onConfirm} // Handles Android physical back button
    >
      {/* TouchableWithoutFeedback allows closing the modal by tapping outside of it (optional) */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Optional Icon */}
              {icon && <View style={styles.iconWrapper}>{icon}</View>}

              {/* Text Content */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                {/* Conditionally render the Cancel button */}
                {onCancel && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}

                {/* Confirm Button */}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: confirmColor }]}
                  onPress={onConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent backdrop
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(20),
    padding: moderateScale(24),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // For Android shadow
  },
  iconWrapper: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: FONTS.bold,
    color: "#111827",
    marginBottom: moderateScale(10),
    textAlign: "center",
  },
  message: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.regular,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: moderateScale(24),
    lineHeight: moderateScale(20),
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: moderateScale(12), // Adds perfect spacing between buttons
  },
  button: {
    flex: 1,
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.semiBold,
    color: "#374151",
  },
  confirmButtonText: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
  },
});
