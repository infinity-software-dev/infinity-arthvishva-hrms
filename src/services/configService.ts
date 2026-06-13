import apiClient from "@/apis/client";
import { useConfigStore } from "@/store/useConfigStore";

interface ApiConfigResponse {
  office_lat: number;
  office_lon: number;
  radius_meters: number;
  shift_hours: number;
}

export async function initializeAppConfigs(): Promise<void> {
  try {
    // 1. Fetch from your new NestJS endpoint
    const response = await apiClient.get('/api/v1/settings/system-configs');

    // Extract the nested data object
    const data: ApiConfigResponse = response.data.data;

    // console.log(" Fetched system configs:", data);

    // 2. Inject into Zustand
    useConfigStore.getState().setConfigs({
      officeCoords: {
        latitude: data.office_lat,
        longitude: data.office_lon,
      },
      geofenceRadius: data.radius_meters,
      shiftHours: data.shift_hours,
    });

  } catch (error) {
    console.error("❌ Failed to fetch system configs:", error);

    // Frontend fallback only used if the server is offline
    const isSaturdayFallback = new Date().getDay() === 6;

    useConfigStore.getState().setConfigs({
      officeCoords: {
        latitude: 18.5339582,
        longitude: 73.839535,
      },
      geofenceRadius: 50,
      shiftHours: isSaturdayFallback ? 7 : 8.5,
    });
  }
}