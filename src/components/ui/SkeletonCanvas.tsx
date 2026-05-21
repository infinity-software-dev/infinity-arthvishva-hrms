import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface SkeletonCanvasProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SkeletonCanvas = ({ children, style }: SkeletonCanvasProps) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      shimmerValue.setValue(0);
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    startAnimation();
  }, [shimmerValue]);

  // Moves the "glint" from -100% to 100% of the container width
  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-moderateScale(300), moderateScale(300)],
  });

  return (
    <View style={[styles.container, style]}>
      {children}
      {/* The Glittering Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.shimmerGlint} />
      </Animated.View>
    </View>
  );
};

// Helper for specific shapes (Circle, Box, Line)
export const SkeletonItem = ({ style }: { style: ViewStyle }) => (
  <View style={[styles.baseItem, style]} />
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden", // Crucial for containing the shimmer
    backgroundColor: "#F3F4F6", // Base grey
    position: "relative",
  },
  baseItem: {
    backgroundColor: "#E5E7EB", // Slightly darker grey for shapes
  },
  shimmerGlint: {
    width: "50%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // The "glitter" shine
    shadowColor: "#FFF",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
    transform: [{ skewX: "-20deg" }], // Angled shine for realistic effect
  },
});
