import { checkLocationPermission } from "./LocationHelper";
import { isNotificationPermissionGranted } from "./NotificationHelper";
import { checkCameraPermission } from "./CameraHelper";

export interface PermissionReport {
  location: boolean;
  notifications: boolean;
  camera: boolean;
  allMandatoryGranted: boolean; // Location + Camera are usually mandatory for HRMS
}

/**
 * Runs a full system check without triggering any popups.
 */
export async function getAppPermissionReport(): Promise<PermissionReport> {
  // Run all checks in parallel for maximum speed
  const [isLocOk, isNoteOk, isCamOk] = await Promise.all([
    checkLocationPermission(),
    isNotificationPermissionGranted(),
    checkCameraPermission(),
  ]);

  return {
    location: isLocOk,
    notifications: isNoteOk,
    camera: isCamOk,
    // We usually consider Location and Camera as 'Mandatory' to enter the app
    allMandatoryGranted: isLocOk && isCamOk && isNoteOk,
  };
}
