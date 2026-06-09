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
    requiredDays: number; // The calculated `totalDays` they need to cover
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

    //  2. Sort tokens: Earliest expiry date first
    const sortedTokens = [...relevantTokens].sort((a, b) => {
        // If both tokens have an expiry date, compare them
        if (a.expiryDate && b.expiryDate) {
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        }
        // If only 'a' has an expiry date, it should come first
        if (a.expiryDate) return -1;
        // If only 'b' has an expiry date, it should come first
        if (b.expiryDate) return 1;

        // If neither expires, leave them in their original order
        return 0;
    });

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
                You need to select {requiredDays} token(s) to cover your requested dates.
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/*  3. Map over the sorted array instead of the raw relevant array */}
                {sortedTokens.map((token) => {
                    const isSelected = selectedTokenIds.includes(token._id);
                    // If they need 2 days, and have already selected 2 tokens, disable the unselected ones.
                    const isMaxReached = selectedTokenIds.length >= requiredDays;
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
                                    color={isSelected ? colors.Brand_Green : "#94A3B8"}
                                />
                                <Text style={[styles.tokenType, isSelected && styles.tokenTypeActive]}>
                                    1 Day
                                </Text>
                            </View>

                            <View style={styles.tokenDetails}>
                                {token.expiryDate && (
                                    <Text style={styles.expiryText}>
                                        Expires: {new Date(token.expiryDate).toLocaleDateString()}
                                    </Text>
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
    tokenCardActive: { borderColor: colors.Brand_Green, backgroundColor: `${colors.Brand_Green}05` },
    tokenCardDisabled: { opacity: 0.5 },
    tokenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(8) },
    tokenType: { fontFamily: FONTS.semiBold, fontSize: moderateScale(12), color: "#475569" },
    tokenTypeActive: { color: colors.Brand_Green },
    tokenDetails: { marginTop: moderateScale(4) },
    expiryText: { fontFamily: FONTS.medium, fontSize: moderateScale(10), color: colors.Danger_Red },
    emptyContainer: { marginTop: moderateScale(16), marginBottom: moderateScale(24) },
    emptyText: { fontFamily: FONTS.medium, fontSize: moderateScale(12), color: "#64748B" },
});