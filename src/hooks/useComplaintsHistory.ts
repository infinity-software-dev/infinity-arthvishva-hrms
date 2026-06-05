import { useState, useCallback, useEffect } from "react";
import { helpDeskService } from "@/services/helpDeskService";



// Add this to the top of useComplaintsHistory.ts
export interface ComplaintProps {
  _id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  description: string;
  status: "Pending" | "Acknowledged" | "In Review" | "Resolved" | "Rejected";
  createdAt: string;
}

export const useComplaintsHistory = () => {
  const [complaints, setComplaints] = useState<ComplaintProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComplaints = useCallback(async (isBackgroundRefresh = false) => {
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

  return {
    state: {
      complaints,
      isLoading,
      isRefreshing,
    },
    actions: {
      handleRefresh,
      refreshComplaints: fetchComplaints, // Exposed just in case you need to trigger it externally
    },
  };
};