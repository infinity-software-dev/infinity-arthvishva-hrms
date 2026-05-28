import { generateEmployeePayroll, getPayrollList } from "@/services/payrollService";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect, useCallback } from "react";

export const usePayrolls = () => {
  const [employeeId, setEmployeeId] = useState("");

  // Default to past 6 months to today
  const [fromDate, setFromDate] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [toDate, setToDate] = useState<Date>(new Date());

  // Data State
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // UI State
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [actionModal, setActionModal] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  // Auto-fetch Employee ID
  useEffect(() => {
    const currentUser = useAuthStore.getState().user;
    setEmployeeId(currentUser?._id || "");
    fetchPayrolls()
  }, []);

  const formatDateForApi = (date: Date) => date.toISOString().split("T")[0];

  const formatDateForUI = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchPayrolls = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!fromDate || !toDate) return;

      const data = await getPayrollList({
        startDate: formatDateForApi(fromDate),
        endDate: formatDateForApi(toDate),
        self: true // Set to true as per your controller logic for personal views
      });

      setPayrollList(data.payrolls || []);
    } catch (error: any) {
      console.error("Fetch failed", error);
      // Optional: Add a toast/modal here to show the error to the user
      setActionModal({ visible: true, type: "error", title: "Fetch Failed", message: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate]);

  // Fetch on mount and when dates change
  // useEffect(() => {
  //   fetchPayrolls();
  // }, [fetchPayrolls]);

  const handleGenerate = async () => {
    if (!employeeId || !fromDate || !toDate) return;
    setIsGenerating(true);

    try {
      // 1. Call the real backend controller
      await generateEmployeePayroll({
        employeeId,
        startDate: formatDateForApi(fromDate),
        endDate: formatDateForApi(toDate),
      });

      // 2. Show success state
      setActionModal({
        visible: true,
        type: "success",
        title: "Success",
        message: "Payslip generated successfully!",
      });

      // 3. Refresh the table using your getPayrollList service
      fetchPayrolls();

    } catch (error: any) {
      setActionModal({
        visible: true,
        type: "error",
        title: "Generation Failed",
        message: error.message || "Failed to generate payslip.",
      });
    } finally {
      setIsGenerating(false);
    }
  };;

  const closeActionModal = () => setActionModal((prev) => ({ ...prev, visible: false }));

  return {
    state: {
      employeeId,
      fromDate,
      toDate,
      payrollList,
      latestSlip: payrollList[0] || null,
      isLoading,
      isGenerating,
      showFromPicker,
      showToPicker,
      actionModal,
    },
    actions: {
      setFromDate,
      setToDate,
      setShowFromPicker,
      setShowToPicker,
      formatDateForUI,
      handleGenerate,
      fetchPayrolls,
      closeActionModal,
    },
  };
};