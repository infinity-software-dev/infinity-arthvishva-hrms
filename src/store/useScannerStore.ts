import { create } from "zustand";

type OperationType = "register" | "checkin" | "checkout" | null;

interface ScannerState {
  isOpen: boolean;
  operation: OperationType;
  // Updated to hold multiple face profiles (array of arrays)
  storedDescriptors: number[][] | null;
  // Updated success callback to return the array of arrays
  onSuccess: ((descriptors: number[][], imageBase64: string) => void) | null;
  onError: ((errorMsg: string) => void) | null;

  openScanner: (
    operation: OperationType,
    storedDescriptors: number[][] | null,
    onSuccess: (descriptors: number[][], imageBase64: string) => void,
    onError: (errorMsg: string) => void,
  ) => void;
  closeScanner: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  isOpen: false,
  operation: null,
  storedDescriptors: null,
  onSuccess: null,
  onError: null,

  openScanner: (operation, storedDescriptors, onSuccess, onError) =>
    set({ isOpen: true, operation, storedDescriptors, onSuccess, onError }),

  closeScanner: () =>
    set({
      isOpen: false,
      operation: null,
      storedDescriptors: null,
      onSuccess: null,
      onError: null,
    }),
}));