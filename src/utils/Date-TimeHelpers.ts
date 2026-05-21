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