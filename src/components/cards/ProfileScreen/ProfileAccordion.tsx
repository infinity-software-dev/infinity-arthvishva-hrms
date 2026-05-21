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
  children: React.ReactNode;
}

export default function ProfileAccordion({
  title,
  iconName,
  children,
}: ProfileAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
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
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={moderateScale(20)}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

export const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

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
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  rowLabel: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(13),
    color: "#64748B",
    flex: 1,
  },
  rowValue: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(13),
    color: "#1E293B",
    flex: 1.5,
    textAlign: "right",
  },
});
