import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, FONTS } from "@/constants/theme";
import { resetAndNavigate } from "@/utils/NavigationHelper";
import { logoutEmployee } from "@/services/authService";

const DeactivatedAccountScreen = () => {
    const handleReturnLogin = async () => {
        await logoutEmployee();
        resetAndNavigate("/(auth)/login");
    }
    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
            <StatusBar style="dark" />

            <View style={styles.contentCard}>
                {/* Warning Icon Seal Wrapper */}
                <View style={styles.iconBadge}>
                    <Ionicons name="lock-closed-outline" size={moderateScale(42)} color={colors.Danger_Red} />
                </View>

                <Text style={styles.headline}>Access Suspended</Text>
                <Text style={styles.subtext}>
                    Hi Member, your account context status is currently set to <Text style={styles.boldStatus}>Inactive</Text>.
                </Text>

                {/* Reason Panel Block */}
                <View style={styles.reasonBox}>
                    <Text style={styles.reasonHeader}>Reason for Deactivation</Text>
                    <Text style={styles.reasonContent}>
                        "Your profile has been marked as inactive by the administration system."
                    </Text>
                </View>

                <Text style={styles.noticeText}>
                    You have been logged out of active workspace operational scopes. If you believe this is a clerical error, please reach out to HR Operations immediately.
                </Text>

                {/* Operational Primary Contact CTA Wrapper Button */}
                <TouchableOpacity style={styles.actionButtonWrapper} activeOpacity={0.85} onPress={handleReturnLogin}>
                    <LinearGradient
                        colors={[colors.BRAND_PRIMARY, colors.BRAND_SECONDARY]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionButton}
                    >
                        <Ionicons name="mail-outline" size={moderateScale(18)} color="#FFFFFF" style={{ marginRight: moderateScale(8) }} />
                        <Text style={styles.actionButtonText}>Return to Login Screen</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Exit Application Action Clean Sign-off Link */}
                {/* <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} >
                    <Text style={styles.logoutText}>Return to Login Screen</Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: moderateScale(24),
    },
    contentCard: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(24),
        paddingVertical: moderateScale(32),
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    iconBadge: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        backgroundColor: "#FEF2F2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: moderateScale(20),
        borderWidth: 1,
        borderColor: "#FEE2E2",
    },
    headline: {
        fontSize: moderateScale(22),
        color: "#0F172A",
        fontFamily: FONTS.bold,
        marginBottom: moderateScale(8),
        textAlign: "center",
    },
    subtext: {
        fontSize: moderateScale(14),
        color: "#475569",
        fontFamily: FONTS.medium,
        textAlign: "center",
        lineHeight: moderateScale(20),
        marginBottom: moderateScale(24),
    },
    boldStatus: {
        color: colors.Danger_Red,
        fontFamily: FONTS.bold,
    },
    reasonBox: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        width: "100%",
        marginBottom: moderateScale(20),
    },
    reasonHeader: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
        color: "#94A3B8",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: moderateScale(6),
    },
    reasonContent: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(13),
        color: "#334155",
        lineHeight: moderateScale(18),
        fontStyle: "italic",
    },
    noticeText: {
        fontFamily: FONTS.regular,
        fontSize: moderateScale(12),
        color: "#64748B",
        textAlign: "center",
        lineHeight: moderateScale(18),
        marginBottom: moderateScale(28),
        paddingHorizontal: moderateScale(10),
    },
    actionButtonWrapper: {
        width: "100%",
        borderRadius: moderateScale(24),
        overflow: "hidden",
        marginBottom: moderateScale(16),
    },
    actionButton: {
        flexDirection: "row",
        paddingVertical: moderateScale(14),
        alignItems: "center",
        justifyContent: "center",
    },
    actionButtonText: {
        fontSize: moderateScale(14),
        color: "#FFFFFF",
        fontFamily: FONTS.bold,
    },
    logoutButton: {
        paddingVertical: moderateScale(8),
    },
    logoutText: {
        fontSize: moderateScale(13),
        color: "#64748B",
        fontFamily: FONTS.semiBold,
        textDecorationLine: "underline",
    },
});


export default DeactivatedAccountScreen;