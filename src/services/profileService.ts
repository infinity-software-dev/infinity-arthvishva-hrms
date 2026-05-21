import apiClient from "@/apis/client";
import { getMyProfile } from "./authService";

export interface EmployeeProfile {
  _id: string;
  employeeCode: string;
  name: string;
  position: string;
  department: string;
  status: string;
  email: string;
  mobileNumber: string;
  bloodGroup: string;
  joiningDate: string;
  paidLeaveBalance: number;
  compOffBalance: number;
  profileImageUrl?: string;
  currentAddress: string;
  emergencyContactName: string;
  emergencyContactMobile: string;
  panNumber: string;
  bankName: string;
  accountNumber: string;
  bankVerified: boolean;
  ifsc?: string;
  totalExperienceYears?: number;
  aadhaarNumber?: string;
}

export const fetchProfile = async (): Promise<EmployeeProfile> => {
  try {
    // Call your actual API
    const res = await getMyProfile();

    // Defensive mapping: If the API changes or misses a field, it falls back to a safe default
    // instead of crashing the app with "undefined is not an object".
    return {
      _id: res?._id || "",
      employeeCode: res?.employeeCode || "N/A",
      name: res?.name || "Unknown User",
      position: res?.position || "N/A",
      department: res?.department || "N/A",
      status: res?.status || "Inactive",
      email: res?.email || "N/A",
      mobileNumber: res?.mobileNumber || "N/A",
      // Notice bloodGroup isn't in your current JSON, so it safely falls back to "N/A"
      bloodGroup: res?.bloodGroup || "N/A",
      joiningDate: res?.joiningDate || new Date().toISOString(),

      // Use ?? for numbers/booleans so 0 or false aren't accidentally overwritten
      paidLeaveBalance: res?.paidLeaveBalance ?? 0,
      compOffBalance: res?.compOffBalance ?? 0,

      profileImageUrl: res?.profileImageUrl || "",
      currentAddress: res?.currentAddress || "N/A",
      emergencyContactName: res?.emergencyContactName || "N/A",
      emergencyContactMobile: res?.emergencyContactMobile || "N/A",
      panNumber: res?.panNumber || "N/A",
      bankName: res?.bankName || "N/A",
      accountNumber: res?.accountNumber || "N/A",
      bankVerified: res?.bankVerified ?? false,
      ifsc: res?.ifsc || "N/A",
      totalExperienceYears: res?.totalExperienceYears ?? 0,
      aadhaarNumber: res?.aadhaarNumber || "",
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error; // Let the hook's try/catch block handle the UI state
  }
};

// export const updateFaceDescriptor = async (faceDescriptor: number[]) => {
//   const response = await apiClient.put('/profile/face-descriptor', {
//     faceDescriptor: faceDescriptor,
//   });
//   return response.data;
// };
