import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS } from '@/constants/theme';
import UniversalButton from '@/components/buttons/UniversalButton';
import CustomBottomModal from './CustomBottomModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface LedgerToken {
    _id: string;
    leaveType: string;
    createdAt: string;
    expiryDate?: string;
    value?: number;
}

interface LedgerTokenDetailsProps {
    tokens: LedgerToken[];
    leaveType: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function LedgerTokenDetails({ tokens, leaveType, isVisible, onClose }: LedgerTokenDetailsProps) {
    const insets = useSafeAreaInsets();

    if (!isVisible) {
        return null;
    }

    return (
        <CustomBottomModal
            title="Leave Request Details"
            isVisible={isVisible}
            onClose={onClose}
        >
            {tokens.length === 0 ? (
                /* EMPTY STATE */
                <View style={{ paddingBottom: Math.max(insets.bottom, moderateScale(16)) }}>
                    <Text style={styles.emptyText}>No active {leaveType} tokens found.</Text>
                    <UniversalButton
                        title="Close"
                        color={colors.BRAND_PRIMARY}
                        onPress={onClose}
                        style={styles.closeButton}
                    />
                </View>
            ) : (
                <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {tokens.map((token) => (
                            <View key={token._id} style={styles.tokenRow}>
                                <View style={styles.leftSection}>
                                    <Ionicons name="ticket-outline" size={moderateScale(20)} color={colors.BRAND_PRIMARY} />
                                    <View>
                                        {/*  NEW: Dynamically render 0.5 Day or 1 Day */}
                                        <Text style={styles.tokenTitle}>{token.value || 1} Day Token</Text>
                                        <Text style={styles.dateText}>
                                            Added: {new Date(token.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.rightSection}>
                                    {token.expiryDate ? (
                                        <>
                                            <Text style={styles.expiresLabel}>Expires</Text>
                                            <Text style={styles.expiryDateText}>
                                                {new Date(token.expiryDate).toLocaleDateString()}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.neverExpiresText}>Never Expires</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Button with dynamic bottom inset */}
                    <View style={{ paddingBottom: Math.max(insets.bottom, moderateScale(16)) }}>
                        <UniversalButton
                            title="Close"
                            color={colors.BRAND_PRIMARY}
                            onPress={onClose}
                            style={styles.closeButton}
                        />
                    </View>
                </>
            )}
        </CustomBottomModal>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: moderateScale(400),
    },
    scrollContent: {
        paddingBottom: moderateScale(16),
    },
    tokenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: moderateScale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
    },
    tokenTitle: {
        fontFamily: FONTS.semiBold,
        color: '#0F172A',
        fontSize: moderateScale(14),
    },
    dateText: {
        fontFamily: FONTS.medium,
        color: '#64748B',
        fontSize: moderateScale(11),
        marginTop: moderateScale(2),
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    expiresLabel: {
        fontFamily: FONTS.bold,
        color: colors.Danger_Red,
        fontSize: moderateScale(11),
    },
    expiryDateText: {
        fontFamily: FONTS.medium,
        color: '#475569',
        fontSize: moderateScale(12),
        marginTop: moderateScale(2),
    },
    neverExpiresText: {
        fontFamily: FONTS.bold,
        color: colors.BRAND_SECONDARY,
        fontSize: moderateScale(11),
    },
    emptyText: {
        fontFamily: FONTS.medium,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: moderateScale(20),
        marginBottom: moderateScale(20),
    },
    closeButton: {
        marginTop: moderateScale(12),
    },
});