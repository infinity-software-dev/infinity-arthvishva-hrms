import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import * as Haptics from "expo-haptics"; // ✅ Opinion: Better for Rich UI
import { colors, FONTS } from "@/constants/theme";

interface SwipeButtonProps {
  onComplete: () => void;
  title?: string;
  width?: number;
  height?: number;
  disabled?: boolean; // ✅ Added disabled prop
}

export default function CustomSwipeButton({
  onComplete,
  title = "Swipe to complete",
  width = moderateScale(300),
  height = moderateScale(60),
  disabled = false, // ✅ Default to false
}: SwipeButtonProps) {
  const [toggled, setToggled] = useState(false);

  const padding = moderateScale(5);
  const trackWidth = width - padding * 2;
  const knobSize = height - padding * 2;
  const maxTranslateX = trackWidth - knobSize;

  const translateX = useSharedValue(0);

  const handleComplete = () => {
    // ✅ Haptic: Success notification
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setToggled(true);
    onComplete();

    setTimeout(() => {
      setToggled(false);
      translateX.value = withSpring(0);
    }, 1000);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (toggled || disabled) return; // ✅ Block movement if disabled

      const newValue = Math.max(0, Math.min(event.translationX, maxTranslateX));
      translateX.value = newValue;
    })
    .onEnd(() => {
      if (toggled || disabled) return;

      if (translateX.value > maxTranslateX * 0.75) {
        // ✅ Haptic: Impact when snapping to complete
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

        translateX.value = withSpring(maxTranslateX, {
          overshootClamping: true,
        });
        runOnJS(handleComplete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    // ✅ Visual feedback: Knob turns grey if disabled
    backgroundColor: disabled ? "#F3F4F6" : "#FFFFFF",
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateX.value / maxTranslateX,
    // ✅ Text color adjustment for disabled state
    color: disabled ? "rgba(255,255,255,0.9)" : "#FFFFFF",
  }));

  const animatedTrackStyle = useAnimatedStyle(() => {
    // ✅ If disabled, keep the track a neutral grey
    if (disabled) {
      return { backgroundColor: "#d1d5db" };
    }

    const backgroundColor = interpolateColor(
      translateX.value,
      [0, maxTranslateX],
      [colors.BRAND_SECONDARY, colors.BRAND_PRIMARY],
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        styles.track,
        animatedTrackStyle,
        { width, height, borderRadius: height / 2, padding },
      ]}
    >
      <Animated.Text style={[styles.title, animatedTextStyle]}>
        {toggled ? "Completed" : title}
      </Animated.Text>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.knob,
            animatedKnobStyle,
            { width: knobSize, height: knobSize, borderRadius: knobSize / 2 },
          ]}
        >
          <MaterialIcons
            name={toggled ? "check" : disabled ? "lock" : "chevron-right"}
            size={knobSize * 0.6}
            color={toggled ? colors.BRAND_PRIMARY : disabled ? "#9CA3AF" : colors.BRAND_SECONDARY}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: "center",
    overflow: "hidden",
  },
  title: {
    position: "absolute",
    alignSelf: "center",
    fontFamily: FONTS.extraBold,
    fontSize: moderateScale(16),
    zIndex: 1,
  },
  knob: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(3),
    elevation: 3,
  },
});
