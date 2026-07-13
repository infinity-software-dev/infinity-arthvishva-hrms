import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    RefreshControl
} from "react-native";
import { useRequestsInbox } from "@/hooks/useRequestsInbox";
import { ApprovalCard } from "@/components/cards/ApprovalsScreen/ApprovalCard";
import CustomBottomModal from "@/components/modals/CustomBottomModal";
import UniversalButton from "@/components/buttons/UniversalButton";
import { colors, FONTS } from "@/constants/theme";
import { moderateScale } from "react-native-size-matters";

const RequestsInbox = () => {
    const {
        requests,
        loading,
        refreshing,
        isRejectModalVisible,
        rejectionRemarks,
        setRejectionRemarks,
        setIsRejectModalVisible,
        handleRefresh,
        handleApprove,
        openRejectModal,
        handleRejectSubmit,
    } = useRequestsInbox();

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.BRAND_SECONDARY} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ApprovalCard
                        item={item}
                        onApprove={handleApprove}
                        onReject={openRejectModal}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No pending leave requests to review.</Text>
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

            {/* Mandatory Rejection Reason Input Modal */}
            <CustomBottomModal
                title="Reason for Rejection"
                isVisible={isRejectModalVisible}
                onClose={() => setIsRejectModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalLabel}>
                        Please provide a valid reason or remark explaining the rejection decision.
                    </Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Type rejection remarks here..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={rejectionRemarks}
                        onChangeText={setRejectionRemarks}
                    />
                    <UniversalButton
                        title="Confirm Reject"
                        color={colors.Danger_Red}
                        disabled={!rejectionRemarks.trim()}
                        onPress={handleRejectSubmit}
                    />
                </View>
            </CustomBottomModal>
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
    },
    listContent: {
        padding: moderateScale(16),
    },
    emptyContainer: {
        paddingTop: moderateScale(60),
        alignItems: "center",
    },
    emptyText: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#64748B",
    },
    modalContent: {
        paddingBottom: moderateScale(10),
    },
    modalLabel: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(13),
        color: "#475569",
        marginBottom: moderateScale(12),
        lineHeight: moderateScale(18),
    },
    textArea: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#0F172A",
        minHeight: moderateScale(100),
        marginBottom: moderateScale(16),
    },
});

export default RequestsInbox;