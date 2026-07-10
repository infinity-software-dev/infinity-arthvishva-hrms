import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useRequestsHistory } from "@/hooks/useRequestsHistory";
import { HistoryCard } from "@/components/cards/ApprovalsScreen/HistoryCard";
import { colors, FONTS } from "@/constants/theme";
import { moderateScale } from "react-native-size-matters";

const RequestsHistory = () => {
    const {
        history,
        loading,
        refreshing,
        loadingMore,
        activeFilter,
        setActiveFilter,
        handleRefresh,
        handleLoadMore
    } = useRequestsHistory();

    const filterOptions: ('All' | 'Approved' | 'Rejected' | 'Cancelled')[] = ['All', 'Approved', 'Rejected', 'Cancelled'];

    if (loading && !refreshing && history.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.BRAND_PRIMARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Horizontal Filter Header Chips Row */}
            <View style={styles.filterWrapper}>
                <FlatList
                    data={filterOptions}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.filterScroll}
                    renderItem={({ item }) => {
                        const isSelected = activeFilter === item;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setActiveFilter(item)}
                                style={[styles.chip, isSelected && styles.chipActive]}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Core Logs Infinite List */}
            <FlatList
                data={history}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <HistoryCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}

                // --- PAGINATION ON_END_REACHED HOOKS ---
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2} // Triggers load when 20% from the bottom

                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color={colors.BRAND_PRIMARY} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No matching logs found.</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.BRAND_SECONDARY}
                        colors={[colors.BRAND_SECONDARY]}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Base_Background
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.Base_Background
    },
    filterWrapper: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderColor: "#E2E8F0",
        paddingVertical: moderateScale(10),
    },
    filterScroll: {
        paddingHorizontal: moderateScale(16),
        gap: moderateScale(8),
    },
    chip: {
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(20),
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    chipActive: {
        backgroundColor: colors.BRAND_PRIMARY,
        borderColor: colors.BRAND_PRIMARY,
    },
    chipText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(12),
        color: "#64748B",
    },
    chipTextActive: {
        color: "#FFFFFF",
    },
    listContent: {
        padding: moderateScale(16)
    },
    emptyContainer: {
        paddingTop: moderateScale(60),
        alignItems: "center"
    },
    emptyText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#64748B"
    },
    footerLoader: {
        marginVertical: moderateScale(12),
        alignItems: "center",
    }
});

export default RequestsHistory;