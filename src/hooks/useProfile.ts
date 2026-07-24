import { useState, useCallback, useEffect } from "react";
import { Linking, Alert } from "react-native";
import { addFaceDescriptor, getMyProfile, updatePassword } from "@/services/profileService";
import { Employee } from "@/apis/types";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchActiveLedgers } from "@/services/leavesService";
import { useScannerStore } from "@/store/useScannerStore";

export const useProfile = () => {
  const openScanner = useScannerStore((scannerState) => scannerState.openScanner);
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    title: "",
    message: "",
    iconName: "checkmark-circle",
    iconColor: colors.BRAND_SECONDARY,
  });
  const [activeLedgerTokens, setActiveLedgerTokens] = useState<any[]>([]);

  const fetchLatestProfile = useAuthStore((state) => state.fetchLatestProfile);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyProfile();
      setProfile(data);
      const ledgerData = await fetchActiveLedgers();
      setActiveLedgerTokens(ledgerData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    fetchLatestProfile();
  }, [loadProfile]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleOpenDocument = async (url?: string, docName?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open ${docName} URL.`);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open ${docName}.`);
    }
  };

  // ── THE UPDATED CHANGE PASSWORD LOGIC ──
  const handleChangePassword = async (oldPass: string, newPass: string) => {
    try {
      const result = await updatePassword(oldPass, newPass);

      setIsChangePasswordModalVisible(false);
      setActionModalConfig({
        title: "Success",
        message: result.message || "Password changed successfully.",
        iconName: "checkmark-circle",
        iconColor: colors.BRAND_SECONDARY,
      });
      setActionModalVisible(true);
    } catch (error: any) {
      setIsChangePasswordModalVisible(false);
      setActionModalConfig({
        title: "Error",
        message: error.message || "Failed to update password.",
        iconName: "close-circle",
        iconColor: colors.Danger_Red,
      });
      setActionModalVisible(true);
    }
  };

  // Handler for Face ID Registration
  // ── HANDLER FOR FACE ID REGISTRATION ──
  const handleFaceIdRegistration = () => {
    openScanner(
      "register",
      null,
      async (newDescriptors, imageBase64) => {
        // --- SUCCESS CALLBACK FROM WEBVIEW ---
        try {
          // 1. Send the array of arrays and the image to your NestJS Backend
          await addFaceDescriptor(newDescriptors, imageBase64);

          // 2. Refresh the profile so the UI instantly updates and hides the registration button
          await loadProfile();
          await fetchLatestProfile();

          // 3. Show Success Alert
          setActionModalConfig({
            title: "Security Updated",
            message: "Your Face ID profile has been secured successfully.\n\nPlease completely close and reopen the app to activate your biometric check-ins.",
            iconName: "checkmark-circle",
            iconColor: colors.BRAND_SECONDARY,
          });
          setActionModalVisible(true);

        } catch (error: any) {
          // Backend API Error
          setActionModalConfig({
            title: "Save Failed",
            message: error.message || "Could not save your Face ID to the server.",
            iconName: "close-circle",
            iconColor: colors.Danger_Red,
          });
          setActionModalVisible(true);
        }
      },
      (errorMsg) => {
        // --- ERROR CALLBACK FROM WEBVIEW (e.g., Camera denied, timeout) ---
        setActionModalConfig({
          title: "Scanner Error",
          message: errorMsg,
          iconName: "warning",
          iconColor: colors.Danger_Red,
        });
        setActionModalVisible(true);
      }
    );
  };

  return {
    state: {
      activeLedgerTokens,
      profile,
      isLoading,
      isChangePasswordModalVisible,
      isActionModalVisible,
      actionModalConfig,
    },
    actions: {
      refreshProfile: loadProfile,
      formatDate,
      handleOpenDocument,
      setIsChangePasswordModalVisible,
      handleChangePassword,
      setActionModalVisible,
      handleFaceIdRegistration,
    },
  };
};
