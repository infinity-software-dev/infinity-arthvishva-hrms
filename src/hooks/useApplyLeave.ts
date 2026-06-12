import { submitLeaveRequest, fetchActiveLedgers } from "@/services/leavesService";
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useIsFocused } from "expo-router";

export const useApplyLeave = () => {
  const isFocused = useIsFocused();
  // --- Form State ---
  const [isOptionVisible, setOptionVisible] = useState(false);
  const [ledgerInfoModal, setLedgerInfoModal] = useState({
    visible: false,
    leaveType: "",
  });
  const [selectedValue, setSelectedValue] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayShift, setHalfDayShift] = useState<"Morning" | "Afternoon">("Morning");
  const [actionModal, setActionModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });


  const [activeLedgerTokens, setActiveLedgerTokens] = useState<any[]>([]);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (isFocused) {
        try {
          const ledgerData = await fetchActiveLedgers();
          setActiveLedgerTokens(ledgerData);

        } catch (error) {
          console.error("Failed to fetch leave data", error);
        }
      }
    };
    loadData();
  }, [isFocused]);


  const openLedgerInfo = (type: string) => {
    setLedgerInfoModal({ visible: true, leaveType: type });
  };
  const closeLedgerInfo = () => {
    setLedgerInfoModal({ visible: false, leaveType: "" });
  };

  // --- Helpers & Handlers ---
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openFromPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: fromDate,
        mode: "date",
        display: "default",
        onChange: (event, selectedDate) => {
          if (event.type === "set" && selectedDate) {
            setFromDate(selectedDate);
            if (selectedDate > toDate) setToDate(selectedDate);
          }
        },
      });
    } else {
      setShowFromPicker(true);
    }
  };

  const openToPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: toDate,
        mode: "date",
        display: "default",
        onChange: (event, selectedDate) => {
          if (event.type === "set" && selectedDate) {
            if (selectedDate < fromDate) setToDate(fromDate);
            else setToDate(selectedDate);
          }
        },
      });
    } else {
      setShowToPicker(true);
    }
  };

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFromDate(selectedDate);
      if (selectedDate > toDate) setToDate(selectedDate);
    }
  };

  const handleToDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (selectedDate < fromDate) setToDate(fromDate);
      else setToDate(selectedDate);
    }
  };

  const handleDismiss = (pickerType: "from" | "to") => {
    if (pickerType === "from") setShowFromPicker(false);
    if (pickerType === "to") setShowToPicker(false);
  };

  const closeActionModal = () => {
    setActionModal((prev) => ({ ...prev, visible: false }));
  };

  //  NEW: Clear selected tokens if the user changes the leave type
  const handleLeaveTypeChange = (val: string) => {
    setSelectedValue(val);
    setSelectedTokenIds([]);
    setOptionVisible(false);
  };

  //  NEW: Toggle a token in the vault
  const toggleTokenSelection = (tokenId: string) => {
    setSelectedTokenIds(prev =>
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId) // Deselect
        : [...prev, tokenId] // Select
    );
  };

  const calculateDuration = () => {
    const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    const diffTime = end.getTime() - start.getTime();
    let diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

    if (diffDays <= 0) return 0;
    if (isHalfDay) diffDays -= 0.5;

    return diffDays;
  };

  const totalDays = calculateDuration();

  const selectedTokenValueSum = activeLedgerTokens
    .filter(t => selectedTokenIds.includes(t._id))
    .reduce((sum, t) => sum + (t.value || 1), 0);

  const handleSubmit = async () => {
    if (!selectedValue) {
      setActionModal({ visible: true, title: "Error", message: "Please select a leave type.", type: "error" });
      return;
    }
    if (!reason.trim()) {
      setActionModal({ visible: true, title: "Error", message: "Please provide a reason for your leave.", type: "error" });
      return;
    }

    if (selectedValue === 'CompOff' || selectedValue === 'Paid') {
      // Instead of checking array length, we check if the selected sum is enough to cover the requested days
      if (selectedTokenValueSum < totalDays) {
        setActionModal({
          visible: true,
          title: "Incomplete Selection",
          message: `You requested ${totalDays} day(s) off, but only selected ${selectedTokenValueSum} day(s) worth of tokens.`,
          type: "error",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await submitLeaveRequest({
        leaveType: selectedValue,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
        isHalfDay,
        halfDayShift: isHalfDay ? halfDayShift : undefined,
        totalDays,
        reason,
        consumedLedgerIds: selectedTokenIds, //  Ship the tokens!
      });

      if (response.success) {
        setActionModal({
          visible: true,
          title: "Success",
          message: response.message,
          type: "success",
        });

        // Reset form upon successful submission
        setSelectedValue("");
        setReason("");
        setIsHalfDay(false);
        setHalfDayShift("Morning");
        setFromDate(new Date());
        setToDate(new Date());
        setSelectedTokenIds([]); // Clear the vault selection

        // Optional: Refresh tokens so the consumed ones vanish from the UI
        const refreshedTokens = await fetchActiveLedgers();
        setActiveLedgerTokens(refreshedTokens);
      }
    } catch (error: any) {
      setActionModal({
        visible: true,
        title: "Request Failed",
        message: error.message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      isOptionVisible,
      ledgerInfoModal,
      selectedValue,
      fromDate,
      toDate,
      showFromPicker,
      showToPicker,
      reason,
      isHalfDay,
      halfDayShift,
      activeLedgerTokens,
      selectedTokenIds,
      isSubmitting,
      totalDays,
      actionModal,
      selectedTokenValueSum,
    },
    actions: {
      setOptionVisible,
      setSelectedValue: handleLeaveTypeChange,
      openLedgerInfo,
      closeLedgerInfo,
      setShowFromPicker,
      setShowToPicker,
      setReason,
      setIsHalfDay,
      setHalfDayShift,
      formatDate,
      openFromPicker,
      openToPicker,
      handleFromDateChange,
      handleToDateChange,
      handleDismiss,
      toggleTokenSelection,
      handleSubmit,
      closeActionModal,
    },
  };
};