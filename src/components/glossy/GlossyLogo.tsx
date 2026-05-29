import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
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
  // 1. State to track when the image is fully in memory
  const [isImageReady, setIsImageReady] = useState(false);

  const scaledTextSize = moderateScale(textSize);
  const scaledImageSize = moderateScale(imageSize);
  const scaledWidth = moderateScale(width);
  const scaledHeight = moderateScale(height);
  const scaledMargin = moderateScale(-20);

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

    return () => cancelAnimation(translateX);
  }, [scaledWidth, translateX]);

  // 2. Failsafe: Local images sometimes fail to fire onLoad. 
  // This guarantees the mask renders after 200ms no matter what.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isImageReady) setIsImageReady(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [isImageReady]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

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
    <View style={containerStyle}>
      {/* 3. The Hidden Preloader: Forces the image into device cache */}
      {!isImageReady && (
        <Image
          source={imageSource}
          style={styles.hiddenPreloader}
          onLoad={() => setIsImageReady(true)}
          onError={() => setIsImageReady(true)} // Prevent infinite lock
        />
      )}

      {/* 4. Only mount the MaskedView when the image is guaranteed to be ready */}
      {isImageReady && (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <View style={styles.maskWrapper}>
              <View style={imageWrapperStyle}>
                <Image 
                  source={imageSource} 
                  style={styles.image} 
                  fadeDuration={0} // Prevents Android fading bug inside masks
                />
              </View>

              <Text style={dynamicTextStyle}>{text}</Text>
            </View>
          }
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: baseColor }]} />

          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <LinearGradient
              colors={[
                "rgba(212, 175, 55, 0)",
                "rgba(212, 175, 55, 0.8)",
                "rgba(212, 175, 55, 0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </MaskedView>
      )}
    </View>
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
  // Added style for the preloader
  hiddenPreloader: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});