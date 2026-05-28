import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

interface PayrollCardProps {
  item: any;
  onPress: () => void;
}

const PayrollCard: React.FC<PayrollCardProps> = ({ item, onPress }) => {
  const formattedFromDate = new Date(item.fromDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    },
  );
  const formattedToDate = new Date(item.toDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.periodBox}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.Brand_Blue}
          />
          <Text style={styles.periodText}>
            {formattedFromDate} - {formattedToDate}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {(item.status || "PROCESSED").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.mainInfo}>
        <View>
          <Text style={styles.netLabel}>NET TAKE HOME</Text>
          <Text style={styles.netValue}>
            ₹{(item.netSalary || 0).toLocaleString("en-IN")}
          </Text>
        </View>
        <View style={styles.actionCircleBtn}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.Brand_Blue}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.footItem}>
          <Text style={styles.footLabel}>PAID DAYS</Text>
          <Text style={styles.footValue}>
            {item.paidDays} / {item.totalDaysInMonth}
          </Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.footItem}>
          <Text style={styles.footLabel}>GROSS EARNINGS</Text>
          <Text style={styles.footValue}>
            ₹{(item.grossEarnings || 0).toLocaleString("en-IN")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(14),
  },
  periodBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    gap: moderateScale(6),
  },
  periodText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(11),
    color: "#475569",
  },
  statusBadge: {
    backgroundColor: `${colors.Brand_Green}15`,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(9),
    color: colors.Brand_Green,
  },
  mainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: moderateScale(14),
  },
  netLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(10),
    color: "#94A3B8",
    marginBottom: moderateScale(4),
  },
  netValue: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(22),
    color: "#0F172A",
  },
  actionCircleBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: moderateScale(12),
  },
  footer: { flexDirection: "row", alignItems: "center" },
  footItem: { flex: 1 },
  footLabel: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(9),
    color: "#94A3B8",
    marginBottom: moderateScale(4),
  },
  footValue: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: "#475569",
  },
  verticalDivider: {
    width: 1,
    height: moderateScale(24),
    backgroundColor: "#E2E8F0",
    marginHorizontal: moderateScale(16),
  },
});

export default PayrollCard;
