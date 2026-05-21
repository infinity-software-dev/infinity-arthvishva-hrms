import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack, withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

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
      <Stack.Screen
        options={{ animation: "fade", headerShown: false }}
        name="(tabs)/BottomTabs"
      />
    </Stack>
  );
}
{
  /* <MaterialTopTabs
        initialRouteName="home"
        // Notice: We removed the tabBar prop completely!
        screenOptions={{
          tabBarStyle: { display: "none" }, // Completely hide the default tab bar
          swipeEnabled: true,
        }}
      >
        <MaterialTopTabs.Screen name="profile" />
        <MaterialTopTabs.Screen name="home" />
        <MaterialTopTabs.Screen name="gallery" />
      </MaterialTopTabs> */
}
