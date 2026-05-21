import { useState, useRef } from "react";
import { TextInput, Keyboard } from "react-native";
import * as SecureStore from "expo-secure-store";
import { loginEmployee } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { resetAndNavigate } from "@/utils/NavigationHelper";
import { getAppPermissionReport } from "@/utils/PermissionCheck";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const [empID, setEmpID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordInputRef = useRef<TextInput>(null);

  const handleEmpIDChange = (text: string) => {
    setEmpID(text);
    // Auto-focus password when ID length is reached
    if (text.length === 5) {
      passwordInputRef.current?.focus();
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!empID || !password) {
      setErrorMessage("Please enter both Employee ID and Password.");
      setIsErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const employeeCode = `IA${empID}`;
      const response = await loginEmployee(employeeCode, password);

      if (response.success) {
        // Save tokens
        await SecureStore.setItemAsync(
          "accessToken",
          response.data.accessToken,
        );
        await SecureStore.setItemAsync(
          "refreshToken",
          response.data.refreshToken,
        );

        // Set global state
        setUser(response.data.employee);

        // Permission gate logic
        const report = await getAppPermissionReport();
        if (report.allMandatoryGranted) {
          resetAndNavigate("/(main)/screens/home");
        } else {
          resetAndNavigate("/(setup)/permissions");
        }
      } else {
        setErrorMessage(response.message || "Invalid credentials.");
        setIsErrorModalVisible(true);
      }
    } catch (error: any) {
      const serverError =
        error.message || "Something went wrong connecting to the server.";
      setErrorMessage(serverError);
      setIsErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    empID,
    password,
    showPassword,
    isLoading,
    isErrorModalVisible,
    errorMessage,
    passwordInputRef,
    handleEmpIDChange,
    setPassword,
    setShowPassword,
    setIsErrorModalVisible,
    handleLogin,
  };
};
