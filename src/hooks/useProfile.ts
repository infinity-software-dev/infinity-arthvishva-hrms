import { useState, useCallback, useEffect } from "react";
import { fetchProfile, EmployeeProfile } from "@/services/profileService";

export const useProfile = () => {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    state: {
      profile,
      isLoading,
    },
    actions: {
      refreshProfile: loadProfile,
    },
  };
};
