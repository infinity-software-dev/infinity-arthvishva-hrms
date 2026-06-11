import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { FONTS } from "@/constants/theme";
import CustomBottomModal from "./CustomBottomModal";

// Define the shape of your cycle objects based on your hook
export interface CycleOption {
    label: string;
    year: number;
    fromDate: Date;
    toDate: Date;
}

interface CycleSelectionModalProps {
    isVisible: boolean;
    onClose: () => void;
    cycleOptions: CycleOption[];
    onSelectCycle: (start: Date, end: Date) => void;
    formatDateForUI: (date: Date) => string;
}

const CycleSelectionModal: React.FC<CycleSelectionModalProps> = ({
    isVisible,
    onClose,
    cycleOptions,
    onSelectCycle,
    formatDateForUI,
}) => {
    return (
        <CustomBottomModal
            isVisible={isVisible}
            onClose={onClose}
            title="Select Payroll Cycle"
        >
            <View style={styles.container}>
                {cycleOptions.map((cycle, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.cycleOptionRow}
                        onPress={() => onSelectCycle(cycle.fromDate, cycle.toDate)}
                        activeOpacity={0.7}
                    >
                        <View>
                            <Text style={styles.cycleLabel}>
                                {cycle.label} {cycle.year}
                            </Text>
                            <Text style={styles.cycleDates}>
                                {formatDateForUI(cycle.fromDate)}  →  {formatDateForUI(cycle.toDate)}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={moderateScale(18)}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </CustomBottomModal>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: moderateScale(20),
    },
    cycleOptionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: moderateScale(14),
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    cycleLabel: {
        fontFamily: FONTS.bold,
        fontSize: moderateScale(14),
        color: "#1E293B",
        marginBottom: moderateScale(4),
    },
    cycleDates: {
        fontFamily: FONTS.medium,
        fontSize: moderateScale(12),
        color: "#64748B",
    },
});

export default CycleSelectionModal;