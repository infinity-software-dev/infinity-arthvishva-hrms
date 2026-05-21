import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      // isInternetReachable handles cases where Wi-Fi is on, but there's no actual internet
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // The app is effectively offline if either it's disconnected OR internet is unreachable
  const isOffline = isConnected === false || isInternetReachable === false;

  return { isConnected, isInternetReachable, isOffline };
};
