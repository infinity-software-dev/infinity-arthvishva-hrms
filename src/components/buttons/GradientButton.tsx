import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FONTS } from "@/constants/theme";

// Extend the standard ViewStyle to allow your custom 'colors' array
export interface CustomStyle extends ViewStyle {
  colors?: [string, string, ...string[]];
}

interface GradientButtonProps {
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
  customStyles?: CustomStyle;
  customTextStyles?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onPress,
  customStyles = {},
  customTextStyles = {},
  disabled = false,
}) => {
  // Default gradient colors
  const defaultColors: [string, string] = ["#2076C7", "#1CADA3"];

  // Grey gradient for disabled state to give a clean, inactive look
  const disabledColors: [string, string] = ["#D1D5DB", "#9CA3AF"];

  // Determine which colors to use based on the disabled prop
  const gradientColors = disabled
    ? disabledColors
    : customStyles.colors || defaultColors;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonContainer,
        customStyles,
        disabled && styles.disabledContainer, // Strip shadows when disabled
      ]}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, customTextStyles]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    borderRadius: moderateScale(25),
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(5),
    marginVertical: moderateScale(15),
  },
  disabledContainer: {
    elevation: 0, // Remove Android shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  gradient: {
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: moderateScale(16),
    fontFamily: FONTS.bold,
  },
});

export default GradientButton;
