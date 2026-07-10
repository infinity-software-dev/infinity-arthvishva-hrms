import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchManagerApprovalMetrics } from "@/services/homeService";
import { useIsFocused } from "expo-router";

export const useHomeMetrics = () => {
    const user = useAuthStore((state) => state.user);
    const isFocused = useIsFocused();

    const [metrics, setMetrics] = useState({
        isLeadership: false,
        pendingApprovalsCount: 0,
    });

    useEffect(() => {
        const loadApprovalMetrics = async () => {
            if (user?._id) {
                try {
                    const res = await fetchManagerApprovalMetrics(user._id);
                    if (res) {
                        setMetrics({
                            isLeadership: res.isLeadership ?? false,
                            pendingApprovalsCount: res.pendingApprovalsCount ?? 0,
                        });
                    }
                } catch (error) {
                    console.error("Failed to sync structural approval metrics counts:", error);
                }
            }
        };

        if (isFocused) {
            loadApprovalMetrics();
        }
    }, [user, isFocused]);

    return {
        user,
        metrics,
    };
};