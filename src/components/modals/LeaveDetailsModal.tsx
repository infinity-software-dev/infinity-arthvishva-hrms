// components/modals/LeaveDetailsModal.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS } from '@/constants/theme';
import CustomBottomModal from './CustomBottomModal';
import UniversalButton from '../buttons/UniversalButton';

interface LeaveDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    leaveData: any;
    onCancel?: (leaveId: string) => void;
    isCancelling?: boolean;
}

export default function LeaveDetailsModal({ isVisible, onClose, leaveData, onCancel, isCancelling }: LeaveDetailsModalProps) {
    if (!leaveData) return null;

    const usedTokensCount = leaveData.consumedLedgerIds?.length || 0;

    // Find the rejection remarks from the workflow steps if any step was rejected
    const rejectionStep = leaveData.workflowSteps?.find((step: any) => step.status === 'Rejected');
    const rejectionRemarks = rejectionStep?.remarks;

    return (
        <CustomBottomModal
            title="Leave Request Details"
            isVisible={isVisible}
            onClose={onClose}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

                {/* Reason Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reason for Leave</Text>
                    <View style={styles.infoBox}>
                        <Text style={styles.reasonText}>{leaveData.reason || "No reason provided."}</Text>
                    </View>
                </View>

                {/* DYNAMIC: Rejection Remarks Section */}
                {leaveData.overallStatus === 'Rejected' && rejectionRemarks && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.Danger_Red }]}>Rejection Reason</Text>
                        <View style={[styles.infoBox, styles.rejectionBox]}>
                            <Ionicons name="alert-circle-outline" size={moderateScale(16)} color={colors.Danger_Red} style={styles.rejectionIcon} />
                            <Text style={styles.rejectionText}>{rejectionRemarks}</Text>
                        </View>
                    </View>
                )}

                {/* Ledger Token Usage */}
                {(leaveData.leaveCategory === 'Paid' || leaveData.leaveCategory === 'CompOff') && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tokens {leaveData.overallStatus === 'Approved' ? 'Consumed' : 'Locked'}</Text>

                        {usedTokensCount === 0 ? (
                            <View style={styles.infoBox}>
                                <Text style={styles.reasonText}>No tokens mapped to this request.</Text>
                            </View>
                        ) : (
                            <View style={styles.tokensWrapper}>
                                {leaveData.consumedLedgerIds.map((token: any, index: number) => (
                                    <View key={token._id || index} style={styles.tokenCard}>
                                        <View style={styles.tokenLeft}>
                                            <Ionicons name="ticket-outline" size={moderateScale(18)} color={colors.BRAND_PRIMARY} />
                                            <View>
                                                <Text style={styles.tokenTitle}>
                                                    {token.value || 1} Day {token.leaveType || leaveData.leaveCategory} Token
                                                </Text>

                                                {token.createdAt && (
                                                    <Text style={styles.tokenSub}>
                                                        Added: {new Date(token.createdAt).toLocaleDateString()}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        {token.expiryDate ? (
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={styles.expiryLabel}>Expires</Text>
                                                <Text style={styles.expiryDate}>{new Date(token.expiryDate).toLocaleDateString()}</Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.neverExpires}>No Expiry</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Approval Workflow */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Approval Routing</Text>
                    <View style={styles.workflowBox}>
                        {leaveData.workflowSteps?.map((step: any, index: number) => {
                            const isCompleted = step.status === 'Approved';
                            const isRejected = step.status === 'Rejected';
                            const isCurrent = leaveData.currentStepIndex === index;

                            let stepName = "Manager Approval";
                            if (step.isHRProfileStep) stepName = "HR Review";
                            if (step.isDirectorProfileStep) stepName = "Director Approval";

                            return (
                                <View key={index} style={styles.stepRow}>
                                    <Ionicons
                                        name={isCompleted ? "checkmark-circle" : isRejected ? "close-circle" : "radio-button-off"}
                                        size={moderateScale(18)}
                                        color={isCompleted ? colors.Success_Green : isRejected ? colors.Danger_Red : "#CBD5E1"}
                                    />
                                    <View style={styles.stepInfo}>
                                        <Text style={[styles.stepName, isCurrent && styles.stepNameActive]}>
                                            {stepName}
                                        </Text>
                                        <Text style={styles.stepStatus}>
                                            {step.status}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>

                {/* Cancel Button (Only visible if Pending) */}
                {leaveData.overallStatus === 'Pending' && onCancel && (
                    <View style={[styles.section, { marginTop: moderateScale(10) }]}>
                        <UniversalButton
                            title={isCancelling ? "Cancelling..." : "Cancel Leave Request"}
                            color={colors.Danger_Red}
                            onPress={() => onCancel(leaveData._id)}
                            disabled={isCancelling}
                            icon={
                                !isCancelling && (
                                    <Ionicons
                                        name="trash-outline"
                                        size={moderateScale(18)}
                                        color="#FFFFFF"
                                        style={{ marginRight: moderateScale(8) }}
                                    />
                                )
                            }
                        />
                    </View>
                )}

            </ScrollView>
        </CustomBottomModal>
    );
}

const styles = StyleSheet.create({
    container: { paddingBottom: moderateScale(20) },
    section: { marginBottom: moderateScale(20) },
    sectionTitle: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(11),
        color: "#94A3B8",
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: moderateScale(8),
    },
    infoBox: {
        backgroundColor: "#F8FAFC",
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
    },
    reasonText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#334155",
        lineHeight: moderateScale(20),
    },
    rejectionBox: {
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FEE2E2",
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rejectionIcon: {
        marginRight: moderateScale(8),
        marginTop: moderateScale(2),
    },
    rejectionText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(14),
        color: colors.Danger_Red,
        lineHeight: moderateScale(20),
        flex: 1,
    },
    tokensWrapper: {
        gap: moderateScale(8),
    },
    tokenCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
    },
    tokenLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    tokenTitle: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(13),
        color: "#0F172A",
    },
    tokenSub: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(11),
        color: "#64748B",
        marginTop: moderateScale(2),
    },
    expiryLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
        color: colors.Danger_Red,
    },
    expiryDate: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(12),
        color: "#475569",
    },
    neverExpires: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(11),
        color: colors.BRAND_SECONDARY,
    },
    workflowBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: "#F1F5F9",
        gap: moderateScale(16),
    },
    stepRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(12) },
    stepInfo: { flex: 1 },
    stepName: { fontFamily: FONTS.medium, fontSize: moderateScale(14), color: "#64748B" },
    stepNameActive: { fontFamily: FONTS.bold, color: "#0F172A" },
    stepStatus: { fontFamily: FONTS.semiBold, fontSize: moderateScale(11), color: "#94A3B8" }
});