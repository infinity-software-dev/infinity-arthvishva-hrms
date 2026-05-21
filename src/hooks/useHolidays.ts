import { useState, useCallback, useEffect } from "react";
import { fetchHolidays, Holiday } from "@/services/holidayService";

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const handleError = (error: any) => {
    setErrorModal({
      visible: true,
      title: "Oops! Something went wrong",
      message:
        error?.message || "Failed to fetch data. Please try again later.",
    });
  };

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchHolidays();
      setHolidays(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Action to close the modal
  const closeErrorModal = () => {
    setErrorModal((prev) => ({ ...prev, visible: false }));
  };

  return {
    state: {
      holidays,
      loading,
      refreshing,
      errorModal,
    },
    actions: {
      loadData,
      closeErrorModal,
    },
  };
};
