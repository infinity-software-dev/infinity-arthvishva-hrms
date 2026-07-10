import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { approveLeaveRequestByManager, fetchManagerDetailedRequests, rejectLeaveRequestByManager } from "@/services/approvalService";

export interface LeaveRequest {
    _id: string;
    employeeId: {
        _id: string;
        name: string;
        position?: string;
        profileImageUrl?: string;
    };
    leaveCategory: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    isHalfDay: boolean;
    halfDayPeriod?: string;
    reason: string;
}

export const useRequestsInbox = () => {
    const user = useAuthStore((state) => state.user);
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Rejection Modal State
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [rejectionRemarks, setRejectionRemarks] = useState("");
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);

    // 2. Updated data load handler to consume live database payload streams
    const loadPendingRequests = async (showLoadingIndicator = true) => {
        if (!user?._id) return;
        try {
            if (showLoadingIndicator) setLoading(true);

            const data = await fetchManagerDetailedRequests(user._id);
            setRequests(data ?? []);
        } catch (error) {
            console.error("Error loading pending approvals from service layer:", error);
        } finally {
            if (showLoadingIndicator) setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingRequests(true);
    }, [user?._id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        // Suppress secondary full-screen loading spinner blocks during pull-to-refresh
        await loadPendingRequests(false);
        setRefreshing(false);
    };

    const handleApprove = async (id: string) => {
        if (!user?._id) return;
        try {
            // 1. Call the service layer endpoint
            await approveLeaveRequestByManager(user._id, id);

            // 2. Clear item from layout upon a successful response stream
            setRequests((prev) => prev.filter((req) => req._id !== id));
        } catch (error) {
            console.error("Failed to execute approve workflow invocation:", error);
        }
    };

    const openRejectModal = (id: string) => {
        setSelectedRequestId(id);
        setRejectionRemarks("");
        setIsRejectModalVisible(true);
    };

    const handleRejectSubmit = async () => {
        if (!user?._id || !selectedRequestId || !rejectionRemarks.trim()) return;
        try {
            // 1. Call the service layer endpoint passing the remarks body
            await rejectLeaveRequestByManager(user._id, selectedRequestId, rejectionRemarks);

            // 2. Update layout UI and clear transactional target state markers
            setRequests((prev) => prev.filter((req) => req._id !== selectedRequestId));
            setIsRejectModalVisible(false);
            setSelectedRequestId(null);
            setRejectionRemarks("");
        } catch (error) {
            console.error("Failed to execute reject workflow invocation:", error);
        }
    };

    return {
        requests,
        loading,
        refreshing,
        isRejectModalVisible,
        rejectionRemarks,
        setRejectionRemarks,
        setIsRejectModalVisible,
        handleRefresh,
        handleApprove,
        openRejectModal,
        handleRejectSubmit,
    };
};