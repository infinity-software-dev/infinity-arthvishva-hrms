import { create } from "zustand";

// 1. Define the exact shape of your data
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AppConfigState {
  // --- Data ---
  officeCoords: Coordinates | null;
  geofenceRadius: number; // Stored in meters
  shiftHours:number;
  isConfigLoaded: boolean; // Tells the app if it's safe to render the dashboard

  // --- Actions ---
  // Partial<Omit<...>> means we can pass just one config to update, or all of them at once
  setConfigs: (
    configs: Partial<Omit<AppConfigState, "setConfigs" | "clearConfigs">>,
  ) => void;
  clearConfigs: () => void;
}

// 2. Create the Store
export const useConfigStore = create<AppConfigState>((set) => ({
  // Default values before API loads
  officeCoords: null,
  geofenceRadius: 100, // A safe default fallback
  shiftHours:8.5,
  isConfigLoaded: false,

  // Merges new configs into the existing state
  setConfigs: (configs) =>
    set((state) => ({
      ...state,
      ...configs,
      isConfigLoaded: true, // Automatically mark as loaded once data is injected
    })),

  // Wipes the configs (useful if Krunal logs out or switches accounts)
  clearConfigs: () =>
    set({
      officeCoords: null,
      geofenceRadius: 100,
      shiftHours:8.5,
      isConfigLoaded: false,
    }),
}));
