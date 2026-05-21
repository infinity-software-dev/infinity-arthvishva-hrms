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
        // Fetch the real data from the backend
        const birthdaysData = await fetchUpcomingBirthdays();
        const dynamicHighlights: HighlightItem[] = [];

        // 1. Map Today's Birthdays
        if (birthdaysData.today && birthdaysData.today.length > 0) {
          birthdaysData.today.forEach((emp) => {
            dynamicHighlights.push({
              id: `bday-today-${emp._id}`,
              type: "Birthday",
              title: `${emp.name}'s Birthday`,
              desc: `Wish ${emp.name} a very happy birthday today! 🎂`,
              time: "Today",
              icon: "gift",
              theme: colors.Rise_Orange,
            });
          });
        }

        // 2. Map Tomorrow's Birthdays
        if (birthdaysData.tomorrow && birthdaysData.tomorrow.length > 0) {
          birthdaysData.tomorrow.forEach((emp) => {
            dynamicHighlights.push({
              id: `bday-tmrw-${emp._id}`,
              type: "Birthday",
              title: `${emp.name}'s Birthday`,
              desc: "Upcoming birthday tomorrow. Get ready to celebrate!",
              time: "Tomorrow",
              icon: "gift",
              theme: colors.Magic_Violet, // Purple
            });
          });
        }

        // 3. Keep your existing static/dummy data (Holidays, Events)
        // until you build APIs for them.
        const staticHighlights: HighlightItem[] = [
          {
            id: "static-holiday-1",
            type: "Holiday",
            title: "Buddha Purnima",
            desc: "The office will remain closed tomorrow, May 16th.",
            time: "Upcoming",
            icon: "flag",
            theme: "#16A34A",
          },
        ];

        // Combine the real API data with the static data
        // setUpdates([...dynamicHighlights, ...staticHighlights]);
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
