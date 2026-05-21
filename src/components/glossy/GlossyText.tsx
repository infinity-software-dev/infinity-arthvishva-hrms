import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

type GlossyTextProps = {
  text: string;
  fontSize?: number;
  width?: number;
  color?: string;
};

export default function GlossyText({
  text,
  fontSize = 5,
  width = 50,
  color = "#B0B5B9",
}: GlossyTextProps) {
  // FIX 2: Increased the travel distance so it fully clears the text
  const translateX = useSharedValue(-400);

  useEffect(() => {
    // Animate to +400 to ensure the shine fully exits the right side before looping
    translateX.value = withRepeat(
      withTiming(400, {
        duration: 2500, // Slightly longer duration to account for longer travel
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <MaskedView
      style={{ height: fontSize + 20, width: width }}
      maskElement={
        <View style={styles.maskWrapper}>
          <Text style={[styles.text, { fontSize }]}>{text}</Text>
        </View>
      }
    >
      {/* 1. The Base Color */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: color }]} />

      {/* 2. The Animated Glossy Shine Layer */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          // FIX 1: Use rgba white with 0 opacity instead of "transparent"
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  maskWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Ubuntu_700Bold",
    fontWeight: "bold",
    letterSpacing: -1,
    color: "black",
  },
});
