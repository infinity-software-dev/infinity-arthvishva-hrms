import { useState, useCallback } from "react";
import { FAQS_DATA } from "@/local-storage/helpDeskFAQs";
import { helpDeskService, CreateComplaintPayload } from "@/services/helpDeskService";

export const useHelpDeskGeneral = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const toggleFaq = useCallback((index: number) => {
    setExpandedFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  const submitComplaint = async (payload: CreateComplaintPayload) => {
    setIsSubmitting(true);
    try {
      await helpDeskService.createComplaint(payload);
      setModalVisible(false);
      return { success: true };
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      isModalVisible,
      isSubmitting,
      faqs: FAQS_DATA,
      expandedFaqIndex,
    },
    actions: {
      openModal: () => setModalVisible(true),
      closeModal: () => setModalVisible(false),
      submitComplaint,
      toggleFaq,
    },
  };
};