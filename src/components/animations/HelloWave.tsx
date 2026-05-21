import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const HelloWave = ({ emoji = "👋", repeatCount = 4, intervalMins = 1 }) => {
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    // Function to trigger the wave animation
    const startWaveAnimation = () => {
      rotationAnimation.value = withRepeat(
        withSequence(
          withTiming(25, { duration: 150 }),
          withTiming(0, { duration: 150 })
        ),
        repeatCount
      );
    };

    // Start the initial wave
    startWaveAnimation();

    // Set up interval for repeated wave animation
    const intervalId = setInterval(() => {
      startWaveAnimation();
    }, intervalMins * 60 * 1000); // Convert minutes to milliseconds

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [rotationAnimation, repeatCount, intervalMins]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={styles.text}>{emoji}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    lineHeight: 36,
  },
});

export default HelloWave;