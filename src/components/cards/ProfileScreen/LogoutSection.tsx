import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import UniversalButton from "@/components/buttons/UniversalButton";
import { logoutEmployee } from "@/services/authService";
import { resetAndNavigate } from "@/utils/NavigationHelper";

export default function ProfileLogoutSection() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutEmployee()
      resetAndNavigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <UniversalButton
        title="Log Out"
        variant="soft"
        color={colors.Danger_Red}
        icon={
          <MaterialIcons
            name="logout"
            size={moderateScale(20)}
            color={colors.Danger_Red}
          />
        }
        isLoading={isLoggingOut}
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(24),
  },
  logoutButton: {
    width: "100%",
  },
});
