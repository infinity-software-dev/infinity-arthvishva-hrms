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
import { colors } from "@/constants/theme";

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
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import ActionModal from "@/components/modals/AlertModal";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { state, actions } = useProfile();
  const { profile, isLoading } = state;

  // Helper to render document rows cleanly using the action from the hook
  const renderDocRow = (label: string, url?: string) => {
    const isUploaded = !!url;
    return (
      <DetailRow
        label={label}
        value={isUploaded ? "View Document" : "Not Uploaded"}
        isLink={isUploaded}
        onPress={() => actions.handleOpenDocument(url, label)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <CustomHeader title="My Profile" />

      {!profile ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.BRAND_SECONDARY} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={actions.refreshProfile}
              tintColor={colors.BRAND_SECONDARY}
              colors={[colors.BRAND_SECONDARY]}
            />
          }
        >
          <ProfileHero profile={profile} />
          <QuickStats />

          <View style={styles.accordionsWrapper}>
            {/* ── PERSONAL & FAMILY ── */}
            <ProfileAccordion
              title="Personal & Family"
              iconName="person-outline"
            >
              <DetailRow
                label="Date of Birth"
                value={actions.formatDate(profile?.dateOfBirth)}
              />
              <DetailRow label="Gender" value={profile?.gender || "N/A"} />
              <DetailRow
                label="Marital Status"
                value={profile?.maritalStatus || "N/A"}
              />
              <DetailRow
                label="Father's Name"
                value={profile?.fatherName || "N/A"}
              />
              <DetailRow
                label="Mother's Name"
                value={profile?.motherName || "N/A"}
              />
            </ProfileAccordion>

            {/* ── CONTACT & ADDRESSES ── */}
            <ProfileAccordion title="Contact & Address" iconName="call-outline">
              <DetailRow
                label="Mobile"
                value={profile?.mobileNumber || "N/A"}
              />
              <DetailRow
                label="Alt Mobile"
                value={profile?.alternateMobileNumber || "N/A"}
              />
              <DetailRow label="Email" value={profile?.email || "N/A"} />
              <DetailRow
                label="Current Address"
                value={profile?.address?.current?.address || "N/A"}
              />
              <DetailRow
                label="Permanent Address"
                value={profile?.address?.permanent?.address || "N/A"}
              />
              <DetailRow
                label="State & District"
                value={
                  profile?.address?.current?.state && profile?.address?.current?.district
                    ? `${profile.address.current.district}, ${profile.address.current.state}`
                    : "N/A"
                }
              />
              <DetailRow label="Pincode" value={profile?.address?.current?.pinCode || "N/A"} />
            </ProfileAccordion>

            {/* ── EMPLOYMENT & EXPERIENCE ── */}
            <ProfileAccordion
              title="Employment & Experience"
              iconName="briefcase-outline"
            >
              <DetailRow
                label="Emp Code"
                value={profile?.employeeCode || "N/A"}
              />
              <DetailRow
                label="Department"
                value={profile?.department || "N/A"}
              />
              <DetailRow label="Position" value={profile?.position || "N/A"} />
              <DetailRow
                label="Joining Date"
                value={actions.formatDate(profile?.joiningDate)}
              />
              <DetailRow
                label="Employment Date"
                value={actions.formatDate(profile?.employmentDate)}
              />
              <DetailRow
                label="Experience Type"
                value={profile?.experienceType || "N/A"}
              />
              {/* Render only if the profile is not a Fresher and has experience details */}
              {profile?.experienceType !== "Fresher" && (
                <>
                  <DetailRow
                    label="Total Experience"
                    value={
                      profile?.totalExperienceYears
                        ? `${profile.totalExperienceYears} Years`
                        : "N/A"
                    }
                  />
                  <DetailRow
                    label="Previous Company"
                    value={profile?.lastCompanyName || "N/A"}
                  />
                </>
              )}
            </ProfileAccordion>

            {/* ── EDUCATION ── */}
            <ProfileAccordion
              title="Education Details"
              iconName="school-outline"
            >
              <DetailRow
                label="HSC / 12th"
                value={profile?.hscPercent ? `${profile.hscPercent}%` : "N/A"}
              />
              <DetailRow
                label="Graduation"
                value={
                  profile?.graduationCourse
                    ? `${profile.graduationCourse} ${profile.graduationPercent ? `(${profile.graduationPercent}%)` : ""}`
                    : "N/A"
                }
              />
              <DetailRow
                label="Post Graduation"
                value={
                  profile?.postGraduationCourse
                    ? `${profile.postGraduationCourse} ${profile.postGraduationPercent ? `(${profile.postGraduationPercent}%)` : ""}`
                    : "N/A"
                }
              />
            </ProfileAccordion>

            {/* ── HEALTH & EMERGENCY ── */}
            <ProfileAccordion
              title="Health & Emergency"
              iconName="medical-outline"
            >
              <DetailRow
                label="Blood Group"
                value={profile?.bloodGroup || "N/A"}
              />
              <DetailRow
                label="Pre-existing Disease"
                value={profile?.hasDisease || "No"}
              />
              {profile?.hasDisease === "Yes" && (
                <>
                  <DetailRow
                    label="Disease Details"
                    value={`${profile?.diseaseName || ""} (${profile?.diseaseType || ""})`}
                  />
                  <DetailRow
                    label="Required Medicines"
                    value={profile?.medicinesRequired || "N/A"}
                  />
                </>
              )}
              <DetailRow
                label="Emergency Contact"
                value={profile?.emergencyContactName || "N/A"}
              />
              <DetailRow
                label="Relation & Phone"
                value={
                  profile?.emergencyContactRelationship &&
                    profile?.emergencyContactMobile
                    ? `${profile.emergencyContactRelationship} - ${profile.emergencyContactMobile}`
                    : "N/A"
                }
              />
            </ProfileAccordion>

            {/* ── LEAVE BALANCES ── */}
            {/* <ProfileAccordion
              title="Leave Balances"
              iconName="calendar-outline"
            >
              <DetailRow
                label="Paid Leaves (PL)"
                value={`${profile?.paidLeaveBalance || 0}`}
              />
              <DetailRow
                label="Comp-Offs"
                value={`${profile?.compOffBalance || 0}`}
              />
              <DetailRow
                label="Last Accrual"
                value={actions.formatDate(profile?.lastLeaveAccrualDate)}
              />
            </ProfileAccordion> */}

            {/* ── BANK & VERIFICATION ── */}
            <ProfileAccordion title="Bank Details" iconName="card-outline">
              <DetailRow label="Bank Name" value={profile?.bankName || "N/A"} />
              <DetailRow
                label="Account"
                value={
                  profile?.accountNumber
                    ? `•••• ${profile.accountNumber.slice(-4)}`
                    : "N/A"
                }
              />
              <DetailRow label="IFSC Code" value={profile?.ifsc || "N/A"} />
              {/* <DetailRow
                label="Status"
                value={profile?.bankVerified ? "Verified" : "Pending"}
              /> */}
            </ProfileAccordion>

            {/* ── DOCUMENTS & CERTIFICATES ── */}
            <ProfileAccordion
              title="Documents & Certificates"
              iconName="document-text-outline"
            >
              <DetailRow
                label="Aadhaar Number"
                value={profile?.aadhaarNumber ? `•••••••• ${profile.aadhaarNumber.slice(-4)}`
                  : "N/A"}
              />
              <DetailRow
                label="PAN Number"
                value={
                  profile?.panNumber
                    ? `•••••${profile.panNumber.slice(-4)}`
                    : "N/A"
                }
              />

              {renderDocRow("Aadhaar Card", profile?.aadhaarFileUrl)}
              {renderDocRow("PAN Card", profile?.panFileUrl)}
              {renderDocRow("Bank Passbook", profile?.passbookFileUrl)}

              {profile?.tenthMarksheetUrl &&
                renderDocRow("10th Marksheet", profile.tenthMarksheetUrl)}
              {profile?.twelfthMarksheetUrl &&
                renderDocRow("12th Marksheet", profile.twelfthMarksheetUrl)}
              {profile?.graduationMarksheetUrl &&
                renderDocRow("Graduation", profile.graduationMarksheetUrl)}
              {profile?.postGraduationMarksheetUrl &&
                renderDocRow("Post Grad", profile.postGraduationMarksheetUrl)}
              {profile?.experienceCertificateUrl &&
                renderDocRow(
                  "Experience Cert",
                  profile.experienceCertificateUrl,
                )}
            </ProfileAccordion>

            <ProfileAccordion
              title="Change Password"
              iconName="lock-closed-outline"
              isAccordion={false}
              onActionPress={() => {
                actions.setIsChangePasswordModalVisible(true);
              }}
            />

            {/* ── CONDITIONAL FACE ID SETUP ── */}
            {(!profile?.faceDescriptors || profile.faceDescriptors.length === 0) && (
              <ProfileAccordion
                title="Set Up Face ID"
                iconName="camera-outline" // or "scan-outline" depending on your icon pack
                isAccordion={false}
                onActionPress={actions.handleFaceIdRegistration}
              />
            )}

          </View>

          <ProfileLogoutSection />
          <CustomBottomModal
            isVisible={state.isChangePasswordModalVisible}
            onClose={() => actions.setIsChangePasswordModalVisible(false)}
            backdropColor="rgba(0, 0, 0, 0.9)"
          >
            <ChangePasswordModal
              onSubmit={(oldPassword, newPassword) =>
                actions.handleChangePassword(oldPassword, newPassword)
              }
              onCancel={() => actions.setIsChangePasswordModalVisible(false)}
            />
          </CustomBottomModal>
        </ScrollView>
      )}
      <ActionModal
        visible={state.isActionModalVisible}
        title={state.actionModalConfig.title}
        message={state.actionModalConfig.message}
        icon={
          <Ionicons
            name={state.actionModalConfig.iconName as any}
            size={moderateScale(50)}
            color={state.actionModalConfig.iconColor}
          />
        }
        confirmText="OK"
        onConfirm={() => actions.setActionModalVisible(false)}
      />
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