import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import UniversalButton from "@/components/buttons/UniversalButton";

interface SandwichRuleModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function SandwichRuleModal({ isVisible, onClose }: SandwichRuleModalProps) {
    return (
        <CustomBottomModal
            title="Leave Policy Notice"
            isVisible={isVisible}
            onClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="warning-outline"
                        size={moderateScale(32)}
                        color="#F59E0B" // Warning Yellow
                    />
                </View>

                <Text style={styles.heading}>Sandwich Rule Applies</Text>

                <Text style={styles.description}>
                    Our company working days are <Text style={styles.highlight}>Monday to Saturday</Text>.
                    {"\n\n"}
                    Because your selected leave dates span across a Sunday, the <Text style={styles.highlight}>Sandwich Rule</Text> takes effect. Your Sunday will not be considered a paid week off and will be counted as part of your leave duration.
                </Text>

                <UniversalButton
                    title="I Understand"
                    color={colors.BRAND_PRIMARY}
                    onPress={onClose}
                />
            </View>
        </CustomBottomModal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: moderateScale(16),
        alignItems: "center",
    },
    iconContainer: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(30),
        backgroundColor: "#FEF3C7", // Light yellow background
        justifyContent: "center",
        alignItems: "center",
        marginBottom: moderateScale(16),
    },
    heading: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(18),
        color: "#0F172A",
        marginBottom: moderateScale(12),
    },
    description: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#475569",
        textAlign: "center",
        lineHeight: moderateScale(22),
        marginBottom: moderateScale(24),
    },
    highlight: {
        fontFamily: FONTS.bold,
        color: "#0F172A",
    },
});