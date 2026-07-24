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

export const getFirstName = (fullName: string) => {
  if (!fullName) return "";

  const trimmed = fullName.trim();

  // 1. Remove common prefixes (supports optional dot AND optional space, e.g., "Ms.Pooja" or "Ms. Pooja")
  const cleanedName = trimmed.replace(
    /^(mr|mrs|ms|miss|dr|prof|mx|shri|smt|er|adv)\.?\s*/i,
    ""
  );

  // 2. Extract first word
  const firstName = cleanedName.split(/\s+/)[0];

  // 3. Fallback to original first word if removing prefix resulted in an empty string
  const result = firstName || trimmed.split(/\s+/)[0];

  return toTitleCase(result);
};
