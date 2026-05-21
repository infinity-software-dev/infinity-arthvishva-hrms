import { useState, useCallback, useEffect } from "react";
import {
  helpDeskService,
  CreateComplaintPayload,
} from "@/services/helpDeskService";
import { FAQS_DATA } from "@/local-storage/helpDeskFAQs";

export interface ComplaintProps {
  _id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  description: string;
  status: "Pending" | "Acknowledged" | "In Review" | "Resolved" | "Rejected";
  createdAt: string;
}

export const useHelpDesk = () => {
  // UI & Data States
  const [complaints, setComplaints] = useState<ComplaintProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Controls the pull-to-refresh spinner
  const [isSubmitting, setIsSubmitting] = useState(false); // Controls the Submit button spinner
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Fetch Action
  const fetchComplaints = useCallback(async (isBackgroundRefresh = false) => {
    // Only show the full-screen loader if it's NOT a pull-to-refresh
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }

    try {
      const data = await helpDeskService.fetchMyComplaints();
      setComplaints(data.data || []);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Always turn off the refresh spinner when done
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Pull-to-Refresh Handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchComplaints(true); // Pass true so it doesn't trigger the full-screen `isLoading` state
  }, [fetchComplaints]);

  // Submit Action (POST)
  const submitComplaint = async (payload: CreateComplaintPayload) => {
    setIsSubmitting(true);
    try {
      await helpDeskService.createComplaint(payload);

      // If successful: fetch fresh data (in background) and close the modal
      await fetchComplaints(true);
      setModalVisible(false);

      return { success: true };
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ Toggle Action
  const toggleFaq = useCallback((index: number) => {
    setExpandedFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  return {
    state: {
      complaints,
      isLoading,
      isRefreshing,
      isSubmitting,
      isModalVisible,
      faqs: FAQS_DATA,
      expandedFaqIndex,
    },
    actions: {
      openModal: () => setModalVisible(true),
      closeModal: () => setModalVisible(false),
      refreshComplaints: fetchComplaints,
      handleRefresh,
      submitComplaint,
      toggleFaq,
    },
  };
};
