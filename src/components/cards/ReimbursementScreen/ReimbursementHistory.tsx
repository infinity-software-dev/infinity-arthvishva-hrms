import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useReimbursementHistory } from "@/hooks/useReimbursementHistory";
import { colors, FONTS } from "@/constants/theme";
import ReimbursementCard from "./ReimbursementCard";
import ActionModal from "@/components/modals/AlertModal";

const ReimbursementHistory = () => {
    const {
        history,
        isLoading,
        isRefreshing,
        error,
        refetch,
        modalVisible,
        modalConfig,
        initiateCancelFlow,
        executeCancellation,
        handleModalActionClose
    } = useReimbursementHistory();

    return (
        <View style={styles.container}>
            {isLoading && !isRefreshing ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.BRAND_SECONDARY} />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <ReimbursementCard
                            item={item}
                            onCancelRequest={initiateCancelFlow}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refetch}
                            tintColor={colors.BRAND_SECONDARY}
                            colors={[colors.BRAND_SECONDARY]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>You haven't submitted any claims yet.</Text>
                        </View>
                    }
                />
            )}

            {/* Pure Branded Orchestration Modal Viewport */}
            <ActionModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                confirmColor={modalConfig.confirmColor}
                // If it's an error message modal, confirm closes it. If it's a confirmation modal, confirm deletes it.
                onConfirm={modalConfig.isError ? handleModalActionClose : executeCancellation}
                onCancel={modalConfig.cancelText ? handleModalActionClose : undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.Base_Background },
    listContainer: { padding: 16, flexGrow: 1 },
    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    errorText: { fontSize: 14, fontFamily: FONTS.medium, color: colors.Danger_Red, textAlign: "center" },
    emptyText: { fontSize: 15, fontFamily: FONTS.medium, color: "#6B7280", textAlign: "center" },
});

export default ReimbursementHistory;