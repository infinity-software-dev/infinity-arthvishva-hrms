import { teamReportsService, WorkReport } from "@/services/teamReportsService";
import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";

export const useTeamReports = () => {
    // Helper: Format any JS Date object into local timezone-safe YYYY-MM-DD
    const formatToLocalDateString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState<string>(formatToLocalDateString(new Date()));
    const [reports, setReports] = useState<WorkReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    // --- CALENDAR RIBBON GENERATOR (MON-SAT) ---
    const generateWeekRibbon = useCallback((dateStr: string) => {
        const current = new Date(dateStr);
        const dayOfWeek = current.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

        // Calculate the distance back to Monday (if Sunday, go back 6 days)
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const monday = new Date(current);
        monday.setDate(current.getDate() + distanceToMonday);

        const ribbonSlots = [];
        const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let i = 0; i < 6; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            const formattedSlotDate = formatToLocalDateString(nextDay);

            ribbonSlots.push({
                dayName: dayLabels[i],
                dayNum: String(nextDay.getDate()).padStart(2, "0"),
                dateString: formattedSlotDate,
                isToday: formattedSlotDate === formatToLocalDateString(new Date())
            });
        }
        return ribbonSlots;
    }, []);

    const weekRibbon = generateWeekRibbon(selectedDate);

    // --- FETCH ENGINE TRIGGER ---
    const fetchReports = useCallback(async (targetDate: string, showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const data = await teamReportsService.fetchReports(targetDate);
            setReports(data);
        } catch (error) {
            console.error("Failed to sync team performance metrics:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // --- STATUS UPDATE TRIGGER WITH OPTIMISTIC STATE UPDATES ---
    const handleToggleReadStatus = async (reportId: string, currentReadState: boolean) => {
        try {
            // Optimistic update for latency-free experience
            setReports(prev =>
                prev.map(item => item._id === reportId ? { ...item, isReportRead: !currentReadState } : item)
            );

            await teamReportsService.updateReadStatus(reportId, !currentReadState);
        } catch (error) {
            console.error("Failed to commit status change to server:", error);
            // Revert optimistic changes on network connection drops
            fetchReports(selectedDate, false);
        }
    };

    // Automatically sync content feed when date state changes
    useEffect(() => {
        fetchReports(selectedDate, true);
    }, [selectedDate, fetchReports]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchReports(selectedDate, false);
    };

    const onDatePickerChange = (event: any, date?: Date) => {
        if (Platform.OS === "android") setShowDatePicker(false);

        if (date) {
            const localizedStr = formatToLocalDateString(date);
            setSelectedDate(localizedStr);
        }
    };

    return {
        selectedDate,
        setSelectedDate,
        reports,
        loading,
        refreshing,
        weekRibbon,
        showDatePicker,
        setShowDatePicker,
        handleRefresh,
        onDatePickerChange,
        handleToggleReadStatus
    };
};