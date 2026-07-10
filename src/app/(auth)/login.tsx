import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import GradientButton from "@/components/buttons/GradientButton";
import ActionModal from "@/components/modals/AlertModal";
import { colors, FONTS } from "@/constants/theme";
import { useLogin } from "@/hooks/useLogin";

const LoginScreen = () => {
  const {
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
  } = useLogin();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={moderateScale(20)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>IA</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="00011"
              placeholderTextColor="#888"
              value={empID}
              onChangeText={handleEmpIDChange}
              keyboardType="number-pad"
              maxLength={5}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={moderateScale(20)}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        <GradientButton
          text={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
          disabled={isLoading}
        />

        <View style={styles.agreementContainer}>
          <Text style={styles.helperText}>
            By continuing, you agree to our{"\n"}
            <Text
              style={styles.agreementText}
              onPress={() => router.push("/legal/terms")}
            >
              Terms of Service
            </Text>{" "}
            &{" "}
            <Text
              style={styles.agreementText}
              onPress={() => router.push("/legal/privacy")}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <ActionModal
        visible={isErrorModalVisible}
        title="Login Failed"
        message={errorMessage}
        icon={
          <Ionicons name="alert-circle" size={40} color={colors.Danger_Red} />
        }
        confirmText="Try Again"
        confirmColor={colors.Danger_Red}
        onConfirm={() => setIsErrorModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
  },
  header: {
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  logo: {
    width: moderateScale(75),
    height: moderateScale(75),
  },
  welcomeTitle: {
    fontSize: moderateScale(26),
    fontFamily: FONTS.bold,
    color: "#000",
    marginBottom: moderateScale(15),
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
    paddingHorizontal: moderateScale(15),
    flexDirection: "row",
    alignItems: "center",
  },
  prefixContainer: {
    paddingRight: moderateScale(8),
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    marginRight: moderateScale(10),
    justifyContent: "center",
  },
  prefixText: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.bold,
    color: colors.BRAND_PRIMARY,
  },
  input: {
    height: moderateScale(48),
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: FONTS.regular,
    color: "#333",
  },
  eyeIconContainer: {
    padding: moderateScale(5),
  },
  agreementContainer: {
    marginTop: moderateScale(15),
    width: "100%",
  },
  helperText: {
    color: "#555",
    fontSize: moderateScale(14),
    fontFamily: FONTS.regular,
    textAlign: "center",
    lineHeight: moderateScale(24),
  },
  agreementText: {
    color: colors.BRAND_PRIMARY,
    fontSize: moderateScale(14),
    fontFamily: FONTS.semiBold,
  },
});

export default LoginScreen;
