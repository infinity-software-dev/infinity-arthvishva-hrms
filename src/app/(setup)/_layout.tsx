import { Stack } from "expo-router";

export default function SetUpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
