import { generateEmployeePayroll, getPayrollList, getPayrollDetails } from "@/services/payrollService";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDateForApi } from "@/utils/TimeUtils";
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
  const [latestSlip, setLatestSlip] = useState<any>(null);
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false); // NEW

  // UI State
  const [showCycleModal, setShowCycleModal] = useState(false);
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
    fetchPayrolls();
  }, []);

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
        self: true
      });

      const actualPayrolls = Array.isArray(data) ? data : (data?.payrolls || []);
      setPayrollList(actualPayrolls);
    } catch (error: any) {
      console.error("Fetch failed", error);
      setActionModal({
        visible: true,
        type: "error",
        title: "Fetch Failed",
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate]);

  // NEW: Fetch specific payroll details
  const fetchPayrollDetails = async (payrollId: string) => {
    setIsFetchingDetails(true);
    try {
      const data = await getPayrollDetails(payrollId);
      // Assuming your backend returns { data: { ... } } or just the object
      const enrichedSlip = data.data || data;
      setSelectedSlip(enrichedSlip);
      return true; // Return success boolean for the component
    } catch (error: any) {
      console.error("Failed to fetch slip details", error);
      setActionModal({
        visible: true,
        type: "error",
        title: "Details Fetch Failed",
        message: error.message || "Could not load statement details."
      });
      return false; // Return failure
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const getCycleOptions = () => {
    const options = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const now = new Date();
    const currentDate = now.getDate();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    let targetEndMonth = currentDate > 20 ? currentMonth + 1 : currentMonth;
    let targetEndYear = currentYear;

    if (targetEndMonth > 11) {
      targetEndMonth = 0;
      targetEndYear++;
    }

    for (let i = 0; i < 6; i++) {
      let endM = targetEndMonth - i;
      let endY = targetEndYear;

      while (endM < 0) {
        endM += 12;
        endY--;
      }

      let startM = endM - 1;
      let startY = endY;

      if (startM < 0) {
        startM += 12;
        startY--;
      }

      const label = `${monthNames[startM]}-${monthNames[endM]}`;
      options.push({
        label: label,
        year: endY,
        fromDate: new Date(startY, startM, 21, 0, 0, 0),
        toDate: new Date(endY, endM, 20, 23, 59, 59)
      });
    }
    return options;
  };

  const handleSelectCycle = (start: Date, end: Date) => {
    setFromDate(start);
    setToDate(end);
    setShowCycleModal(false);
  };

  const handleGenerate = async () => {
    if (!fromDate || !toDate) return;
    setIsGenerating(true);

    try {
      const response = await generateEmployeePayroll({
        startDate: formatDateForApi(fromDate),
        endDate: formatDateForApi(toDate),
      });
      setLatestSlip(response);
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
  };

  const closeActionModal = () => setActionModal((prev) => ({ ...prev, visible: false }));

  return {
    state: {
      employeeId,
      fromDate,
      toDate,
      payrollList,
      latestSlip,
      selectedSlip,
      isLoading,
      isGenerating,
      isFetchingDetails, // Exposed to UI
      showFromPicker,
      showToPicker,
      actionModal,
      showCycleModal,
      cycleOptions: getCycleOptions(),
    },
    actions: {
      setFromDate,
      setToDate,
      setShowFromPicker,
      setShowToPicker,
      setSelectedSlip,
      formatDateForUI,
      handleGenerate,
      fetchPayrolls,
      fetchPayrollDetails, // Exposed to UI
      closeActionModal,
      setShowCycleModal,
      getCycleOptions,
      handleSelectCycle
    },
  };
};