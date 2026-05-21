// services/holidayService.ts

import apiClient from "@/apis/client";

export interface Holiday {
  _id: string;
  date: string;
  name: string;
  type: "National" | "Company-specific";
  description?: string;
}

export const fetchHolidays = async (): Promise<Holiday[]> => {
  const response = await apiClient.get("/api/holidays");
  return response.data.data;
};
