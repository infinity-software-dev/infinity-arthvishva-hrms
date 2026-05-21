export const getInitials = (name: string) => {
  if (!name) return "IA";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export const toTitleCase = (name: string): string => {
  if (!name) return "";

  return name
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Normalize to lowercase
    .split(/\s+/) // Split by one or more spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getFirstName = (userName: string): string => {
  return userName?.split(" ")[0] || "Employee";
};
