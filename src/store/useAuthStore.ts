import { Employee } from "@/apis/types";
import { create } from "zustand";

interface AuthState {
  user: Employee | null;
  isAuthenticated: boolean;
  setUser: (user: Employee) => void;
  refreshUser: (updatedFields: Partial<Employee>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Call this when login succeeds
  setUser: (user) => set({ user, isAuthenticated: true }),

  // Updates one or many properties locally inside the client state instantly
  refreshUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  // Call this when they click "Sign Out"
  logout: () => set({ user: null, isAuthenticated: false }),
}));
