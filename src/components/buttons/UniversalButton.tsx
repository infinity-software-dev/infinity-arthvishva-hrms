import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";

export type ButtonVariant = "solid" | "outline" | "soft" | "ghost";

interface UniversalButtonProps {
  title: string;
  onPress?: () => void | Promise<void>;
  variant?: ButtonVariant;
  color?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const UniversalButton: React.FC<UniversalButtonProps> = ({
  title,
  onPress,
  variant = "solid",
  color = colors.Brand_Blue,
  icon,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  // Determine dynamic styling based on the selected variant
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: color,
          },
          text: { color: color },
        };
      case "soft":
        return {
          container: {
            backgroundColor: "#EFF6FF", // Light tinted background
            borderWidth: 1,
            borderColor: "#DBEAFE", // Subtle border
          },
          text: { color: color },
        };
      case "ghost":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 0,
          },
          text: { color: color },
        };
      case "solid":
      default:
        return {
          container: {
            backgroundColor: color,
            borderWidth: 0,
          },
          text: { color: "#FFFFFF" },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.baseContainer,
        variantStyles.container,
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === "solid" ? "#FFFFFF" : color}
          />
        ) : (
          <>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <Text style={[styles.baseText, variantStyles.text, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minWidth: moderateScale(120),
  },
  disabledContainer: {
    opacity: 0.5, // Standard dimming for disabled state across all variants
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginRight: moderateScale(8),
  },
  baseText: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
});

export default UniversalButton;
