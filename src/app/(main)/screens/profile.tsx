import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { colors} from "@/constants/theme";

// Components
import { CustomHeader } from "@/components/navbar/CustomHeader";
import ProfileHero from "@/components/cards/ProfileScreen/ProfileHero";
import QuickStats from "@/components/cards/ProfileScreen/QuickStats";
import ProfileAccordion, {
  DetailRow,
} from "@/components/cards/ProfileScreen/ProfileAccordion";
import ProfileLogoutSection from "@/components/cards/ProfileScreen/LogoutSection";

// Hooks
import { useProfile } from "@/hooks/useProfile";

// Utility for formatting dates
const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ProfileScreen() {
  const { state, actions } = useProfile();
  const { profile, isLoading } = state;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <CustomHeader title="My Profile" />

      {!profile ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.Brand_Green} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={actions.refreshProfile}
              tintColor={colors.Brand_Green}
              colors={[colors.Brand_Green]}
            />
          }
        >
          <ProfileHero profile={profile} />
          <QuickStats profile={profile} />

          <View style={styles.accordionsWrapper}>
            <ProfileAccordion
              title="Contact & Personal"
              iconName="person-outline"
            >
              <DetailRow label="Mobile" value={profile.mobileNumber} />
              <DetailRow label="Email" value={profile.email} />
              <DetailRow
                label="Blood Group"
                value={profile.bloodGroup || "N/A"}
              />
              <DetailRow
                label="Location"
                value={profile.currentAddress || "N/A"}
              />
            </ProfileAccordion>

            <ProfileAccordion
              title="Employment Details"
              iconName="briefcase-outline"
            >
              <DetailRow label="Emp Code" value={profile.employeeCode} />
              <DetailRow label="Department" value={profile.department} />
              <DetailRow label="Position" value={profile.position} />
              <DetailRow
                label="Joining Date"
                value={formatDate(profile.joiningDate)}
              />
            </ProfileAccordion>

            <ProfileAccordion
              title="Emergency Contact"
              iconName="medical-outline"
            >
              <DetailRow
                label="Name"
                value={profile.emergencyContactName || "N/A"}
              />
              <DetailRow
                label="Phone"
                value={profile.emergencyContactMobile || "N/A"}
              />
            </ProfileAccordion>

            <ProfileAccordion
              title="Bank & Documents"
              iconName="shield-checkmark-outline"
            >
              <DetailRow label="Bank Name" value={profile.bankName || "N/A"} />
              <DetailRow
                label="Account"
                value={
                  profile.accountNumber
                    ? `•••• ${profile.accountNumber.slice(-4)}`
                    : "N/A"
                }
              />
              <DetailRow
                label="PAN Card"
                value={
                  profile.panNumber
                    ? `•••••${profile.panNumber.slice(-4)}`
                    : "N/A"
                }
              />
              {/* Note: Aadhaar must be strictly redacted in UI for privacy compliance */}
              <DetailRow label="Aadhaar" value={profile.aadhaarNumber
                    ? `•••••••• ${profile.aadhaarNumber.slice(-4)}`
                    : "N/A"} />
              <DetailRow
                label="Status"
                value={profile.bankVerified ? "Verified" : "Pending"}
                // You could pass a custom color to DetailRow if it supports it!
              />
            </ProfileAccordion>
          </View>

          <ProfileLogoutSection />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.Base_Background,
  },
  accordionsWrapper: {
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(20),
  },
});
