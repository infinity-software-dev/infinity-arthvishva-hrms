// src/hooks/useReimburseForm.ts

import { useState } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { reimbursementService } from "@/services/reimbursementService";

export interface ReimburseFormData {
  amount: string;
  reason: string;
  date: Date;
  imageUri: string | null;
}

export interface ReimburseFormErrors {
  amount?: string;
  reason?: string;
  imageUri?: string;
}

export interface ModalConfig {
  title: string;
  message: string;
  isError: boolean;
}

export const useReimburseForm = () => {
  const [formData, setFormData] = useState<ReimburseFormData>({
    amount: "",
    reason: "",
    date: new Date(),
    imageUri: null,
  });

  const [errors, setErrors] = useState<ReimburseFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Manage Modal State completely inside the hook
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    message: "",
    isError: false,
  });

  // Keep formatting logic out of the component
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(formData.date);

  const handleInputChange = (field: keyof ReimburseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ReimburseFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      handleInputChange("date", selectedDate);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setErrors((prev) => ({ 
        ...prev, 
        imageUri: "Storage permissions are required to upload a receipt proof" 
      }));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, 
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const originalUri = result.assets[0].uri;

      try {
        const context = ImageManipulator.manipulate(originalUri);

        const manipulatedImage = await context
          .resize({ width: 1200 })
          .renderAsync();

        const compressedResult = await manipulatedImage.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.7,
        });

        context.release();
        manipulatedImage.release();

        handleInputChange("imageUri", compressedResult.uri);
      } catch (manipulationError) {
        console.error("Local context compression failed:", manipulationError);
        handleInputChange("imageUri", originalUri);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ReimburseFormErrors = {};
    const numericAmount = parseFloat(formData.amount);

    if (!formData.amount || isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for reimbursement is required";
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = "Please provide a more descriptive reason (min 5 characters)";
    }
    if (!formData.imageUri) {
      newErrors.imageUri = "A physical receipt or image proof is mandatory";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await reimbursementService.submitReimbursement(formData);
      
      // Handle Success State
      setFormData({ amount: "", reason: "", date: new Date(), imageUri: null });
      setModalConfig({
        title: "Claim Submitted",
        message: "Your reimbursement claim has been uploaded and sent to the HR portal successfully.",
        isError: false,
      });
      setModalVisible(true);
      
    } catch (error: any) {
      console.error("Submission operational failure:", error);
      
      // Extract backend error message if available, otherwise generic message
      const serverMessage = error.response?.data?.message || "Network submission failed. Please check connection and retry.";
      
      // Handle Error State via Modal
      setModalConfig({
        title: "Submission Failed",
        message: serverMessage,
        isError: true,
      });
      setModalVisible(true);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => setModalVisible(false);

  return {
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
  };
};