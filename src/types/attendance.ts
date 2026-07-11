export interface SummaryStats {
  present: number;
  absent: number;
  halfDay: number;
  weekOffHoliday: number;
}

// Added this interface to strongly type the audit trail from your JSON
export interface CorrectionHistoryItem {
  action: string;
  byRole: string;
  remark: string;
  timestamp: string | Date;
  byEmployeeId?: string;
  byAdminId?: string;
}

// Added the active request payload type
export interface ActiveCorrectionRequest {
  requestedInTime?: string;
  requestedOutTime?: string;
  reason: string;
  proofUrl?: string;
  requestedOn: string;
}

export interface AttendanceDayRecord {
  date: string | Date;
  myAttendance: MyAttendance | null;
  sharedReports: any[];
  status: 'P' | 'A' | 'WO' | 'Half' | 'Pending' | string;
  isWeekOff: boolean;
}

export interface MyAttendance {
  _id: string;
  inTime?: string;
  outTime?: string;
  totalHours?: number;
  status?: string;
  isLate?: boolean;
  workMode: string;
  todayWork: string;
  pendingWork: string;
  issuesFaced: string;
  correctionRequested: boolean;

  // New fields added to satisfy TypeScript for the updated component
  correctionStatus?: 'None' | 'Pending' | 'Approved' | 'Rejected' | string;
  correctionHistory?: CorrectionHistoryItem[];
  activeCorrectionRequest?: ActiveCorrectionRequest;
}

export interface AttendanceApiResponse {
  summary: SummaryStats;
  records: AttendanceDayRecord[];
}