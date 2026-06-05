import { Employee } from "@/apis/types";
import { getMyProfile } from "@/services/profileService";
import { create } from "zustand";

interface AuthState {
  user: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Track loading state if needed
  setUser: (user: Employee) => void;
  refreshUser: (updatedFields: Partial<Employee>) => void;
  fetchLatestProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  refreshUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  // New Action: Fetches from backend and updates Zustand state
  fetchLatestProfile: async () => {
    try {
      set({ isLoading: true });
      const latestData = await getMyProfile();

      // Check if data actually exists and isn't empty
      if (latestData && Object.keys(latestData).length > 0) {
        set((state) => ({
          user: state.user ? { ...state.user, ...latestData } : latestData,
          isAuthenticated: true, // Safeguard auth state
        }));
      } else {
        console.warn("Fetch profile returned empty or invalid data.");
        // Optional: Handle fallback if user data is completely missing
        // e.g., if state.user is null, you might want to force a logout
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));