import { router } from "expo-router";

export const resetAndNavigate = (newPath: string) => {
  router.replace(newPath as any); // Use `any` or a more specific type casting if necessary
};
