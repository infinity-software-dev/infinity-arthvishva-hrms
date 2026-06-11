import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

export interface LedgerBalances {
  paid: number;
  compOff: number;
}

interface LedgerBalanceCardProps {
  balances: LedgerBalances;
  onViewDetails: (leaveType: string) => void;
}

const PUSH_DISTANCE = 4; // The "thickness" of the 3D button

// Reusable 3D Button Component
const ThreeDPressable = ({ children, onPress, style }: any) => {
  const pushAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(pushAnim, {
      toValue: PUSH_DISTANCE,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pushAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      {/* Base layer (The 3D lip) */}
      <View style={styles.buttonBase}>
        {/* Top face layer (Moves down on press) */}
        <Animated.View
          style={[
            styles.buttonFace,
            { transform: [{ translateY: pushAnim }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
};

export default function LedgerBalanceCard({ balances, onViewDetails }: LedgerBalanceCardProps) {
  return (
    <View style={styles.vaultCard}>
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={moderateScale(18)} color="#475569" />
        <Text style={styles.title}>Available Tokens</Text>
        <Text style={styles.hintText}>(Tap to view details)</Text> 
      </View>

      <View style={styles.balanceContainer}>
        {/* Paid Leaves */}
        <ThreeDPressable 
          style={styles.flexBox} 
          onPress={() => onViewDetails('Paid')}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="calendar" size={moderateScale(20)} color={colors.Brand_Blue} />
          </View>
          <View>
            <Text style={styles.countText}>{balances.paid}</Text>
            <Text style={styles.labelText}>Paid Leaves</Text>
          </View>
        </ThreeDPressable>

        {/* Comp-Offs */}
        <ThreeDPressable 
          style={styles.flexBox} 
          onPress={() => onViewDetails('CompOff')}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${colors.Success_Green}15` }]}>
            <Ionicons name="time" size={moderateScale(20)} color={colors.Success_Green} />
          </View>
          <View>
            <Text style={styles.countText}>{balances.compOff}</Text>
            <Text style={styles.labelText}>Comp-Offs</Text>
          </View>
        </ThreeDPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vaultCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(24),
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
    gap: moderateScale(6),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(12),
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  hintText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(10),
    color: "#94A3B8",
    marginLeft: "auto", 
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(12),
  },
  flexBox: {
    flex: 1,
  },
  /* --- 3D Button Styles --- */
  buttonBase: {
    backgroundColor: "#CBD5E1", // Darker border color simulating the inset shadow/bottom lip
    borderRadius: moderateScale(12),
    flex: 1,
  },
  buttonFace: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Main button color
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    gap: moderateScale(12),
    marginBottom: PUSH_DISTANCE, // Creates the initial gap so the darker base shows at the bottom
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  /* ------------------------ */
  iconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: `${colors.Brand_Blue}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(18),
    color: "#0F172A",
  },
  labelText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(10),
    color: "#64748B",
  },
});