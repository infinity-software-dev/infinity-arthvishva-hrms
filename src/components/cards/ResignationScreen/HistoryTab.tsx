import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { colors, FONTS } from "@/constants/theme";
import {
    getResignationHistory,
    withdrawResignationRequest,
} from "@/services/resignationService";

const HistoryTab = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

    const fetchHistory = async () => {
        try {
            const data = await getResignationHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch resignation history:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Automatically fetch data every time the user navigates to this tab
    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchHistory();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchHistory();
    }, []);

    const handleWithdraw = (id: string) => {
        Alert.alert(
            "Withdraw Resignation",
            "Are you sure you want to cancel this resignation request?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    style: "destructive",
                    onPress: async () => {
                        setWithdrawingId(id);
                        try {
                            const response = await withdrawResignationRequest(id);
                            if (response.success) {
                                fetchHistory(); // Refresh list to show "Withdrawn" status
                            }
                        } catch (error: any) {
                            Alert.alert("Error", error.message || "Failed to withdraw.");
                        } finally {
                            setWithdrawingId(null);
                        }
                    },
                },
            ]
        );
    };

    const renderStatusBadge = (status: string) => {
        let bgColor = "#F1F5F9";
        let textColor = "#64748B";

        if (status === "Pending") {
            bgColor = "#FEF3C7";
            textColor = "#D97706";
        } else if (status === "Approved") {
            bgColor = "#D1FAE5";
            textColor = "#059669";
        } else if (status === "Rejected" || status === "Withdrawn") {
            bgColor = "#FEE2E2";
            textColor = "#DC2626";
        }

        return (
            <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isPending = item.overallStatus === "Pending";

        // Find who currently needs to approve it based on the step index
        const currentStep = item.workflowSteps?.[item.currentStepIndex];
        let pendingWith = "Completed";
        if (isPending && currentStep) {
            pendingWith = currentStep.isDirectorProfileStep ? "Director" : "HR";
        }

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.label}>REQUESTED LAST DAY</Text>
                        <Text style={styles.dateText}>
                            {new Date(item.requestedLastWorkingDay).toLocaleDateString("en-GB")}
                        </Text>
                    </View>
                    {renderStatusBadge(item.overallStatus)}
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.label}>REASON</Text>
                    <Text style={styles.reasonText}>{item.reason}</Text>
                </View>

                {isPending && (
                    <View style={styles.footerInfo}>
                        <Text style={styles.pendingWithText}>
                            <Ionicons name="time-outline" size={moderateScale(14)} /> Pending with: {pendingWith}
                        </Text>
                    </View>
                )}

                {isPending && (
                    <TouchableOpacity
                        style={styles.withdrawButton}
                        activeOpacity={0.7}
                        disabled={withdrawingId === item._id}
                        onPress={() => handleWithdraw(item._id)}
                    >
                        {withdrawingId === item._id ? (
                            <ActivityIndicator size="small" color={colors.Danger_Red} />
                        ) : (
                            <>
                                <Ionicons
                                    name="close-circle-outline"
                                    size={moderateScale(18)}
                                    color={colors.Danger_Red}
                                />
                                <Text style={styles.withdrawText}>Withdraw Request</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (isLoading && !isRefreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.Brand_Blue} />
                <Text style={styles.loadingText}>Fetching history...</Text>
            </View>
        );
    }

    if (history.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="document-text-outline" size={moderateScale(48)} color="#CBD5E1" />
                <Text style={styles.emptyText}>No resignation history found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[colors.Brand_Blue]}
                        tintColor={colors.Brand_Blue}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Base_Background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.Base_Background,
        paddingTop: moderateScale(40),
    },
    loadingText: {
        marginTop: moderateScale(12),
        fontFamily: FONTS.medium,
        color: "#64748B",
    },
    emptyText: {
        marginTop: moderateScale(12),
        fontFamily: FONTS.semiBold,
        color: "#94A3B8",
        fontSize: moderateScale(14),
    },
    listContainer: {
        padding: moderateScale(16),
        paddingBottom: moderateScale(40),
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        marginBottom: moderateScale(16),
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: moderateScale(12),
    },
    label: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(10),
        color: "#94A3B8",
        marginBottom: moderateScale(4),
        letterSpacing: 0.5,
    },
    dateText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(14),
        color: "#0F172A",
    },
    statusBadge: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(20),
    },
    statusText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(11),
    },
    cardBody: {
        marginBottom: moderateScale(12),
    },
    reasonText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(13),
        color: "#475569",
        lineHeight: moderateScale(20),
    },
    footerInfo: {
        backgroundColor: "#F8FAFC",
        padding: moderateScale(8),
        borderRadius: moderateScale(6),
        marginBottom: moderateScale(12),
    },
    pendingWithText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(12),
        color: "#64748B",
    },
    withdrawButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: moderateScale(10),
        borderWidth: 1,
        borderColor: colors.Danger_Red,
        borderRadius: moderateScale(8),
        backgroundColor: "#FEF2F2",
    },
    withdrawText: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(13),
        color: colors.Danger_Red,
        marginLeft: moderateScale(6),
    },
});

export default HistoryTab;