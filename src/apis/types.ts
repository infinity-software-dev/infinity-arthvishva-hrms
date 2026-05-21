// api/types.ts

export interface LoginRequest {
  employeeCode: string;
  password: string;
}

export interface Employee {
  // Core Identity
  _id: string;
  __v?: number;
  employeeCode: string;
  name: string;
  email: string;
  role: string;
  status: string;

  // Professional Details
  department?: string;
  position?: string;
  joiningDate?: string;
  lastWorkingDate?: string | null;
  experienceType?: string;
  totalExperienceYears?: number;
  reportingManager?: string;
  reportingManagers?: string[];
  managerIds?: string[];
  salary?: number;

  // Personal Details
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  fatherName?: string;
  motherName?: string;

  // Addresses
  currentAddress?: string;
  permanentAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactMobile?: string;
  emergencyContactAddress?: string;

  // Education
  graduationCourse?: string;
  graduationPercent?: number;
  postGraduationCourse?: string;
  postGraduationPercent?: number;
  hscPercent?: number;

  // Balances & Biometrics
  compOffBalance?: number;
  paidLeaveBalance?: number;
  leaveBalanceHistory?: any[]; // You can type this more strictly later if needed
  faceDescriptor?: number[];
  profileImageUrl?: string; // Kept from earlier docs just in case

  // Identity & Verification
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  panNumber?: string;
  panVerified?: boolean;

  // Banking
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
  branch?: string;
  ifsc?: string;
  bankVerified?: boolean;

  // Health & Misc
  hasDisease?: string;
  bloodGroup?:string;

  // Timestamps
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

export interface AlertData {
  title: string;
  message: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isSkippable: boolean;
  isActive: boolean;
}
