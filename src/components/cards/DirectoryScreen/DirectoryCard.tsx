import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

// Types based on your API response
export interface DirectoryEmployee {
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  profilePhoto: string | null;
}

interface DirectoryCardProps {
  employee: DirectoryEmployee;
}

export default function DirectoryCard({ employee }: DirectoryCardProps) {
  const getInitials = (name: string) => {
    if (!name) return "";
    const nameArray = name.trim().split(" ");
    if (nameArray.length === 1) return nameArray[0].charAt(0).toUpperCase();
    return (
      nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Quick action: Call
  const handleCall = () => {
    const url = `tel:${employee.phone}`;
    Linking.openURL(url).catch((err) => {
      console.log("Dialer Error:", err);
      Alert.alert(
        "Error",
        "Phone dialer is not available (Are you on a simulator?).",
      );
    });
  };

  // Quick action: Email
  const handleEmail = () => {
    const url = `mailto:${employee.email}`;
    Linking.openURL(url).catch((err) => {
      console.log("Email Error:", err);
      Alert.alert("Error", "Mail client is not available on this device.");
    });
  };

  return (
    <View style={styles.cardContainer}>
      {/* ── AVATAR ── */}
      <View style={styles.avatarContainer}>
        {employee.profilePhoto ? (
          <Image
            source={{ uri: employee.profilePhoto }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{getInitials(employee.name)}</Text>
          </View>
        )}
      </View>

      {/* ── EMPLOYEE INFO ── */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {employee.name}
        </Text>
        <Text style={styles.roleText} numberOfLines={1}>
          {employee.role} • {employee.department}
        </Text>
      </View>

      {/* ── QUICK ACTIONS ── */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Ionicons
            name="call"
            size={moderateScale(18)}
            color={colors.Brand_Green || "#10B981"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEmail}
          activeOpacity={0.7}
        >
          <Ionicons
            name="mail"
            size={moderateScale(18)}
            color={colors.Brand_Blue || "#3B82F6"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(12),
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F1F5F9",
    // Subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: moderateScale(12),
  },
  avatarImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: "#E2E8F0",
  },
  avatarFallback: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: `${colors.Brand_Blue}15`, // Light tinted background
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(18),
    color: colors.Brand_Blue,
  },
  infoContainer: {
    flex: 1, // Takes up remaining middle space
    justifyContent: "center",
  },
  nameText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(15),
    color: "#0F172A",
    marginBottom: moderateScale(4),
  },
  roleText: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
    color: "#64748B",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: moderateScale(8),
    marginLeft: moderateScale(8),
  },
  actionButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
});
