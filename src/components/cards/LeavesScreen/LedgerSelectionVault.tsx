import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS } from '@/constants/theme';

interface LedgerVaultProps {
    leaveType: string;
    allTokens: any[];
    selectedTokenIds: string[];
    onToggleToken: (id: string) => void;
    requiredDays: number; // The exact float value (e.g., 0.5, 1, 1.5)
}

export default function LedgerSelectionVault({
    leaveType,
    allTokens,
    selectedTokenIds,
    onToggleToken,
    requiredDays
}: LedgerVaultProps) {

    // 1. Filter down to the correct leave type
    const relevantTokens = allTokens.filter(t => t.leaveType === leaveType);

    // 2. Sort tokens: Earliest expiry date first
    const sortedTokens = [...relevantTokens].sort((a, b) => {
        if (a.expiryDate && b.expiryDate) {
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        }
        if (a.expiryDate) return -1;
        if (b.expiryDate) return 1;
        return 0;
    });

    //  NEW: Calculate the exact mathematical sum of currently selected tokens
    const currentSelectedValueSum = sortedTokens
        .filter(t => selectedTokenIds.includes(t._id))
        .reduce((sum, t) => sum + (t.value || 1), 0);

    if (sortedTokens.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You have no active {leaveType} tokens available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.vaultContainer}>
            <Text style={styles.vaultTitle}>Select {leaveType} Tokens to Consume</Text>
            <Text style={styles.vaultSubtitle}>
                Need: {requiredDays} Day(s) | Selected: {currentSelectedValueSum} Day(s)
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {sortedTokens.map((token) => {
                    const isSelected = selectedTokenIds.includes(token._id);
                    const tokenValue = token.value || 1;

                    //  NEW: Disable unselected tokens ONLY if the required sum is met
                    const isMaxReached = currentSelectedValueSum >= requiredDays;
                    const isDisabled = !isSelected && isMaxReached;

                    return (
                        <TouchableOpacity
                            key={token._id}
                            activeOpacity={0.7}
                            disabled={isDisabled}
                            onPress={() => onToggleToken(token._id)}
                            style={[
                                styles.tokenCard,
                                isSelected && styles.tokenCardActive,
                                isDisabled && styles.tokenCardDisabled
                            ]}
                        >
                            <View style={styles.tokenHeader}>
                                <Ionicons
                                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                                    size={moderateScale(20)}
                                    color={isSelected ? colors.BRAND_SECONDARY : "#94A3B8"}
                                />
                                {/*  NEW: Dynamically show 0.5 Day or 1 Day */}
                                <Text style={[styles.tokenType, isSelected && styles.tokenTypeActive]}>
                                    {tokenValue} Day
                                </Text>
                            </View>

                            <View style={styles.tokenDetails}>
                                {/*  NEW: Paid shows origin month, CompOff shows expiry */}
                                {leaveType === 'Paid' ? (
                                    <Text style={styles.createdText}>
                                        Earned: {token.fixedAllowanceMonth || new Date(token.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                    </Text>
                                ) : (
                                    token.expiryDate && (
                                        <Text style={styles.expiryText}>
                                            Expires: {new Date(token.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </Text>
                                    )
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    vaultContainer: { marginTop: moderateScale(16), marginBottom: moderateScale(24) },
    vaultTitle: { fontFamily: FONTS.bold, fontSize: moderateScale(12), color: "#0F172A", marginBottom: moderateScale(4) },
    vaultSubtitle: { fontFamily: FONTS.medium, fontSize: moderateScale(11), color: "#64748B", marginBottom: moderateScale(12) },
    scrollContent: { gap: moderateScale(12) },
    tokenCard: {
        width: moderateScale(140),
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
    },
    tokenCardActive: { borderColor: colors.BRAND_SECONDARY, backgroundColor: `${colors.BRAND_SECONDARY}05` },
    tokenCardDisabled: { opacity: 0.5 },
    tokenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(8) },
    tokenType: { fontFamily: FONTS.semiBold, fontSize: moderateScale(12), color: "#475569" },
    tokenTypeActive: { color: colors.BRAND_SECONDARY },
    tokenDetails: { marginTop: moderateScale(4) },
    expiryText: { fontFamily: FONTS.medium, fontSize: moderateScale(10), color: colors.Danger_Red },
    createdText: { fontFamily: FONTS.medium, fontSize: moderateScale(10), color: colors.BRAND_PRIMARY },
    emptyContainer: { marginTop: moderateScale(16), marginBottom: moderateScale(24) },
    emptyText: { fontFamily: FONTS.medium, fontSize: moderateScale(12), color: "#64748B" },
});