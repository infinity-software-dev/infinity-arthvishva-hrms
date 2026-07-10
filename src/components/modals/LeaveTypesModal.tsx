import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { LEAVE_TYPES } from "@/local-storage/leavesTypesData";

interface LeaveTypesListProps {
  onSelect: (value: string) => void;
  selectedValue: string;
}

export default function LeaveTypesList({
  onSelect,
  selectedValue,
}: LeaveTypesListProps) {
  return (
    <View style={styles.container}>
      {/* Options List */}
      {LEAVE_TYPES.map((item) => {
        const isSelected = selectedValue === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.optionRow, isSelected && styles.selectedOptionRow]}
            onPress={() => {
              onSelect(item.value);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              {/* Icon with tinted background */}
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={moderateScale(20)}
                  color={item.color}
                />
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.selectedOptionLabel,
                ]}
              >
                {item.label}
              </Text>
            </View>

            {/* Active Checkmark */}
            {isSelected && (
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(22)}
                color={colors.BRAND_SECONDARY}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(20),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(14),
    marginBottom: moderateScale(8),
    backgroundColor: "transparent",
  },
  selectedOptionRow: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  optionLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(15),
    color: "#475569",
  },
  selectedOptionLabel: {
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
});
