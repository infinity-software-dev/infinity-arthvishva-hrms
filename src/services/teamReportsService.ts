import apiClient from "@/apis/client";

export interface WorkReport {
    _id: string;
    todayWork?: string;
    pendingWork?: string;
    issuesFaced?: string;
    isReportRead: boolean;
    createdAt: string;
    reportParticipant: {
        _id: string;
        name: string;
        position?: string;
        profileImageUrl?: string;
    };
}

export const teamReportsService = {
    /**
     * Fetches all daily work reports for the authenticated manager's team.
     */
    async fetchReports(date: string): Promise<WorkReport[]> {
        const res = await apiClient.get('/api/app/attendance/team-reports', {
            params: { date }
        });
        return res.data?.data ?? [];
    },

    /**
     * Updates the checked/reviewed toggle tracking status for a specific document entry.
     */
    async updateReadStatus(reportId: string, isReportRead: boolean): Promise<any> {
        const res = await apiClient.patch(`/api/app/attendance/work-reports/${reportId}/read-status`, {
            isReportRead
        });
        return res.data?.data;
    }
};