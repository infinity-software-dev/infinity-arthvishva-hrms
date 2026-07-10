import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import { LeaveRequest } from "@/hooks/useRequestsInbox";

interface ApprovalCardProps {
    item: LeaveRequest;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const formatDateString = (dateInput: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const ApprovalCard = ({ item, onApprove, onReject }: ApprovalCardProps) => {
    return (
        <View style={styles.card}>
            {/* Header Profile Section */}
            <View style={styles.headerRow}>
                <View style={styles.profileBadge}>
                    <Text style={styles.avatarText}>
                        {item.employeeId.name ? item.employeeId.name.charAt(0) : "U"}
                    </Text>
                </View>
                <View style={styles.employeeInfo}>
                    <Text style={styles.empName}>{item.employeeId.name}</Text>
                    <Text style={styles.empPosition}>{item.employeeId.position || "Team Member"}</Text>
                </View>
                <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.leaveCategory}</Text>
                </View>
            </View>

            {/* Leave Details Box */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={moderateScale(16)} color="#64748B" />
                    <Text style={styles.detailText}>
                        {formatDateString(item.startDate)} to {formatDateString(item.endDate)}
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={moderateScale(16)} color="#64748B" />
                    <Text style={styles.detailText}>
                        {item.totalDays} {item.totalDays === 1 ? "Day" : "Days"}
                        {item.isHalfDay ? ` (${item.halfDayPeriod} Half-day)` : ""}
                    </Text>
                </View>

                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text style={styles.reasonText}>{item.reason}</Text>
            </View>

            {/* Action Decision Buttons row */}
            <View style={styles.actionsRow}>
                <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => onReject(item._id)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.btnText, { color: colors.Danger_Red }]}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => onApprove(item._id)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.btnText, { color: "#FFFFFF" }]}>Approve</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(16),
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: moderateScale(12),
    },
    profileBadge: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: `${colors.BRAND_SECONDARY}12`, // Uses 7% opacity variant of corporate primary blue
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(16),
        color: colors.BRAND_SECONDARY,
    },
    employeeInfo: {
        flex: 1,
        marginLeft: moderateScale(12),
    },
    empName: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(14),
        color: "#0F172A",
    },
    empPosition: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(12),
        color: "#64748B",
    },
    categoryPill: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(8),
    },
    categoryText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(11),
        color: "#475569",
    },
    detailsContainer: {
        backgroundColor: "#F8FAFC",
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        marginBottom: moderateScale(14),
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: moderateScale(6),
        gap: moderateScale(6),
    },
    detailText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(13),
        color: "#334155",
    },
    reasonLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(12),
        color: "#64748B",
        marginTop: moderateScale(6),
    },
    reasonText: {
        fontFamily: FONTS.regular,
        fontSize: moderateScale(13),
        color: "#334155",
        marginTop: moderateScale(2),
    },
    actionsRow: {
        flexDirection: "row",
        gap: moderateScale(12),
    },
    button: {
        flex: 1,
        height: moderateScale(40),
        borderRadius: moderateScale(10),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    rejectButton: {
        borderColor: colors.Danger_Red,
        backgroundColor: `${colors.Danger_Red}08`, // Soft red background tint
    },
    approveButton: {
        borderColor: colors.BRAND_SECONDARY,
        backgroundColor: colors.BRAND_SECONDARY,
    },
    btnText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(13),
    },
});