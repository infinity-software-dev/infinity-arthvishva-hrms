import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import GradientButton from "@/components/buttons/GradientButton";

interface GenerateFilterCardProps {
  fromDate: Date;
  toDate: Date;
  formatDateForUI: (date: Date) => string;
  onShowFromPicker: () => void;
  onShowToPicker: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const GenerateFilterCard: React.FC<GenerateFilterCardProps> = ({
  fromDate,
  toDate,
  formatDateForUI,
  onShowFromPicker,
  onShowToPicker,
  onGenerate,
  isGenerating,
}) => {
  // Explicitly type the colors array to satisfy the CustomStyle tuple requirement
  const buttonColors: [string, string] = [
    colors.Brand_Green,
    colors.Brand_Green_Dark,
  ];

  return (
    <View style={styles.filterCard}>
      <Text style={styles.sectionTitle}>Generate / Filter Statement</Text>

      <View style={styles.row}>
        <View
          style={[
            styles.inputGroup,
            { flex: 1, marginRight: moderateScale(12) },
          ]}
        >
          <Text style={styles.inputLabel}>START DATE</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={onShowFromPicker}
            activeOpacity={0.7}
          >
            <Text style={styles.inputText}>{formatDateForUI(fromDate)}</Text>
            <Ionicons
              name="calendar-outline"
              size={moderateScale(16)}
              color={colors.Brand_Blue}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>END DATE</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={onShowToPicker}
            activeOpacity={0.7}
          >
            <Text style={styles.inputText}>{formatDateForUI(toDate)}</Text>
            <Ionicons
              name="calendar-outline"
              size={moderateScale(16)}
              color={colors.Brand_Blue}
            />
          </TouchableOpacity>
        </View>
      </View>

      <GradientButton
        text={isGenerating ? "Generating..." : "Generate Payslip"}
        onPress={onGenerate}
        disabled={isGenerating}
        customStyles={{
          colors: buttonColors,
          borderRadius: moderateScale(12),
          marginVertical: 0,
          marginTop: moderateScale(4),
        }}
        customTextStyles={{
          fontSize: moderateScale(14),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(20),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#0F172A",
    marginBottom: moderateScale(16),
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputGroup: { marginBottom: moderateScale(16) },
  inputLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(10),
    color: "#64748B",
    marginBottom: moderateScale(6),
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    height: moderateScale(46),
  },
  inputText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(13),
    color: "#0F172A",
  },
});

export default GenerateFilterCard;
