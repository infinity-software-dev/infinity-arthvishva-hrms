import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useReimburseForm } from "@/hooks/useReimburseForm";
import { colors, FONTS } from "@/constants/theme";
import UniversalButton from "@/components/buttons/UniversalButton";
import ActionModal from "@/components/modals/AlertModal";

const ReimbursementForm = () => {
    const {
        formData,
        errors,
        showDatePicker,
        setShowDatePicker,
        isSubmitting,
        modalVisible,
        modalConfig,
        formattedDate,
        handleInputChange,
        handleDateChange,
        pickImage,
        submitForm,
        closeModal,
    } = useReimburseForm(); // No arguments needed anymore!

    return (
        <View style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Amount Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Claim Amount (INR)</Text>
                        <TextInput
                            style={[styles.input, errors.amount && styles.inputError]}
                            placeholder="0.00"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={formData.amount}
                            onChangeText={(val) => handleInputChange("amount", val)}
                            editable={!isSubmitting}
                        />
                        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                    </View>

                    {/* Date Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Expense Date</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.dateSelector}
                            onPress={() => setShowDatePicker(true)}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.dateText}>{formattedDate}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.date}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}

                        {Platform.OS === "ios" && showDatePicker && (
                            <TouchableOpacity
                                style={styles.iosDateDone}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.iosDateDoneText}>Confirm Date</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Reason Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Reason for Expense</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, errors.reason && styles.inputError]}
                            placeholder="Brief details about what this expense covers..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.reason}
                            onChangeText={(val) => handleInputChange("reason", val)}
                            editable={!isSubmitting}
                        />
                        {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
                    </View>

                    {/* Proof Upload Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Receipt Image Proof</Text>

                        {formData.imageUri ? (
                            <View style={styles.previewContainer}>
                                <Image source={{ uri: formData.imageUri }} style={styles.previewImage} />
                                <UniversalButton
                                    title="Replace Receipt"
                                    variant="outline"
                                    color={colors.BRAND_SECONDARY}
                                    onPress={pickImage}
                                    disabled={isSubmitting}
                                    style={styles.changeImageButton}
                                />
                            </View>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={[styles.uploadPlaceholder, errors.imageUri && styles.uploadPlaceholderError]}
                                onPress={pickImage}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.uploadPlaceholderText}>+ Upload Receipt / Bill</Text>
                            </TouchableOpacity>
                        )}
                        {errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}
                    </View>

                    {/* Submit Action using UniversalButton */}
                    <UniversalButton
                        title="Submit Claim"
                        variant="solid"
                        color={colors.BRAND_SECONDARY}
                        onPress={submitForm}
                        isLoading={isSubmitting}
                        style={styles.submitButton}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Branded Feedback Confirmation/Error Modal */}
            <ActionModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.isError ? "Close" : "Perfect"}
                confirmColor={modalConfig.isError ? colors.Danger_Red : colors.BRAND_SECONDARY}
                onConfirm={closeModal}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.Base_Background,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 45,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: FONTS.semiBold,
        color: "#333333",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontFamily: FONTS.regular,
        color: "#1A202C",
        backgroundColor: "#FFFFFF",
    },
    inputError: {
        borderColor: colors.Danger_Red,
        backgroundColor: "#FFF5F5",
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    dateSelector: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
    },
    dateText: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: "#1A202C",
    },
    iosDateDone: {
        marginTop: 8,
        backgroundColor: "#E2E8F0",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    iosDateDoneText: {
        fontFamily: FONTS.semiBold,
        color: "#333333",
    },
    uploadPlaceholder: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.BRAND_SECONDARY,
        borderRadius: 8,
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0FDF4",
    },
    uploadPlaceholderError: {
        borderColor: colors.Danger_Red,
        backgroundColor: "#FFF5F5",
    },
    uploadPlaceholderText: {
        color: colors.BRAND_SECONDARY,
        fontFamily: FONTS.medium,
        fontSize: 14,
    },
    previewContainer: {
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingBottom: 16,
    },
    previewImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
        marginBottom: 14,
    },
    changeImageButton: {
        minWidth: 140,
        paddingVertical: 8,
        borderRadius: 8,
    },
    submitButton: {
        marginTop: 15,
        borderRadius: 8,
    },
    errorText: {
        color: colors.Danger_Red,
        fontSize: 12,
        fontFamily: FONTS.regular,
        marginTop: 6,
        paddingLeft: 2,
    },
});

export default ReimbursementForm;