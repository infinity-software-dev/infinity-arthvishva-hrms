import { Stack } from "expo-router";


export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/home" />
      <Stack.Screen name="screens/profile" />
      <Stack.Screen name="screens/summary" />
      <Stack.Screen name="screens/leaves" />
      <Stack.Screen name="screens/holidays" />
      <Stack.Screen name="screens/payslips" />
      <Stack.Screen name="screens/reimburse" />
      <Stack.Screen name="screens/announce" />
      <Stack.Screen name="screens/directory" />
      <Stack.Screen name="screens/gurukul" />
      <Stack.Screen name="screens/helpdesk" />
      <Stack.Screen name="screens/resignation" />
      <Stack.Screen
        options={{ animation: "fade", headerShown: false }}
        name="(tabs)/BottomTabs"
      />
    </Stack>
  );
}
