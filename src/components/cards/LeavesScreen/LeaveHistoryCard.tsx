// components/cards/LeaveHistoryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS } from '@/constants/theme';

interface LeaveHistoryCardProps {
    item: any;
    onPress: () => void;
}

export default function LeaveHistoryCard({ item, onPress }: LeaveHistoryCardProps) {
    const currentStatus = item.overallStatus || "Unknown";

    // Helper for dynamic styles
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return { color: colors.Success_Green, bg: `${colors.Success_Green}15` };
            case "Pending":
                return { color: colors.Warning_Yellow, bg: `${colors.Warning_Yellow}15` };
            case "Rejected":
            case "Cancelled":
                return { color: colors.Danger_Red, bg: `${colors.Danger_Red}15` };
            default:
                return { color: "#94A3B8", bg: "#F1F5F9" };
        }
    };

    const statusTheme = getStatusStyle(currentStatus);

    const formatDate = (isoString: string) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.cardHeader}>
                <Text style={styles.leaveType}>{item.leaveCategory} Leave</Text>
                <View style={[styles.statusPill, { backgroundColor: statusTheme.bg }]}>
                    <Text style={[styles.statusText, { color: statusTheme.color }]}>
                        {currentStatus}
                    </Text>
                </View>
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>FROM</Text>
                    <Text style={styles.dateValue}>{formatDate(item.startDate)}</Text>
                </View>
                <Ionicons name="arrow-forward" size={moderateScale(16)} color="#CBD5E1" />
                <View style={[styles.dateItem, { alignItems: 'flex-end' }]}>
                    <Text style={styles.dateLabel}>TO</Text>
                    <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.durationWrapper}>
                    <Ionicons name="time-outline" size={moderateScale(14)} color="#64748B" />
                    <Text style={styles.durationText}>
                        {item.totalDays} {item.totalDays === 1 ? "Day" : "Days"}
                        {item.isHalfDay ? ` (${item.halfDayPeriod})` : ""}
                    </Text>
                </View>
                <Text style={styles.appliedText}>
                    Applied: {formatDate(item.createdAt)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(16),
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: moderateScale(16),
    },
    leaveType: {
        fontFamily: FONTS.extraBold,
        fontSize: moderateScale(16),
        color: "#0F172A",
    },
    statusPill: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
    },
    statusText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(11),
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F8FAFC",
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        marginBottom: moderateScale(16),
    },
    dateItem: { flex: 1 },
    dateLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
        color: "#94A3B8",
        marginBottom: moderateScale(2),
        letterSpacing: 0.5,
    },
    dateValue: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(14),
        color: "#334155",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    durationWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    durationText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(13),
        color: "#64748B",
        marginLeft: moderateScale(6),
    },
    appliedText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(11),
        color: "#94A3B8",
    },
});