import { generateEmployeePayroll, getPayrollList } from "@/services/payrollService";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
    fetchPayrolls()
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

      // If data is already an array, use it directly. Otherwise, look for .payrolls
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

  // Helper to generate strict "Jan-Feb" cycle options, capping at the current active cycle
  const getCycleOptions = () => {
    const options = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const now = new Date();
    const currentDate = now.getDate();
    let currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
    let currentYear = now.getFullYear();

    // 1. Determine the "End Month" of the currently active cycle
    // If today is <= the 20th, the current cycle ends THIS month.
    // If today is > the 20th, the current cycle ends NEXT month.
    let targetEndMonth = currentDate > 20 ? currentMonth + 1 : currentMonth;
    let targetEndYear = currentYear;

    // Handle December overflow into January of the next year
    if (targetEndMonth > 11) {
      targetEndMonth = 0;
      targetEndYear++;
    }

    // 2. Generate the current cycle and the previous 5 cycles (6 total)
    for (let i = 0; i < 6; i++) {
      let endM = targetEndMonth - i;
      let endY = targetEndYear;

      // Correct negative months (e.g., stepping back from Jan to Dec)
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

      // 3. Format the strings perfectly
      const label = `${monthNames[startM]}-${monthNames[endM]}`; // "Jan-Feb"

      // 4. Push to options array using native local Date constructors
      // Note: The Date constructor takes 0-indexed months, so we use startM and endM directly!
      options.push({
        label: label,
        year: endY,
        // new Date(year, monthIndex, day, hours, minutes, seconds)
        fromDate: new Date(startY, startM, 21, 0, 0, 0), // Exactly midnight local time
        toDate: new Date(endY, endM, 20, 23, 59, 59)     // Exactly 11:59 PM local time
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
      // 1. Call the real backend controller
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
      closeActionModal,
      setShowCycleModal,
      getCycleOptions,
      handleSelectCycle
    },
  };
};