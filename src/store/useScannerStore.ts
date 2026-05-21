import { create } from "zustand";

type OperationType = "register" | "checkin" | "checkout" | null;

interface ScannerState {
  isOpen: boolean;
  operation: OperationType;
  storedDescriptor: number[] | null;
  onSuccess: ((descriptor: number[], imageBase64: string) => void) | null;
  onError: ((errorMsg: string) => void) | null;

  openScanner: (
    operation: OperationType,
    storedDescriptor: number[] | null,
    onSuccess: (descriptor: number[], imageBase64: string) => void,
    onError: (errorMsg: string) => void,
  ) => void;
  closeScanner: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  isOpen: false,
  operation: null,
  storedDescriptor: null,
  onSuccess: null,
  onError: null,

  openScanner: (operation, storedDescriptor, onSuccess, onError) =>
    set({ isOpen: true, operation, storedDescriptor, onSuccess, onError }),

  closeScanner: () =>
    set({
      isOpen: false,
      operation: null,
      storedDescriptor: null,
      onSuccess: null,
      onError: null,
    }),
}));
