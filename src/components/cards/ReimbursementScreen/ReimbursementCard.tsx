import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { ReimbursementRecord } from "@/hooks/useReimbursementHistory";
import { colors, FONTS } from "@/constants/theme";

interface ReimbursementCardProps {
    item: ReimbursementRecord;
    onCancelRequest: (id: string) => void; // Pass the ID up to the parent to handle the modal/API
}

const ReimbursementCard: React.FC<ReimbursementCardProps> = ({ item, onCancelRequest }) => {
    const getStatusColor = (status: ReimbursementRecord["hrStatus"]) => {
        switch (status) {
            case "Approved": return colors.Success_Green;
            case "Rejected": return colors.Danger_Red;
            case "Pending":
            default: return colors.Warning_Yellow;
        }
    };

    const formattedExpenseDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    }).format(new Date(item.expenseDate));

    const formattedAppliedDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(new Date(item.createdAt));

    const statusColor = getStatusColor(item.hrStatus);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.amount}>₹ {item.amount.toFixed(2)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + "1A" }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{item.hrStatus}</Text>
                </View>
            </View>

            <Text style={styles.reason}>{item.reason}</Text>

            {/* NEW: View Receipt Link */}
            {item.imageProofUrl && (
                <TouchableOpacity
                    style={styles.receiptButton}
                    onPress={() => Linking.openURL(item.imageProofUrl)}
                >
                    <Text style={styles.receiptText}>📄 View Uploaded Receipt</Text>
                </TouchableOpacity>
            )}

            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.dateText}>Expensed: {formattedExpenseDate}</Text>
                    <Text style={styles.metaText}>Applied: {formattedAppliedDate}</Text>
                </View>
                {item.paymentStatus === "Paid" && (
                    <Text style={styles.paidBadge}>Disbursed in Payroll</Text>
                )}
            </View>

            {item.hrStatus === "Rejected" && item.rejectionReason && (
                <View style={styles.rejectionBox}>
                    <Text style={styles.rejectionText}>Reason: {item.rejectionReason}</Text>
                </View>
            )}

            {/* NEW: Cancel Button (Only for Pending) */}
            {item.hrStatus === "Pending" && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => onCancelRequest(item._id)}
                >
                    <Text style={styles.cancelButtonText}>Cancel Application</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    amount: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: "#111827"
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },
    statusText: {
        fontSize: 12,
        fontFamily: FONTS.semiBold
    },
    reason: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: "#4B5563",
        marginBottom: 12,
        lineHeight: 20
    },
    receiptButton: {
        marginBottom: 12,
        paddingVertical: 6,
    },
    receiptText: {
        color: colors.BRAND_PRIMARY,
        fontFamily: FONTS.semiBold,
        fontSize: 13,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingTop: 12
    },
    dateText: {
        fontSize: 13,
        fontFamily: FONTS.semiBold,
        color: "#4B5563"
    },
    metaText: {
        fontSize: 11,
        fontFamily: FONTS.medium,
        color: "#9CA3AF",
        marginTop: 2
    },
    paidBadge: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        color: colors.Success_Green
    },
    rejectionBox: {
        marginTop: 12,
        backgroundColor: "#FEF2F2",
        padding: 10,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: colors.Danger_Red
    },
    rejectionText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: "#991B1B"
    },
    cancelButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.Danger_Red,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelButtonText: {
        color: colors.Danger_Red,
        fontFamily: FONTS.semiBold,
        fontSize: 13,
    }
});

export default ReimbursementCard;