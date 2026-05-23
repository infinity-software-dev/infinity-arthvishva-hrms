import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

interface ProfileAccordionProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode; // Made optional so direct clickables don't require it
  isAccordion?: boolean; // Flag to determine behavior (defaults to true)
  onActionPress?: () => void; // Function to call when clicked (if it's a direct button)
}

export default function ProfileAccordion({
  title,
  iconName,
  children,
  isAccordion = true,
  onActionPress,
}: ProfileAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (isAccordion) {
      // Accordion behavior
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(!expanded);
    } else if (onActionPress) {
      // Direct click behavior
      onActionPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={iconName}
              size={moderateScale(18)}
              color={colors.Brand_Blue}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Change icon based on behavior */}
        <Ionicons
          name={
            isAccordion
              ? expanded
                ? "chevron-up"
                : "chevron-down"
              : "chevron-forward" // Shows a right arrow for direct links
          }
          size={moderateScale(20)}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {/* Only render children if it is an accordion and is currently expanded */}
      {isAccordion && expanded && children && (
        <View style={styles.content}>{children}</View>
      )}
    </View>
  );
}

// DETAIL ROW ──
export const DetailRow = ({
  label,
  value,
  isLink = false,
  onPress,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  onPress?: () => void;
}) => {
  const content = (
    <>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text
          style={[styles.rowValue, isLink && styles.linkText]}
          // Only truncate if it's a link (like a document name).
          // Otherwise, allow it to wrap to multiple lines (undefined).
          numberOfLines={isLink ? 1 : undefined}
        >
          {value}
        </Text>
        {isLink && (
          <Ionicons
            name="open-outline"
            size={moderateScale(14)}
            color={colors.Brand_Blue}
            style={styles.linkIcon}
          />
        )}
      </View>
    </>
  );

  if (isLink && onPress) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.6}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.row}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: moderateScale(16),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    backgroundColor: `${colors.Brand_Blue}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#0F172A",
  },
  content: {
    padding: moderateScale(16),
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  rowLabel: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    flex: 1,
    marginTop: moderateScale(2), //
  },
  valueContainer: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  rowValue: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(13),
    color: "#1E293B",
    textAlign: "right",
    flexShrink: 1,
  },
  linkText: {
    color: colors.Brand_Blue,
    textDecorationLine: "underline",
  },
  linkIcon: {
    marginLeft: moderateScale(4),
  },
});
