import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS } from "@/constants/theme";
import CustomBottomModal from "./CustomBottomModal"; // Adjust path if needed

interface PayrollDetailModalProps {
    isVisible: boolean;
    onClose: () => void;
    slip: any | null; // Pass the entire payroll slip object here
}

const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({
    isVisible,
    onClose,
    slip,
}) => {
    if (!slip) return null;

    // Helper to format dates cleanly (e.g., "06 Jun, 2026")
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Helper to style the breakdown badges based on type
    const getBadgeStyle = (type: string) => {
        switch (type) {
            case "Present":
                return { bg: "#DCFCE7", text: "#166534", icon: "checkmark-circle" };
            case "HalfDay":
                return { bg: "#FEF3C7", text: "#92400E", icon: "partly-sunny" };
            case "Holiday":
                return { bg: "#E0E7FF", text: "#3730A3", icon: "calendar" };
            case "WeekOff":
                return { bg: "#F1F5F9", text: "#475569", icon: "bed" };
            case "CompOff":
                return { bg: "#F3E8FF", text: "#6B21A8", icon: "gift" };
            case "PaidLeave":
                return { bg: "#DBEAFE", text: "#1E40AF", icon: "airplane" };
            default:
                return { bg: "#F1F5F9", text: "#475569", icon: "ellipse" };
        }
    };

    return (
        <CustomBottomModal
            isVisible={isVisible}
            onClose={onClose}
            title={slip.isSimulation ? "Simulation Details" : "Statement Details"}
        >
            {/* Limit height so the modal doesn't stretch off-screen, making the breakdown scrollable */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: moderateScale(500) }}
                contentContainerStyle={{ paddingBottom: moderateScale(20) }}
            >
                {/* ── HEADER: NET SALARY ── */}
                <View style={styles.headerBox}>
                    <Text style={styles.headerLabel}>NET TAKE-HOME</Text>
                    <Text style={styles.netSalary}>₹ {slip.netSalary?.toFixed(2)}</Text>
                    <Text style={styles.dateRange}>
                        {formatDate(slip.fromDate)}  →  {formatDate(slip.toDate)}
                    </Text>
                </View>

                {/* ── QUICK ATTENDANCE STATS ── */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{slip.paidDays}</Text>
                        <Text style={styles.statLabel}>Paid Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{slip.presentDays}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{slip.absentDays}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{slip.halfDays}</Text>
                        <Text style={styles.statLabel}>Half Days</Text>
                    </View>
                </View>

                {/* ── FINANCIAL SPLIT ── */}
                <View style={styles.financialContainer}>
                    <View style={styles.finColumn}>
                        <Text style={styles.finTitle}>EARNINGS</Text>
                        <View style={styles.finRow}>
                            <Text style={styles.finLabel}>Basic</Text>
                            <Text style={styles.finAmount}>₹{slip.earnings?.basic.toFixed(2)}</Text>
                        </View>
                        <View style={styles.finRow}>
                            <Text style={styles.finLabel}>Allowances</Text>
                            <Text style={styles.finAmount}>₹{slip.earnings?.allowances.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.finRow, styles.finTotalRow]}>
                            <Text style={styles.finTotalLabel}>Gross</Text>
                            <Text style={styles.finTotalAmount}>₹{slip.earnings?.totalGross.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.finDivider} />

                    <View style={styles.finColumn}>
                        <Text style={styles.finTitle}>DEDUCTIONS</Text>
                        <View style={styles.finRow}>
                            <Text style={styles.finLabel}>Prof. Tax</Text>
                            <Text style={styles.finAmount}>₹{slip.deductions?.professionalTax.toFixed(2)}</Text>
                        </View>
                        <View style={styles.finRow}>
                            <Text style={styles.finLabel}>TDS / Other</Text>
                            <Text style={styles.finAmount}>₹{(slip.deductions?.taxDeductedAtSource + slip.deductions?.other).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.finRow, styles.finTotalRow]}>
                            <Text style={styles.finTotalLabel}>Total</Text>
                            <Text style={styles.finTotalAmount}>₹{slip.deductions?.totalDeductions.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* ── PAID DAYS AUDIT TRAIL ── */}
                {slip.paidDaysBreakdown && slip.paidDaysBreakdown.length > 0 && (
                    <View style={styles.breakdownSection}>
                        <Text style={styles.sectionTitle}>Paid Days Breakdown</Text>
                        {slip.paidDaysBreakdown.map((item: any, index: number) => {
                            const style = getBadgeStyle(item.type);
                            return (
                                <View key={index} style={styles.breakdownRow}>
                                    <View style={styles.breakdownLeft}>
                                        <View style={[styles.iconContainer, { backgroundColor: style.bg }]}>
                                            <Ionicons name={style.icon as any} size={moderateScale(14)} color={style.text} />
                                        </View>
                                        <Text style={styles.breakdownDate}>{formatDate(item.date)}</Text>
                                    </View>

                                    <View style={styles.breakdownRight}>
                                        <View style={[styles.badge, { backgroundColor: style.bg }]}>
                                            <Text style={[styles.badgeText, { color: style.text }]}>{item.type}</Text>
                                        </View>
                                        <Text style={styles.breakdownValue}>+{item.value}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </CustomBottomModal>
    );
};

const styles = StyleSheet.create({
    headerBox: {
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        padding: moderateScale(16),
        borderRadius: moderateScale(16),
        marginBottom: moderateScale(16),
    },
    headerLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
        color: "#64748B",
        letterSpacing: 1,
        marginBottom: moderateScale(4),
    },
    netSalary: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(28),
        color: colors.Brand_Green,
        marginBottom: moderateScale(4),
    },
    dateRange: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(12),
        color: "#94A3B8",
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: moderateScale(20),
    },
    statBox: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(12),
        marginHorizontal: moderateScale(4),
    },
    statValue: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(16),
        color: "#0F172A",
    },
    statLabel: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(10),
        color: "#64748B",
        marginTop: moderateScale(2),
    },
    financialContainer: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(24),
    },
    finColumn: {
        flex: 1,
    },
    finDivider: {
        width: 1,
        backgroundColor: "#E2E8F0",
        marginHorizontal: moderateScale(16),
    },
    finTitle: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
        color: "#64748B",
        letterSpacing: 0.5,
        marginBottom: moderateScale(12),
    },
    finRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: moderateScale(8),
    },
    finLabel: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(12),
        color: "#475569",
    },
    finAmount: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(12),
        color: "#0F172A",
    },
    finTotalRow: {
        marginTop: moderateScale(8),
        paddingTop: moderateScale(8),
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },
    finTotalLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(12),
        color: "#0F172A",
    },
    finTotalAmount: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(12),
        color: "#0F172A",
    },
    breakdownSection: {
        marginTop: moderateScale(8),
    },
    sectionTitle: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(14),
        color: "#0F172A",
        marginBottom: moderateScale(12),
    },
    breakdownRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: moderateScale(12),
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    breakdownLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        alignItems: "center",
        justifyContent: "center",
        marginRight: moderateScale(12),
    },
    breakdownDate: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(13),
        color: "#1E293B",
    },
    breakdownRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    badge: {
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(8),
        marginRight: moderateScale(12),
    },
    badgeText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
    },
    breakdownValue: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(14),
        color: "#0F172A",
        width: moderateScale(30),
        textAlign: "right",
    },
});

export default PayrollDetailModal;