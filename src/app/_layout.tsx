import FaceScannerEngine from "@/components/ui/FaceScannerEngine";
import OfflineScreen from "@/components/ui/OfflineScreen";
import { colors } from "@/constants/theme";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import {
  Ubuntu_400Regular_Italic,
  Ubuntu_700Bold,
  useFonts,
} from "@expo-google-fonts/ubuntu";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Ubuntu_700Bold,
    Ubuntu_400Regular_Italic,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Use hideAsync() for newer Expo versions
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <OfflineScreen />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* These map directly to the (auth) and (main) folders we are creating */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(setup)" options={{ headerShown: false }} />

        {/* Shared Legal Modals */}
        <Stack.Screen
          name="legal/terms"
          options={{
            presentation: "modal",
            headerTitle: "Terms of Service",
            headerStyle: {
              backgroundColor: colors.Brand_Blue,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "Nunito_700Bold",
            },
          }}
        />
        <Stack.Screen
          name="legal/privacy"
          options={{
            presentation: "modal",
            headerTitle: "Privacy Policy",
            headerStyle: {
              backgroundColor: colors.Brand_Green,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "Nunito_700Bold",
            },
          }}
        />
        <Stack.Screen
          name="legal/licenses"
          options={{
            presentation: "modal",
            headerTitle: "Open Source Licenses",
            headerStyle: {
              backgroundColor: colors.Brand_Green,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "Nunito_700Bold",
            },
          }}
        />

        <Stack.Screen
          name="globalAlert/GlobalAlert"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "fade",
          }}
        />
      </Stack>
      <FaceScannerEngine />
    </>
  );
}
