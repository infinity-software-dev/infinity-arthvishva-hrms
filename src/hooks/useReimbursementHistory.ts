// src/hooks/useReimbursementHistory.ts

import { useState, useEffect, useCallback } from "react";
import { reimbursementService } from "@/services/reimbursementService";
import { colors } from "@/constants/theme";

export interface ReimbursementRecord {
    _id: string;
    amount: number;
    reason: string;
    expenseDate: string;
    hrStatus: "Pending" | "Approved" | "Rejected";
    rejectionReason?: string;
    paymentStatus: "Unpaid" | "Paid";
    imageProofUrl: string;
    createdAt: string;
}

export interface HistoryModalConfig {
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    confirmColor: string;
    isError: boolean;
}

export const useReimbursementHistory = () => {
    const [history, setHistory] = useState<ReimbursementRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Centralized Modal State Management
    const [modalVisible, setModalVisible] = useState(false);
    const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
    const [modalConfig, setModalConfig] = useState<HistoryModalConfig>({
        title: "",
        message: "",
        confirmText: "OK",
        cancelText: undefined,
        confirmColor: colors.BRAND_SECONDARY,
        isError: false,
    });

    const fetchHistory = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await reimbursementService.getReimbursementHistory();
            const records = response.data || response;
            setHistory(records);
        } catch (err: any) {
            console.error("Failed to fetch reimbursement history:", err);
            setError(
                err.response?.data?.message ||
                "Could not load your history. Please check your connection."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        keylessFetch();
    }, []);

    const keylessFetch = () => {
        fetchHistory();
    };

    // Step 1: User requests cancellation -> Initialize Confirmation Config
    const initiateCancelFlow = (id: string) => {
        setActiveClaimId(id);
        setModalConfig({
            title: "Cancel Claim",
            message: "Are you sure you want to cancel this reimbursement claim? This action cannot be undone.",
            confirmText: "Yes, Cancel",
            cancelText: "Keep It",
            confirmColor: colors.Danger_Red,
            isError: false,
        });
        setModalVisible(true);
    };

    // Step 2: User confirms action -> Execute API call transaction
    const executeCancellation = async () => {
        if (!activeClaimId) return;

        // Instantly close the confirmation viewport phase
        setModalVisible(false);

        try {
            await reimbursementService.cancelReimbursement(activeClaimId);
            // Remove the cancelled record from local array layout immediately
            setHistory((prev) => prev.filter((item) => item._id !== activeClaimId));
            setActiveClaimId(null);
        } catch (err: any) {
            console.error("Failed to cancel claim via service layer:", err);

            // Scrape precise message details returned from NestJS filters
            const serverErrorMessage =
                err.response?.data?.message ||
                "Could not process cancellation. The claim may have already been approved.";

            // Step 3: Failure Catch -> Repurpose configuration properties to render error details
            setModalConfig({
                title: "Action Failed",
                message: serverErrorMessage,
                confirmText: "Close",
                cancelText: undefined, // Sending undefined automatically hides the cancel button in your ActionModal
                confirmColor: colors.Danger_Red,
                isError: true,
            });

            setActiveClaimId(null);
            // Open the modal screen back up to surface the failure notice
            setModalVisible(true);
        }
    };

    const handleModalActionClose = () => {
        setModalVisible(false);
    };

    return {
        history,
        isLoading,
        isRefreshing,
        error,
        modalVisible,
        modalConfig,
        initiateCancelFlow,
        executeCancellation,
        handleModalActionClose,
        refetch: () => fetchHistory(true),
    };
};