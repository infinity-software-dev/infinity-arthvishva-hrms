import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Platform,
  Keyboard,
  Animated,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FONTS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface CustomBottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function CustomBottomModal({
  isVisible,
  onClose,
  children,
  title,
}: CustomBottomModalProps) {
  // Use Animated Value to smoothly transition the padding
  const keyboardPadding = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // iOS uses 'Will' for smoother animations, Android uses 'Did'
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: e.endCoordinates.height, // Push up by exact keyboard height
        duration: e.duration || 250,
        useNativeDriver: false, // paddingBottom does not support native driver
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: 0, // Reset back to bottom perfectly
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.overlay, { paddingBottom: keyboardPadding }]}
      >
        {/* Clickable backdrop to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.handle} />

          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>{children}</View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    paddingBottom: moderateScale(20),
    maxHeight: "95%",
    flexShrink: 1, // Allows modal to squish down so footer stays visible
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: moderateScale(40),
    height: moderateScale(4),
    backgroundColor: "#E5E7EB",
    borderRadius: moderateScale(2),
    alignSelf: "center",
    marginTop: moderateScale(10),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(16),
    color: "#1F2937",
  },
  closeBtn: {
    padding: moderateScale(5),
  },
  body: {
    flexShrink: 1,
    paddingHorizontal: moderateScale(20),
  },
});
