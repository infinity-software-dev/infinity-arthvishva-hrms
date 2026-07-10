import React, { useRef } from "react";
import { Text, StyleSheet, Pressable, Animated } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";

interface ThreeDButtonProps {
    title: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

const ThreeDButton: React.FC<ThreeDButtonProps> = ({ title, icon, onPress }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: false,
            speed: 50,
            bounciness: 0,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false,
            speed: 30,
            bounciness: 8,
        }).start();
    };

    const borderBottomWidth = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateScale(3), moderateScale(1)],
    });

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, moderateScale(3)],
    });

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        borderBottomWidth,
                        transform: [{ translateY }],
                    },
                ]}
            >
                {icon && (
                    <Ionicons name={icon} size={moderateScale(14)} color={colors.BRAND_SECONDARY} />
                )}
                <Text style={styles.buttonText}>{title}</Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${colors.BRAND_SECONDARY}10`,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: `${colors.BRAND_SECONDARY}50`,
        borderBottomColor: colors.BRAND_SECONDARY,
    },
    buttonText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(11),
        color: colors.BRAND_SECONDARY,
        marginLeft: moderateScale(4),
        transform: [{ translateY: -1 }],
    },
});

export default ThreeDButton;