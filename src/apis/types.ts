// api/types.ts

export interface LoginRequest {
  employeeCode: string;
  password: string;
}

export interface LeaveBalanceHistoryItem {
  _id?: string;
  type: "Accrual" | "Deduction" | "Adjustment" | "Reset" | "CarryOver";
  leaveType: "Paid" | "CompOff";
  amount: number;
  previousBalance: number;
  newBalance: number;
  remarks?: string;
  timestamp?: string;
  accrualMonthKey?: string;
  earnedDate?: string;
  expiryDate?: string;
  isUsed?: boolean;
  usedDate?: string;
}

export interface Employee {
  // ── CORE IDENTITY ──
  _id: string;
  __v?: number;
  employeeCode: string;
  name: string;
  email: string;
  password?: string; // Optional since it's stripped in toSafeObject()
  role:
  | "SuperUser"
  | "HR"
  | "Manager"
  | "Director"
  | "VP"
  | "GM"
  | "Employee"
  | "Intern"
  | "fresher";
  status: "Active" | "Inactive";
  deactivateReason?: string;

  // ── BASIC DETAILS ──
  mobileNumber: string;
  alternateMobileNumber?: string;
  gender?: "Male" | "Female" | "Other";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateOfBirth?: string;
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
  profileImageUrl?: string;
  faceDescriptor?: number[];

  // ── PERSONAL DETAILS ──
  fatherName?: string;
  motherName?: string;
  currentAddress?: string;
  permanentAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;

  // ── JOB DETAILS ──
  department?: string;
  position?: string;
  joiningDate?: string;
  lastWorkingDate?: string | null;
  salary?: number;
  reportingManagers?: string[];
  managerIds?: string[]; // Represents ObjectId array

  // ── EXPERIENCE ──
  experienceType?: "Fresher" | "Experienced";
  totalExperienceYears?: number;
  lastCompanyName?: string;
  experienceCertificateUrl?: string;

  // ── EDUCATION ──
  hscPercent?: number;
  graduationCourse?: string;
  graduationPercent?: number;
  postGraduationCourse?: string;
  postGraduationPercent?: number;

  // ── DOCS (Cloudinary URLs) ──
  aadhaarNumber?: string;
  panNumber?: string;
  aadhaarFileUrl?: string;
  panFileUrl?: string;
  passbookFileUrl?: string;
  tenthMarksheetUrl?: string;
  twelfthMarksheetUrl?: string;
  graduationMarksheetUrl?: string;
  postGraduationMarksheetUrl?: string;
  medicalDocumentUrl?: string;

  // ── BANK DETAILS ──
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;
  bankVerified?: boolean;
  bankVerifiedDate?: string;

  // ── VERIFICATION ──
  aadhaarVerified?: boolean;
  panVerified?: boolean;
  aadhaarVerifiedDate?: string;
  panVerifiedDate?: string;

  // ── EMERGENCY CONTACT ──
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactMobile?: string;
  emergencyContactAddress?: string;

  // ── HEALTH ──
  hasDisease?: "Yes" | "No";
  diseaseName?: string;
  diseaseType?: string;
  diseaseSince?: string;
  medicinesRequired?: string;
  doctorName?: string;
  doctorContact?: string;

  // ── LEAVE BALANCES ──
  compOffBalance?: number;
  paidLeaveBalance?: number;
  lastLeaveAccrualDate?: string;
  leaveBalanceHistory?: LeaveBalanceHistoryItem[];

  // ── TOKENS & NOTIFICATIONS ──
  refreshToken?: string; // Optional since it's stripped in toSafeObject()
  fcmToken?: string;

  // ── TIMESTAMPS ──
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    employee: Employee;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export type AlertType = 'force_update' | 'optional_update' | 'info' | 'promo' | 'maintenance';
export type AlertPlatform = 'android' | 'ios' | 'both';

export interface AlertData {
  _id: string;
  title: string;
  message: string;
  imageUrl?: string;
  buttonText: string;

  buttonLink?: {
    android?: string;
    ios?: string;
  };

  isSkippable: boolean;
  isActive: boolean;
  type: AlertType;
  platform: AlertPlatform;

  minimumVersionCode?: {
    android?: number;
    ios?: number;
  };
  maximumVersionCode?: {
    android?: number;
    ios?: number;
  };
  createdAt: string;
  updatedAt: string;
}
