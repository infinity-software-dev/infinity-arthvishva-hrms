import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LeaveRequest } from "./useRequestsInbox";
import { fetchManagerRequestHistory } from "@/services/approvalService";

export interface HistoricalLeaveRequest extends LeaveRequest {
    overallStatus: 'Approved' | 'Rejected' | 'Cancelled';
    updatedAt: string;
    workflowSteps: Array<{
        approverId: string;
        status: string;
        remarks?: string;
        actedById?: string;
        isHRProfileStep?: boolean;
        isDirectorProfileStep?: boolean;
    }>;
}

export const useRequestsHistory = () => {
    const user = useAuthStore((state) => state.user);
    const [history, setHistory] = useState<HistoricalLeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ── NEW PAGINATION & FILTER STATES ──
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Approved' | 'Rejected' | 'Cancelled'>('All');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 10;

    const loadHistoryLogs = async (pageNumber: number, filterType: string, shouldAppend = false, showLoading = true) => {
        if (!user?._id) return;
        try {
            if (showLoading) setLoading(true);

            const data = await fetchManagerRequestHistory(user._id, {
                page: pageNumber,
                limit: LIMIT,
                // Add the type assertion here so TypeScript knows it's a valid status literal
                status: (filterType === 'All' ? undefined : filterType) as 'Approved' | 'Rejected' | 'Cancelled' | undefined
            });

            const fetchedData = data ?? [];

            // If backend data length is less than our limit, we have reached the end of the history list
            if (fetchedData.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setHistory((prev) => (shouldAppend ? [...prev, ...fetchedData] : fetchedData));
        } catch (error) {
            console.error("Failed loading historical resolver logs:", error);
        } finally {
            if (showLoading) setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            setPage(1);
            setHasMore(true);
            loadHistoryLogs(1, activeFilter, false, true);
        }
    }, [user?._id, activeFilter]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        await loadHistoryLogs(1, activeFilter, false, false);
    };

    const handleLoadMore = async () => {
        if (loadingMore || !hasMore || loading || refreshing) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);

        // Pass the precise increment target straight into the async function context call
        await loadHistoryLogs(nextPage, activeFilter, true, false);
    };

    return {
        history,
        loading,
        refreshing,
        loadingMore,
        activeFilter,
        setActiveFilter,
        handleRefresh,
        handleLoadMore
    };
};