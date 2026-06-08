// services/holidayService.ts

import apiClient from "@/apis/client";

export interface Holiday {
  _id: string;
  date: string;
  year: number;
  name: string;
  type: "National" | "Company-specific";
  description?: string;
  isActive: boolean;  // The Soft Delete flag

  // Optional Mongoose fields
  createdBy?: { _id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export const fetchHolidays = async (year?: number): Promise<Holiday[]> => {
  const targetYear = year || new Date().getFullYear();
  const response = await apiClient.get(`/api/app/holidays?year=${targetYear}`);
  return response.data.data;
};
