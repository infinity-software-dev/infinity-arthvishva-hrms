import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomHeader } from "@/components/navbar/CustomHeader";
import UniversalButton from "@/components/buttons/UniversalButton";
import ActionModal from "@/components/modals/AlertModal";
import { colors, FONTS } from "@/constants/theme";
import { useResignation } from "@/hooks/useResignation";

const ApplyTab = () => {
    const { state, actions } = useResignation();

    const isFormValid = state.reason.trim() !== "";
    const isDisabled = state.isSubmitting || !isFormValid;

    return (
        <View style={styles.container}>

            <KeyboardAwareScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={moderateScale(120)}
            >
                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={moderateScale(24)} color={colors.BRAND_PRIMARY} />
                    <Text style={styles.infoText}>
                        Your resignation request will be routed directly to HR and the Director. Please ensure you select a last working day that complies with your notice period.
                    </Text>
                </View>

                <View style={styles.formSection}>
                    {/* Requested Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>REQUESTED LAST WORKING DAY</Text>
                        <TouchableOpacity
                            style={styles.inputBox}
                            onPress={actions.showDatePicker} //  UPDATED HANDLER
                            activeOpacity={0.7}
                        >
                            <Text style={styles.inputText}>
                                {actions.formatDate(state.requestedDate)}
                            </Text>
                            <Ionicons
                                name="calendar-outline"
                                size={moderateScale(18)}
                                color={colors.Danger_Red}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Reason Text Area */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>REASON FOR RESIGNATION</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Please detail your reason for leaving..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={state.reason}
                            onChangeText={actions.setReason}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <UniversalButton
                    title={state.isSubmitting ? "Submitting..." : "Submit Resignation"}
                    color={colors.Danger_Red}
                    onPress={actions.handleSubmit}
                    disabled={isDisabled}
                    icon={
                        state.isSubmitting ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                                size="small"
                                style={{ marginRight: moderateScale(8) }}
                            />
                        ) : (
                            <Ionicons
                                name="exit-outline"
                                size={moderateScale(18)}
                                color="#FFFFFF"
                                style={{ marginRight: moderateScale(8) }}
                            />
                        )
                    }
                />
            </KeyboardAwareScrollView>

            <DateTimePickerModal
                isVisible={state.isDatePickerVisible}
                mode="date"
                date={state.requestedDate}
                minimumDate={new Date()}
                onConfirm={actions.handleConfirmDate}
                onCancel={actions.hideDatePicker}
            />

            <ActionModal
                visible={state.actionModal.visible}
                title={state.actionModal.title}
                message={state.actionModal.message}
                onConfirm={actions.closeActionModal}
                confirmText="Got it"
                confirmColor={
                    state.actionModal.type === "success"
                        ? colors.Success_Green
                        : colors.Danger_Red
                }
                icon={
                    state.actionModal.type === "success" ? (
                        <Ionicons
                            name="checkmark-circle"
                            size={moderateScale(32)}
                            color={colors.Success_Green}
                        />
                    ) : (
                        <Ionicons
                            name="alert-circle"
                            size={moderateScale(32)}
                            color={colors.Danger_Red}
                        />
                    )
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
    scrollArea: {
        flex: 1
    },
    contentContainer: {
        padding: moderateScale(16),
        paddingBottom: moderateScale(40),
    },
    infoBanner: {
        flexDirection: "row",
        backgroundColor: `${colors.BRAND_PRIMARY}15`,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: moderateScale(24),
        alignItems: "flex-start",
        borderLeftWidth: 4,
        borderLeftColor: colors.BRAND_PRIMARY,
    },
    infoText: {
        flex: 1,
        fontFamily: FONTS.medium,
        fontSize: moderateScale(12),
        color: colors.BRAND_PRIMARY_Dark,
        marginLeft: moderateScale(10),
        lineHeight: moderateScale(18),
    },
    formSection: {
        marginBottom: moderateScale(24)
    },
    inputGroup: {
        marginBottom: moderateScale(20)
    },
    inputLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(11),
        color: "#64748B",
        marginBottom: moderateScale(8),
        letterSpacing: 0.5,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        height: moderateScale(50),
    },
    inputText: {
        fontFamily: FONTS.semiBold,
        fontSize: moderateScale(14),
        color: "#0F172A",
    },
    textArea: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        fontFamily: FONTS.medium,
        fontSize: moderateScale(14),
        color: "#0F172A",
        minHeight: moderateScale(120),
    },
});

export default ApplyTab;