import { useState, useCallback, useEffect } from "react";
import { Linking, Alert } from "react-native";
import { getProfileDetails, updatePassword } from "@/services/profileService";
import { Employee } from "@/apis/types";
import { colors } from "@/constants/theme";

export const useProfile = () => {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);

  // Action Modal States
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    title: "",
    message: "",
    iconName: "checkmark-circle",
    iconColor: colors.Brand_Green,
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProfileDetails();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
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
        iconColor: colors.Brand_Green,
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

  return {
    state: {
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
    },
  };
};
