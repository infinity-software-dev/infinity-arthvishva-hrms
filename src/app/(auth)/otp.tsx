import GradientButton from "@/components/buttons/GradientButton";
import {colors} from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

const OTPVerificationScreen = () => {
  // Array to hold the 4 digits
  const [otp, setOtp] = useState(["", "", "", ""]);

  // Refs to control the focus of the 4 individual text inputs
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-advance to the next input field if a number was entered
    if (cleanValue.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Auto-revert to the previous input field if backspace is pressed on an empty box
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPSubmit = () => {
    // Handle OTP submission logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeTitle}>Verification</Text>

          <Text style={styles.instructionText}>
            Please enter the 4-digit verification code sent to your number.
          </Text>
        </View>

        {/* 4-Digit OTP Input Row */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              // FIX: Use curly braces so it returns void
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.otpBox, digit !== "" && styles.otpBoxActive]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* The Reusable Gradient Button */}
        <GradientButton
          text="Verify"
          onPress={() => console.log(`Verifying OTP: ${otp.join("")}`)}
        />

        {/* Resend Code Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.helperText}>Didn't receive the code? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Base_Background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  header: {
    alignItems: "center",
    marginBottom: moderateScale(30),
  },
  logo: {
    width: moderateScale(75),
    height: moderateScale(75),
  },
  welcomeTitle: {
    fontSize: moderateScale(26),
    fontFamily: "Nunito_700Bold",
    color: "#000",
    marginBottom: moderateScale(10),
  },
  instructionText: {
    fontSize: moderateScale(14),
    fontFamily: "Nunito_400Regular",
    color: "#666",
    textAlign: "center",
    paddingHorizontal: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", // Keeps the boxes nicely grouped in the center
    marginBottom: moderateScale(30),
  },
  otpBox: {
    width: moderateScale(55),
    height: moderateScale(60),
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: moderateScale(15),
    fontSize: moderateScale(24),
    fontFamily: "Nunito_600SemiBold",
    color: "#333",
    textAlign: "center",
  },
  otpBoxActive: {
    borderColor: colors.BRAND_SECONDARY, // Gives a subtle purple border when a digit is entered
    backgroundColor: "#fff", // Brightens the background of filled boxes
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: moderateScale(20),
  },
  helperText: {
    color: "#555",
    fontSize: moderateScale(14),
    fontFamily: "Nunito_400Regular",
  },
  resendText: {
    color: colors.BRAND_PRIMARY,
    fontSize: moderateScale(14),
    fontFamily: "Nunito_600SemiBold",
  },
});

export default OTPVerificationScreen;
