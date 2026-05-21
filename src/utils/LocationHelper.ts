import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

export interface LocationData {
  latitude: number;
  longitude: number;
  mocked?: boolean;
}

/**
 * STEP 1: Check permission silently.
 * Call this on mount to determine if you need to show your custom CustomModal.
 */
export async function checkLocationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      // .check() evaluates the status without showing the OS popup
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } catch (err) {
      console.error("Permission check failed:", err);
      return false;
    }
  }

  if (Platform.OS === "ios") {
    // Note: react-native-geolocation-service doesn't have a purely silent check for iOS.
    // This will return the status, but if it's the user's first time, it WILL show the native prompt.
    const status = await Geolocation.requestAuthorization("whenInUse");
    return status === "granted";
  }

  return false;
}

/**
 * STEP 2: Actively request permission.
 * Call this when the user clicks the "Retry" or "Allow" button on your CustomModal.
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Attendance Location Required",
          message:
            "This app requires access to your location to verify your clock-in.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Permission request failed:", err);
      return false;
    }
  }

  if (Platform.OS === "ios") {
    const status = await Geolocation.requestAuthorization("whenInUse");
    return status === "granted";
  }

  return false;
}

/**
 * STEP 3: Fetch the location.
 * Call this only after you have confirmed permissions are granted.
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Capture 'mocked' flag to prevent fake GPS apps (Android primarily)
        const isMocked = Platform.OS === "android" ? position.mocked : false;

        resolve({ latitude, longitude, mocked: isMocked });
      },
      (error) => {
        console.error("Location error:", error.code, error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
      },
    );
  });
}

// Define your central office coordinates (Example: A generic coordinate in Pune)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Returns the exact distance in meters
  return Math.round(R * c);
}
