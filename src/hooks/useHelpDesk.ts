import { useState, useCallback, useEffect } from "react";
import { FAQS_DATA } from "@/local-storage/helpDeskFAQs";
import { helpDeskService, CreateComplaintPayload } from "@/services/helpDeskService";

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
  // --- Form & FAQ State ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // --- History State ---
  const [complaints, setComplaints] = useState<ComplaintProps[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- History Actions ---
  const fetchComplaints = useCallback(async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setIsLoadingHistory(true);
    }
    try {
      const response = await helpDeskService.fetchMyComplaints();
      const data = response.data || [];

      const sortedData = [...data].sort((a, b) => {
        const aIsWithdrawn = a.status === 'Withdrawn';
        const bIsWithdrawn = b.status === 'Withdrawn';

        if (aIsWithdrawn && !bIsWithdrawn) return 1;
        if (!aIsWithdrawn && bIsWithdrawn) return -1;

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setComplaints(sortedData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setIsLoadingHistory(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchComplaints(true);
  }, [fetchComplaints]);

  // --- General Actions ---
  const toggleFaq = useCallback((index: number) => {
    setExpandedFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  const submitComplaint = async (payload: CreateComplaintPayload) => {
    setIsSubmitting(true);
    try {
      await helpDeskService.createComplaint(payload);
      setModalVisible(false);

      // Instantly refresh the history list after a successful submission
      fetchComplaints(true);

      return { success: true };
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (complaintId: string) => {
    try {
      await helpDeskService.withdrawComplaint(complaintId);
      fetchComplaints(true);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    state: {
      isModalVisible,
      isSubmitting,
      faqs: FAQS_DATA,
      expandedFaqIndex,
      complaints,
      isLoadingHistory,
      isRefreshing,
    },
    actions: {
      openModal: () => setModalVisible(true),
      closeModal: () => setModalVisible(false),
      submitComplaint,
      toggleFaq,
      handleRefresh,
      fetchComplaints,
      handleWithdraw
    },
  };
};