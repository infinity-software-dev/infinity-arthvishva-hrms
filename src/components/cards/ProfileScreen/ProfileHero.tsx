import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors, FONTS } from "@/constants/theme";
import { Employee } from "@/apis/types";

interface ProfileHeroProps {
  profile: Employee;
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {profile.profileImageUrl ? (
          <Image
            source={{ uri: profile.profileImageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.fallbackImage}>
            <Text style={styles.fallbackText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.position}>
        {profile.position} • {profile.department}
      </Text>

      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{profile.employeeCode}</Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                profile.status === "Active" ? "#E0F2FE" : "#FEE2E2",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color:
                  profile.status === "Active"
                    ? colors.Brand_Blue
                    : colors.Danger_Red,
              },
            ]}
          >
            {profile.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: moderateScale(24),
    backgroundColor: colors.Base_Background,
  },
  imageContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    borderWidth: 3,
    borderColor: colors.Brand_Green,
    padding: 2,
    marginBottom: moderateScale(12),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(50),
  },
  fallbackImage: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(50),
    backgroundColor: colors.Magic_Violet,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(36),
    color: "#FFFFFF",
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: moderateScale(20),
    color: "#1E293B",
    marginBottom: moderateScale(4),
  },
  position: {
    fontFamily: FONTS.medium,
    fontSize: moderateScale(14),
    color: "#64748B",
    marginBottom: moderateScale(12),
  },
  badgeContainer: {
    flexDirection: "row",
    gap: moderateScale(8),
  },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(16),
  },
  badgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: moderateScale(12),
    color: "#475569",
  },
});
