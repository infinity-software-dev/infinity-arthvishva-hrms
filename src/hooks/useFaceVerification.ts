import { useScannerStore } from "@/store/useScannerStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useFaceVerification = () => {
  const user = useAuthStore((state) => state.user);
  const openScanner = useScannerStore((state) => state.openScanner);

  const verifyFaceAction = (
    operation: "checkin" | "checkout",
    onSuccessAction: () => void,
    onErrorAction: (title: string, message: string) => void, // Let the component handle the error UI!
  ) => {
    if (!user?.faceDescriptor || user.faceDescriptor.length !== 128) {
      onErrorAction(
        "Face ID Required",
        "You must register your biometric profile in the settings before proceeding.",
      );
      return;
    }

    openScanner(
      operation,
      user.faceDescriptor,
      () => onSuccessAction(),
      (errorMsg) =>
        onErrorAction(
          `${operation === "checkin" ? "Check-In" : "Check-Out"} Failed`,
          errorMsg,
        ),
    );
  };

  return { verifyFaceAction };
};
