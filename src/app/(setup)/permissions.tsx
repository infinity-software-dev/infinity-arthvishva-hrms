import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Platform,
  Animated,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import {
  MapPin,
  Camera as CameraIcon,
  Bell,
  ArrowRight,
  Check,
  AlertCircle,
  LogOut,
} from "lucide-react-native";
import { colors, FONTS } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

// Components & Helpers
import ActionModal from "@/components/modals/AlertModal";
import {
  checkLocationPermission,
  requestLocationPermission,
} from "@/utils/LocationHelper";
import {
  checkCameraPermission,
  requestCameraPermission,
} from "@/utils/CameraHelper";
import {
  isNotificationPermissionGranted,
  requestUserPermission,
} from "@/utils/NotificationHelper";
import { resetAndNavigate } from "@/utils/NavigationHelper";
import { StatusBar } from "expo-status-bar";

const SETUP_STEPS = [
  {
    id: "location",
    title: "Location Access",
    description:
      "Location is mandatory for geo-fencing to verify your presence at the worksite.",
    icon: MapPin,
    action: requestLocationPermission,
    check: checkLocationPermission, // Silent check
  },
  {
    id: "camera",
    title: "Face Verification",
    description:
      "Camera access is required for face verification to prevent proxy attendance.",
    icon: CameraIcon,
    action: requestCameraPermission,
    check: checkCameraPermission, // Silent check
  },
  {
    id: "notifications",
    title: "Stay Updated",
    description:
      "Notifications are required for shift alerts and important company updates.",
    icon: Bell,
    action: requestUserPermission,
    check: isNotificationPermissionGranted, // Silent check
  },
];

export default function PermissionSetupScreen() {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"denied" | "exit">("denied");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 1. Initialization: Find the first missing permission
  useEffect(() => {
    const initializeSetup = async () => {
      for (let i = 0; i < SETUP_STEPS.length; i++) {
        const isGranted = await SETUP_STEPS[i].check();
        if (!isGranted) {
          setCurrentStep(i);
          return;
        }
      }
      // If everything is already granted, just go home
      resetAndNavigate("/(main)/screens/home");
    };

    initializeSetup();
  }, []);

  // 2. Prevent Android hardware back button
  useEffect(() => {
    const backAction = () => {
      setModalType("exit");
      setModalVisible(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  // 3. Trigger Animation on Step Change
  useEffect(() => {
    if (currentStep !== null) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, fadeAnim]);

  // Show a blank screen or a simple loader while checking initial status
  if (currentStep === null) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <StatusBar style="dark" />
      </View>
    );
  }

  const activeStep = SETUP_STEPS[currentStep];

  const handlePermissionRequest = async () => {
    setLoading(true);
    try {
      const isGranted = await activeStep.action();

      if (isGranted) {
        // After granting, find the NEXT missing permission
        let nextStep = -1;
        for (let i = currentStep + 1; i < SETUP_STEPS.length; i++) {
          const status = await SETUP_STEPS[i].check();
          if (!status) {
            nextStep = i;
            break;
          }
        }

        if (nextStep !== -1) {
          setCurrentStep(nextStep);
        } else {
          resetAndNavigate("/(main)/screens/home");
        }
      } else {
        setModalType("denied");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Setup Step Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    if (modalType === "exit") {
      if (Platform.OS === "android") BackHandler.exitApp();
    }
  };

  // Interpolate slide up animation
  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0], // Slides up 20 pixels
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <StatusBar style="dark" />

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {SETUP_STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index <= currentStep && styles.progressActive,
              index < currentStep && styles.progressComplete,
            ]}
          />
        ))}
      </View>

      {/* Animated Content Wrapper */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <activeStep.icon
            size={moderateScale(42)}
            color={colors.Brand_Green}
            strokeWidth={1.5}
          />
          {currentStep > 0 && (
            <View style={styles.successBadge}>
              <Check size={moderateScale(12)} color="#FFF" strokeWidth={3} />
            </View>
          )}
        </View>

        <Text style={styles.title}>{activeStep.title}</Text>
        <Text style={styles.desc}>{activeStep.description}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handlePermissionRequest}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {currentStep === SETUP_STEPS.length - 1
              ? "Finish Setup"
              : "Grant Access"}
          </Text>
          <ArrowRight size={moderateScale(18)} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.mandatoryNote}>
          * All permissions are required for app functionality
        </Text>
      </View>

      {/* Modern Action Modal */}
      <ActionModal
        visible={modalVisible}
        title={modalType === "exit" ? "Exit App?" : "Permission Required"}
        message={
          modalType === "exit"
            ? "You must complete the setup to use Infinity HRMS. Are you sure you want to exit?"
            : `To proceed, you must allow ${activeStep.title}. This is required for secure attendance.`
        }
        confirmText={modalType === "exit" ? "Exit Now" : "Try Again"}
        cancelText={modalType === "exit" ? "Stay" : undefined}
        onConfirm={handleModalConfirm}
        onCancel={
          modalType === "exit" ? () => setModalVisible(false) : undefined
        }
        confirmColor={
          modalType === "exit" ? colors.Danger_Red : colors.Brand_Blue
        }
        icon={
          modalType === "exit" ? (
            <LogOut color={colors.Danger_Red} size={moderateScale(30)} />
          ) : (
            <AlertCircle
              color={colors.Warning_Yellow}
              size={moderateScale(30)}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.Base_Background },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(24),
    marginTop: moderateScale(20),
    gap: moderateScale(8),
  },
  progressBar: {
    flex: 1,
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: "#E2E8F0",
  },
  progressActive: { backgroundColor: colors.Brand_Green },
  progressComplete: { backgroundColor: colors.Brand_Blue },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(40),
  },
  iconWrapper: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(30),
    backgroundColor: "rgba(28, 173, 163, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(32),
  },
  successBadge: {
    position: "absolute",
    top: moderateScale(-5),
    right: moderateScale(-5),
    backgroundColor: colors.Success_Green,
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.Base_Background,
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: FONTS.extraBold,
    color: "#1E293B",
    textAlign: "center",
  },
  desc: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.regular,
    color: "#64748B",
    textAlign: "center",
    marginTop: moderateScale(12),
    lineHeight: moderateScale(22),
  },
  footer: { padding: moderateScale(24), paddingBottom: moderateScale(40) },
  primaryBtn: {
    backgroundColor: colors.Brand_Green,
    height: moderateScale(58),
    borderRadius: moderateScale(18),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(10),
    elevation: 4,
    shadowColor: colors.Brand_Green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  btnText: {
    color: "#FFF",
    fontSize: moderateScale(16),
    fontFamily: FONTS.bold,
  },
  mandatoryNote: {
    textAlign: "center",
    marginTop: moderateScale(20),
    color: "#94A3B8",
    fontFamily: FONTS.medium,
    fontSize: moderateScale(12),
  },
});
