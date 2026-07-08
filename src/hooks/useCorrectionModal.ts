import { useState } from "react";

interface UseCorrectionModalProps {
    recordDate: string | Date;
    defaultInTime?: string | null;
    defaultOutTime?: string | null;
    onSubmit: (data: {
        reason: string;
        requestedInTime: Date;
        requestedOutTime: Date;
        proofUrl?: string;
    }) => Promise<void>;
}

export const useCorrectionModal = ({
    recordDate,
    defaultInTime,
    defaultOutTime,
    onSubmit,
}: UseCorrectionModalProps) => {
    // --- Initialization ---
    const baseDate = new Date(recordDate);

    const initialIn = defaultInTime
        ? new Date(defaultInTime)
        : new Date(baseDate.setHours(9, 0, 0, 0));

    // Dynamic Out-Time Calculation Logic
    let initialOut: Date;
    if (defaultOutTime) {
        initialOut = new Date(defaultOutTime);
    } else {
        // Clone the initialIn date so we don't mutate it
        initialOut = new Date(initialIn.getTime());

        // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const dayOfWeek = initialOut.getDay();
        const isSaturday = dayOfWeek === 6;

        if (isSaturday) {
            // Saturday: 7.1 hours = 7 hours and 6 minutes (0.1 * 60)
            initialOut.setHours(initialOut.getHours() + 7);
            initialOut.setMinutes(initialOut.getMinutes() + 6);
        } else {
            // Mon-Fri (and Sunday fallback): 8.6 hours = 8 hours and 36 minutes (0.6 * 60)
            initialOut.setHours(initialOut.getHours() + 8);
            initialOut.setMinutes(initialOut.getMinutes() + 36);
        }
    }

    // --- State ---
    const [reason, setReason] = useState("");
    const [proofUrl, setProofUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasModifiedTime, setHasModifiedTime] = useState(false);
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [inTime, setInTime] = useState<Date>(initialIn);
    const [outTime, setOutTime] = useState<Date>(initialOut);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [activePicker, setActivePicker] = useState<"in" | "out" | null>(null);

    // --- Helpers ---
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getWorkingDuration = (start: Date, end: Date) => {
        let diffMs = end.getTime() - start.getTime();

        if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
        }

        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    // --- Handlers ---
    const showPicker = (type: "in" | "out") => {
        setActivePicker(type);
        setPickerVisible(true);
    };

    const hidePicker = () => {
        setPickerVisible(false);
        setActivePicker(null);
    };

    const handleConfirmTime = (date: Date) => {
        if (activePicker === "in") {
            setInTime(date);
        } else if (activePicker === "out") {
            setOutTime(date);
        }
        setHasModifiedTime(true);

        hidePicker();
    };

    const handlePreSubmit = () => {
        setConfirmModalVisible(true);
    };

    const handleFinalSubmit = async () => {
        setConfirmModalVisible(false);
        setIsLoading(true);
        try {
            await onSubmit({
                reason: reason.trim(),
                requestedInTime: inTime,
                requestedOutTime: outTime,
                proofUrl: proofUrl.trim(),
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Derived State ---
    // const isFormIncomplete = !reason.trim() || !hasModifiedTime;
    const isFormIncomplete = !reason.trim();


    return {
        // State values & setters
        reason,
        setReason,
        proofUrl,
        setProofUrl,
        isLoading,
        hasModifiedTime,
        isConfirmModalVisible,
        setConfirmModalVisible,
        inTime,
        outTime,
        isPickerVisible,
        activePicker,
        // Derived values
        isFormIncomplete,
        formattedInTime: formatTime(inTime),
        formattedOutTime: formatTime(outTime),
        workingDuration: getWorkingDuration(inTime, outTime),
        // Handlers
        showPicker,
        hidePicker,
        handleConfirmTime,
        handlePreSubmit,
        handleFinalSubmit,
    };
};