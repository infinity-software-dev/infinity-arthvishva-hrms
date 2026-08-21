export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// Get current date: e.g., "Wed, 13 May"
export const formattedDate = new Date().toLocaleDateString("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

// Add this helper function
export const formatTime = (timeString?: string | null) => {
  if (!timeString || timeString === "--:--") return "--:--";

  const date = new Date(timeString);

  // Fallback in case the backend sometimes sends pre-formatted strings
  if (isNaN(date.getTime())) return timeString;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export function formatHours(totalHours: number): string {
  const totalMinutes = Math.round(totalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hr${hours === 1 ? '' : 's'}`);
  }

  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes} min${minutes === 1 ? '' : 's'}`);
  }

  return parts.join(' ');
}