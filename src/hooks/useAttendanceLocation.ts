import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { calculateDistance } from "@/utils/LocationHelper";
import { useConfigStore } from "@/store/useConfigStore";
import { trackLocation } from "@/services/attendanceService";
import { WorkMode } from "@/hooks/useAttendanceSession";

export function useAttendanceLocation(workMode: WorkMode, status: string) {
  const { officeCoords, geofenceRadius, shiftHours } = useConfigStore();
  const [isInsideOffice, setIsInsideOffice] = useState(false);
  const [distance, setDistance] = useState<string>("Calculating...");
  const [isSpoofing, setIsSpoofing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const lastSyncedTime = useRef<number>(0);
  const TRACKING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

  // Use refs to track the latest state without triggering the useEffect to restart the GPS watcher
  const workModeRef = useRef(workMode);
  const statusRef = useRef(status);

  useEffect(() => {
    workModeRef.current = workMode;
    statusRef.current = status;
  }, [workMode, status]);

  useEffect(() => {
    if (!officeCoords) return;

    let watchId: number | null = null;

    const startTracking = () => {
      watchId = Geolocation.watchPosition(
        (position) => {
          // 1. Extract accuracy alongside lat and lng
          const { latitude, longitude, accuracy } = position.coords;
          const mocked = Platform.OS === "android" ? position.mocked : false;

          setIsSpoofing(!!mocked);
          setIsLoadingLocation(false);

          if (mocked) {
            setDistance("Spoofed GPS");
            setIsInsideOffice(false);
            return;
          }

          // 2. Filter out highly inaccurate indoor drift
          // 50 meters is a solid baseline, but you may need to tweak this 
          // based on the specific building's interference.
          if (accuracy > 50) {
            // console.log(`Skipping inaccurate location. Error margin: ${accuracy}m`);
            // We return early so we don't accidentally mark them as outside
            return;
          }

          const d = calculateDistance(
            latitude,
            longitude,
            officeCoords.latitude,
            officeCoords.longitude,
          );

          setDistance(`${d}m`);
          setIsInsideOffice(d <= geofenceRadius);

          // API Sync Logic
          const currentMode = workModeRef.current;
          const currentStatus = statusRef.current;
          const now = Date.now();

          // Condition: Check if in Field/WFH AND currently punched in
          const isEligibleForTracking =
            (currentMode === "Field" || currentMode === "WFH") &&
            currentStatus === "in";

          if (isEligibleForTracking && (now - lastSyncedTime.current >= TRACKING_INTERVAL_MS)) {
            lastSyncedTime.current = now;

            trackLocation(latitude, longitude).catch((err) => {
              console.error("Background tracking error:", err);
            });
          }
        },
        (error) => {
          console.error("Location error:", error.code, error.message);
          setDistance("--");
          setIsInsideOffice(false);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    };

    startTracking();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [officeCoords, geofenceRadius]);

  return {
    isInsideOffice,
    distance,
    isSpoofing,
    shiftHours,
    isLoadingLocation,
  };
}