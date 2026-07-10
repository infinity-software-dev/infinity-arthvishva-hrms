import { colors } from "@/constants/theme";
import { fetchUpcomingBirthdays } from "@/services/homeService";
import { useState, useEffect } from "react";

export interface HighlightItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  theme: string;
}

export const useHighlights = () => {
  const [updates, setUpdates] = useState<HighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHighlights = async () => {
      setIsLoading(true);
      try {
        const birthdaysData = await fetchUpcomingBirthdays();
        const dynamicHighlights: HighlightItem[] = [];

        // ─── SMART NAME FORMATTING LOGIC ───

        // 1. Pool all the birthday employees together
        const allBirthdayEmployees = [
          ...(birthdaysData.today || []),
          ...(birthdaysData.tomorrow || []),
          ...(birthdaysData.upcoming || []),
        ];

        // 2. Count how many times each first name appears
        const firstNameCounts: Record<string, number> = {};
        allBirthdayEmployees.forEach((emp) => {
          const firstName = emp.name.trim().split(" ")[0]; // Grab the first word
          firstNameCounts[firstName] = (firstNameCounts[firstName] || 0) + 1;
        });

        // 3. Helper function to decide which name to show
        const getDisplayName = (fullName: string) => {
          const firstName = fullName.trim().split(" ")[0];
          // If this first name appears more than once, return the full name.
          // Otherwise, just return the first name.
          return firstNameCounts[firstName] > 1 ? fullName : firstName;
        };

        // ───────────────────────────────────

        // Map Today's Birthdays
        if (birthdaysData.today && birthdaysData.today.length > 0) {
          birthdaysData.today.forEach((emp) => {
            const displayName = getDisplayName(emp.name); // Get smart name

            dynamicHighlights.push({
              id: `bday-today-${emp._id}`,
              type: "Birthday",
              title: `${displayName}'s Birthday`,
              desc: `Wish ${displayName} a very happy birthday today! 🎂`,
              time: "Today",
              icon: "gift",
              theme: colors.Rise_Orange,
            });
          });
        }

        // Map Tomorrow's Birthdays
        if (birthdaysData.tomorrow && birthdaysData.tomorrow.length > 0) {
          birthdaysData.tomorrow.forEach((emp) => {
            const displayName = getDisplayName(emp.name);

            dynamicHighlights.push({
              id: `bday-tmrw-${emp._id}`,
              type: "Birthday",
              title: `${displayName}'s Birthday`,
              desc: `Upcoming birthday tomorrow. Get ready to celebrate!`,
              time: "Tomorrow",
              icon: "gift",
              theme: colors.Magic_Violet,
            });
          });
        }

        // Map Upcoming Birthdays (Day after tomorrow)
        if (birthdaysData.upcoming && birthdaysData.upcoming.length > 0) {
          birthdaysData.upcoming.forEach((emp) => {
            const displayName = getDisplayName(emp.name);

            dynamicHighlights.push({
              id: `bday-upc-${emp._id}`,
              type: "Upcoming",
              title: `${displayName}'s Birthday`,
              desc: "Coming up in two days. Plan ahead!",
              time: "Upcoming",
              icon: "calendar-outline",
              theme: colors.BRAND_PRIMARY,
            });
          });
        }

        setUpdates(dynamicHighlights);
      } catch (error) {
        console.error("Failed to fetch highlights", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHighlights();
  }, []);

  return { updates, isLoading };
};