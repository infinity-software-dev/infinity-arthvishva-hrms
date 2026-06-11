export interface SummaryStats {
  present: number;
  absent: number;
  halfDay: number;
  weekOffHoliday: number;
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
}

export interface AttendanceApiResponse {
  summary: SummaryStats;
  records: AttendanceDayRecord[];
}