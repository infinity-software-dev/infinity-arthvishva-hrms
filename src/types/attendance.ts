export interface SummaryStats {
  present: number;
  absent: number;
  weekOff: number;
  late: number;
  totalHours: number;
}

export interface MyAttendance {
  _id:string;
  inTime?: string;
  outTime?: string;
  totalHours?: number;
  status?: string;
  isLate?: boolean;
  workMode:string;
  todayWork:string;
  pendingWork:string;
  issuesFaced:string;
  correctionRequested:boolean;
}

export interface AttendanceDayRecord {
  date: string | Date;
  myAttendance: MyAttendance | null;
  sharedReports: any[]; // Define this further based on your shared report schema
  status: 'P' | 'A' | 'WO' | string;
  isWeekOff: boolean;
}

export interface AttendanceApiResponse {
  summary: SummaryStats;
  records: AttendanceDayRecord[];
}