// hooks/useApplyLeave.ts
import { fetchMyLeaves, submitLeaveRequest } from "@/services/leavesService";
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export const useApplyLeave = () => {
  // --- Form State ---
  const [isOptionVisible, setOptionVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayShift, setHalfDayShift] = useState<"Morning" | "Afternoon">(
    "Morning",
  );
  const [actionModal, setActionModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  // --- Data & Loading State ---
  const [balances, setBalances] = useState({
    approved: 0,
    pending: 0,
    total: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const loadBalances = async () => {
      try {
        const data = await fetchMyLeaves();
        setBalances({
          approved: data.summary.approved,
          pending: data.summary.pending,
          total: data.summary.total,
          rejected: data.summary.rejected,
          cancelled: data.summary.cancelled,
        });
      } catch (error) {
        console.error("Failed to fetch balances", error);
      }
    };
    loadBalances();
  }, []);

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
          // Changed from onValueChange to onChange
          if (event.type === "set" && selectedDate) {
            setFromDate(selectedDate);
            if (selectedDate > toDate) setToDate(selectedDate);
          }
        },
      });
    } else {
      setShowFromPicker(true); // Fallback to your BottomModal for iOS
    }
  };

  const openToPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: toDate,
        mode: "date",
        display: "default",
        onChange: (event, selectedDate) => {
          // Changed from onValueChange to onChange
          if (event.type === "set" && selectedDate) {
            if (selectedDate < fromDate) setToDate(fromDate);
            else setToDate(selectedDate);
          }
        },
      });
    } else {
      setShowToPicker(true); // Fallback to your BottomModal for iOS
    }
  };

  // Keep these strictly for iOS since iOS still uses the declarative component inside your BottomModal
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

  const calculateDuration = () => {
    const start = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate(),
    );
    const end = new Date(
      toDate.getFullYear(),
      toDate.getMonth(),
      toDate.getDate(),
    );

    const diffTime = end.getTime() - start.getTime();
    let diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

    if (diffDays <= 0) return 0;
    if (isHalfDay) diffDays -= 0.5;

    return diffDays;
  };

  const totalDays = calculateDuration();

  const handleSubmit = async () => {
    if (!selectedValue) {
      setActionModal({
        visible: true,
        title: "Error",
        message: "Please select a leave type.",
        type: "error",
      });
      return;
    }
    if (!reason.trim()) {
      setActionModal({
        visible: true,
        title: "Error",
        message: "Please provide a reason for your leave.",
        type: "error",
      });
      return;
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
      selectedValue,
      fromDate,
      toDate,
      showFromPicker,
      showToPicker,
      reason,
      isHalfDay,
      halfDayShift,
      balances,
      isSubmitting,
      totalDays,
      actionModal,
    },
    actions: {
      setOptionVisible,
      setSelectedValue,
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
      handleSubmit,
      closeActionModal,
    },
  };
};
