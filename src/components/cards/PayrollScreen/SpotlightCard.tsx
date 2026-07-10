import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, FONTS } from "@/constants/theme";

interface SpotlightCardProps {
  slip: any;
  onPress: () => void;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ slip, onPress }) => {
  if (!slip) return null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <LinearGradient
        colors={[colors.BRAND_PRIMARY, "#2563EB"]}
        style={styles.spotlightCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.spotlightHeader}>
          <View style={styles.spotlightBadge}>
            <Ionicons name="sparkles" size={12} color="#fff" />
            <Text style={styles.spotlightBadgeText}>LATEST STATEMENT</Text>
          </View>
          <Ionicons
            name="arrow-forward-circle"
            size={28}
            color="rgba(255,255,255,0.85)"
          />
        </View>

        <Text style={styles.spotlightLabel}>Net Take Home Pay</Text>
        <Text style={styles.spotlightValue}>
          ₹{(slip.netSalary || 0).toLocaleString("en-IN")}
        </Text>

        <View style={styles.spotlightFooter}>
          <Text style={styles.spotlightPeriod}>
            {new Date(slip.fromDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {new Date(slip.toDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.spotlightPaidDays}>
            {slip.paidDays} Paid Days
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spotlightCard: {
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(24),
  },
  spotlightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  spotlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    gap: moderateScale(4),
  },
  spotlightBadgeText: {
    fontFamily: FONTS.bold,
    color: "#fff",
    fontSize: moderateScale(9),
    letterSpacing: 0.5,
  },
  spotlightLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.8)",
    marginBottom: moderateScale(4),
  },
  spotlightValue: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(28),
    color: "#fff",
    marginBottom: moderateScale(20),
  },
  spotlightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: moderateScale(14),
  },
  spotlightPeriod: {
    fontFamily: FONTS.semiBold,
    color: "rgba(255,255,255,0.9)",
    fontSize: moderateScale(12),
  },
  spotlightPaidDays: {
    fontFamily: FONTS.bold,
    color: "#fff",
    fontSize: moderateScale(12),
  },
});

export default SpotlightCard;
