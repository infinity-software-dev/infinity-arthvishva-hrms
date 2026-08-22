import { generateEmployeePayroll, getPayrollList, getPayrollDetails, downloadPayrollPdf } from "@/services/payrollService";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDateForApi } from "@/utils/TimeUtils";
import { useState, useEffect, useCallback } from "react";

// FIX: Import from the legacy module to restore previous TypeScript definitions
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export const usePayrolls = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [fromDate, setFromDate] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [toDate, setToDate] = useState<Date>(new Date());

  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [latestSlip, setLatestSlip] = useState<any>(null);
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [showCycleModal, setShowCycleModal] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [actionModal, setActionModal] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

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

  const fetchPayrollDetails = async (payrollId: string) => {
    setIsFetchingDetails(true);
    try {
      const data = await getPayrollDetails(payrollId);
      const enrichedSlip = data.data || data;
      setSelectedSlip(enrichedSlip);
      return true;
    } catch (error: any) {
      console.error("Failed to fetch slip details", error);
      setActionModal({
        visible: true,
        type: "error",
        title: "Details Fetch Failed",
        message: error.message || "Could not load statement details."
      });
      return false;
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

  const handlePdfDownload = async (payrollId: string) => {
    setIsDownloading(true);
    try {
      const base64Data = await downloadPayrollPdf(payrollId);

      // Utilize FileSystem mapped from the legacy import
      const safeDirectory = FileSystem.documentDirectory ?? "file:///";

      // Look up the specific slip in our state to grab the dates for a clean name
      const slipInfo = payrollList.find(p => p._id === payrollId);
      let cleanFilename = `Payslip_${payrollId}.pdf`; // Fallback name

      if (slipInfo && slipInfo.fromDate) {
        const d = new Date(slipInfo.fromDate);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // Formats to: Payslip_Aug_2026.pdf
        cleanFilename = `Payslip_${monthNames[d.getMonth()]}_${d.getFullYear()}.pdf`;
      }

      // Map the clean filename directly into the phone's file path
      const fileUri = `${safeDirectory}${cleanFilename}`;

      // Write the file locally
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Download Payslip',
          UTI: 'com.adobe.pdf', // Required for iOS
        });
      } else {
        setActionModal({
          visible: true,
          type: "error",
          title: "Sharing Unavailable",
          message: "Cannot share or save files on this device.",
        });
      }
    } catch (error: any) {
      console.error("PDF Download failed", error);
      setActionModal({
        visible: true,
        type: "error",
        title: "Download Failed",
        message: error.message || "Could not download the payslip.",
      });
    } finally {
      setIsDownloading(false);
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
      isFetchingDetails,
      showFromPicker,
      showToPicker,
      actionModal,
      isDownloading,
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
      fetchPayrollDetails,
      closeActionModal,
      setShowCycleModal,
      getCycleOptions,
      handleSelectCycle,
      handlePdfDownload,
    },
  };
};