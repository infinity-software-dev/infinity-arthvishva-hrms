import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";

type GlossyLogoProps = {
  text: string;
  imageSource: ImageSourcePropType;
  textSize?: number;
  imageSize?: number;
  width?: number;
  height?: number;
  baseColor?: string;
};

export default function GlossyLogo({
  text,
  imageSource,
  textSize = 30,
  imageSize = 100,
  width = 250,
  height = 200,
  baseColor = "#FFFFFF",
}: GlossyLogoProps) {
  // 1. Centralize scaling logic
  const scaledTextSize = moderateScale(textSize);
  const scaledImageSize = moderateScale(imageSize);
  const scaledWidth = moderateScale(width);
  const scaledHeight = moderateScale(height);
  const scaledMargin = moderateScale(-20);

  // 2. Start the shine off-screen based on the actual scaled width
  const translateX = useSharedValue(-scaledWidth * 2);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(scaledWidth * 2, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );

    // 3. Cleanup to prevent memory leaks on unmount
    return () => cancelAnimation(translateX);
  }, [scaledWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // 4. Memoize dynamic styles to prevent unnecessary re-renders
  const containerStyle = useMemo(
    () => ({
      height: scaledHeight,
      width: scaledWidth,
    }),
    [scaledHeight, scaledWidth],
  );

  const imageWrapperStyle = useMemo(
    () => ({
      width: scaledImageSize,
      height: scaledImageSize,
    }),
    [scaledImageSize],
  );

  const dynamicTextStyle = useMemo(
    () => [
      styles.text,
      {
        fontSize: scaledTextSize,
        marginTop: scaledMargin,
      },
    ],
    [scaledTextSize, scaledMargin],
  );

  return (
    <MaskedView
      style={containerStyle}
      maskElement={
        <View style={styles.maskWrapper}>
          <View style={imageWrapperStyle}>
            <Image source={imageSource} style={styles.image} />
          </View>

          <Text style={dynamicTextStyle}>{text}</Text>
        </View>
      }
    >
      {/* Solid Base Color */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: baseColor }]} />

      {/* Animated Glossy Shine */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            "rgba(212, 175, 55, 0)", // Transparent edges
            "rgba(212, 175, 55, 0.8)", // Rich metallic gold (Hex: #D4AF37)
            "rgba(212, 175, 55, 0)", // Transparent edges
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
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Ubuntu_700Bold",
    letterSpacing: -1,
    color: "black",
  },
});
