import { Camera } from "expo-camera";

/**
 * STEP 1: Check Camera permission silently.
 */
export async function checkCameraPermission(): Promise<boolean> {
  const status = await Camera.getCameraPermissionsAsync();
  return status.granted;
}

/**
 * STEP 2: Actively request Camera permission.
 */
export async function requestCameraPermission(): Promise<boolean> {
  const { granted } = await Camera.requestCameraPermissionsAsync();
  return granted;
}
