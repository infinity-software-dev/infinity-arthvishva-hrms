import React from "react";
import {
    View,
    StyleSheet,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ActionModal from "@/components/modals/AlertModal";
import { colors } from "@/constants/theme";
import { usePayrolls } from "@/hooks/usePayrolls";
import GenerateFilterCard from "@/components/cards/PayrollScreen/GenerateFilterCard";
import SpotlightCard from "@/components/cards/PayrollScreen/SpotlightCard";
import CycleSelectionModal from "@/components/modals/CycleSelectionModal";
import PayrollDetailModal from "@/components/modals/PayrollDetailsModal";

const NewPayrollTab = () => {
    const { state, actions } = usePayrolls();

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <GenerateFilterCard
                    fromDate={state.fromDate}
                    toDate={state.toDate}
                    formatDateForUI={actions.formatDateForUI}
                    onShowFromPicker={() => actions.setShowFromPicker(true)}
                    onShowToPicker={() => actions.setShowToPicker(true)}
                    onGenerate={actions.handleGenerate}
                    isGenerating={state.isGenerating}
                    onShowCycleModal={() => actions.setShowCycleModal(true)}
                />

                {/* Only show Spotlight if there's a recent slip or loading state */}
                <SpotlightCard
                    slip={state.latestSlip}
                    onPress={() => actions.setSelectedSlip(state.latestSlip)}
                />

                <PayrollDetailModal
                    isVisible={!!state.selectedSlip}
                    onClose={() => actions.setSelectedSlip(null)}
                    slip={state.latestSlip}
                />
            </ScrollView>

            {/* Screen-Level Overlays (Modals & Pickers) */}
            <ActionModal
                visible={state.actionModal.visible}
                title={state.actionModal.title}
                message={state.actionModal.message}
                onConfirm={actions.closeActionModal}
                confirmText="Got it"
                confirmColor={
                    state.actionModal.type === "success"
                        ? colors.Brand_Green
                        : colors.Danger_Red
                }
                icon={
                    state.actionModal.type === "success" ? (
                        <Ionicons
                            name="checkmark-circle"
                            size={moderateScale(32)}
                            color={colors.Brand_Green}
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

            <CycleSelectionModal
                isVisible={state.showCycleModal}
                onClose={() => actions.setShowCycleModal(false)}
                cycleOptions={state.cycleOptions}
                onSelectCycle={actions.handleSelectCycle}
                formatDateForUI={actions.formatDateForUI}
            />

            {/* FROM Date Picker */}
            <DateTimePickerModal
                isVisible={state.showFromPicker}
                mode="date"
                date={state.fromDate}
                onConfirm={(date) => {
                    actions.setFromDate(date);
                    actions.setShowFromPicker(false);
                }}
                onCancel={() => actions.setShowFromPicker(false)}
            />

            {/* TO Date Picker */}
            <DateTimePickerModal
                isVisible={state.showToPicker}
                mode="date"
                date={state.toDate}
                onConfirm={(date) => {
                    actions.setToDate(date);
                    actions.setShowToPicker(false);
                }}
                onCancel={() => actions.setShowToPicker(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Base_Background
    },
    scrollContainer: {
        padding: moderateScale(16),
        paddingBottom: moderateScale(40),
    },
});

export default NewPayrollTab;