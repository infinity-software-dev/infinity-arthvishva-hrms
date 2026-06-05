import { useState, useEffect } from "react";
import { AppState, Linking } from "react-native";
import { useIsFocused } from "expo-router";
import {
  checkLocationPermission,
  requestLocationPermission,
} from "@/utils/LocationHelper";

export function useLocationPermission() {
  const isFocused = useIsFocused();
  const [isVisible, setIsVisible] = useState(false);
  const [requiresSettings, setRequiresSettings] = useState(false);

  const handleLocationFlow = async () => {
    const isPermitted = await checkLocationPermission();

    if (isPermitted) {
      setIsVisible(false);
      setRequiresSettings(false);
    } else {
      setIsVisible(true);
    }
  };

  // Handle flow when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      handleLocationFlow();
    }
  }, [isFocused]);

  // Handle flow when app returns from background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        handleLocationFlow();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const handleModalConfirm = async () => {
    if (requiresSettings) {
      Linking.openSettings();
      return;
    }

    const granted = await requestLocationPermission();

    if (granted) {
      handleLocationFlow();
    } else {
      setRequiresSettings(true);
    }
  };

  return {
    isVisible,
    requiresSettings,
    handleModalConfirm,
  };
}