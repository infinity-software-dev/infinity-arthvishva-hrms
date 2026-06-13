import { useState, useEffect, useCallback } from "react";
import {
    submitResignationRequest,
    getResignationHistory,
    withdrawResignationRequest
} from "@/services/resignationService";

export const useResignation = () => {
    const [reason, setReason] = useState("");
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const [requestedDate, setRequestedDate] = useState<Date>(defaultDate);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ---  NEW: History & Withdraw State ---
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // --- Modal State ---
    const [actionModal, setActionModal] = useState({
        visible: false,
        title: "",
        message: "",
        type: "success" as "success" | "error",
    });

    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const data = await getResignationHistory();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching resignation history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // --- Helpers ---
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirmDate = (date: Date) => {
        setRequestedDate(date);
        hideDatePicker();
    };

    const closeActionModal = () => {
        setActionModal((prev) => ({ ...prev, visible: false }));
    };

    // --- Submit Flow ---
    const handleSubmit = async () => {
        if (!reason.trim()) {
            setActionModal({
                visible: true,
                title: "Missing Information",
                message: "Please provide a reason for your resignation.",
                type: "error",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await submitResignationRequest({
                reason,
                requestedLastWorkingDay: requestedDate.toISOString(),
            });

            if (response.success) {
                setActionModal({
                    visible: true,
                    title: "Submitted",
                    message: "Your resignation request has been sent to HR.",
                    type: "success",
                });
                setReason("");


                fetchHistory();
            }
        } catch (error: any) {
            setActionModal({
                visible: true,
                title: "Submission Failed",
                message: error.message,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdraw = async (resignationId: string) => {
        setIsWithdrawing(true);
        try {
            const response = await withdrawResignationRequest(resignationId);
            if (response.success) {
                setActionModal({
                    visible: true,
                    title: "Withdrawn",
                    message: "Your resignation request has been cancelled.",
                    type: "success",
                });

                fetchHistory();
            }
        } catch (error: any) {
            setActionModal({
                visible: true,
                title: "Withdrawal Failed",
                message: error.message,
                type: "error",
            });
        } finally {
            setIsWithdrawing(false);
        }
    };

    return {
        state: {
            reason,
            requestedDate,
            isDatePickerVisible,
            isSubmitting,
            actionModal,
            history,
            isLoadingHistory,
            isWithdrawing,
        },
        actions: {
            setReason,
            showDatePicker,
            hideDatePicker,
            handleConfirmDate,
            closeActionModal,
            handleSubmit,
            handleWithdraw,
            formatDate,
            fetchHistory,
        },
    };
};