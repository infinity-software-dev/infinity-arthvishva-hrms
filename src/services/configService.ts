import { useConfigStore } from "@/store/useConfigStore";

// Define the shape of your expected NestJS response
interface ApiConfigResponse {
  office_lat: number;
  office_lon: number;
  radius_meters: number;
  shift_hours: number;
}

/**
 * Fetches dynamic application configurations from the backend
 * and hydrates the global Zustand store.
 */
export async function initializeAppConfigs(): Promise<void> {
  try {
    // Replace this with your actual NestJS endpoint
    // const response = await fetch('https://api.yourdomain.com/v1/settings/app-configs');

    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.status}`);
    // }
    // const data: ApiConfigResponse = await response.json();

    // Check if today is Saturday (6)
    const isSaturday = new Date().getDay() === 6;
    const currentShiftHours = isSaturday ? 7 : 8.5;

    // --- SIMULATED API DELAY AND RESPONSE FOR TESTING ---
    await new Promise((resolve) => setTimeout(resolve, 800));
    const data: ApiConfigResponse = {
      office_lat: 18.5339582, // Your testing coordinates
      office_lon: 73.839535,
      radius_meters: 50,
      shift_hours: currentShiftHours,
    };
    // ----------------------------------------------------

    // Inject the payload directly into Zustand
    // .getState() allows us to update the store outside of a React component
    useConfigStore.getState().setConfigs({
      officeCoords: {
        latitude: data.office_lat,
        longitude: data.office_lon,
      },
      geofenceRadius: data.radius_meters,
      shiftHours: data.shift_hours,
    });

    // console.log("✅ App Configs loaded successfully.");
  } catch (error) {
    console.error("❌ Failed to fetch app configs:", error);

    const isSaturday = new Date().getDay() === 6;
    const currentShiftHours = isSaturday ? 7 : 8.5;

    // Enterprise Fallback: If the API fails (e.g., bad network),
    // inject safe default coordinates so the app doesn't freeze on the splash screen.
    useConfigStore.getState().setConfigs({
      officeCoords: {
        latitude: 18.5339582, // Generic Pune fallback
        longitude: 73.839535,
      },
      geofenceRadius: 50,
      shiftHours: currentShiftHours,
    });
  }
}

